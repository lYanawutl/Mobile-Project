// สร้างจาก schema.sql (ตัดเฉพาะบรรทัด PRAGMA ออก) ต้องแก้สองไฟล์ให้ตรงกันเสมอ
// PRAGMA foreign_keys สั่งใน initDB (database.js) แยกต่างหาก
export const SCHEMA_SQL = `
-- ============================================================
-- schema.sql : แอปสั่งอาหารสำหรับลูกค้าที่นั่งในร้าน (01418342)
-- ฐานข้อมูล SQLite (expo-sqlite) มี 9 ตาราง 9 FOREIGN KEY 4 INDEX 1 VIEW
--
-- หลักการสำคัญ
--  1) ราคาทุกคอลัมน์เป็นจำนวนเต็มหน่วยบาท ไม่ใช้ REAL
--     และมี CHECK (typeof(...) = 'integer') กันค่าทศนิยมที่ SQLite ยอมให้ใส่ลง INTEGER
--  2) ราคา ณ ตอนสั่งถูกคัดลอกเก็บไว้ที่ order_items.unit_price และ
--     order_item_options.price_delta ยอดบิลคำนวณจากสองคอลัมน์นี้เท่านั้น
--     การแก้ราคาในเมนูจึงไม่กระทบบิลเก่า
--  3) ON DELETE: ลูกที่เป็นส่วนหนึ่งของแม่ใช้ CASCADE
--     ลูกที่แค่อ้างถึงข้อมูลหลักใช้ RESTRICT
--  4) สูตรราคาต่อรายการเขียนไว้ที่เดียวใน VIEW order_lines
--     ทุก query ที่ต้องใช้ราคา (ยอดบิล รายการในบิล ประวัติ) อ่านจาก view นี้
-- ============================================================

-- ------------------------------------------------------------
-- ฝั่งเมนู
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT    NOT NULL UNIQUE CHECK (length(trim(name)) > 0)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id  INTEGER NOT NULL,
  name         TEXT    NOT NULL UNIQUE CHECK (length(trim(name)) > 0),
  price        INTEGER NOT NULL CHECK (typeof(price) = 'integer' AND price > 0),
  is_available INTEGER NOT NULL DEFAULT 1 CHECK (is_available IN (0, 1)),
  -- ชื่อไฟล์รูปเมนูที่แพ็กมากับแอป (โฟลเดอร์ lip/) ไม่เก็บตัวรูป และไม่ใช้รูปจากเน็ต
  -- เพื่อให้รูปขึ้นแม้ร้านไม่มีอินเทอร์เน็ต NULL = ไม่มีรูป
  image        TEXT    CHECK (image IS NULL OR length(trim(image)) > 0),
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE RESTRICT
);

-- คลังตัวเลือกกลาง เช่น ไข่ดาว พิเศษ (ติ๊กเพิ่มอย่างเดียว)
CREATE TABLE IF NOT EXISTS options (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL UNIQUE CHECK (length(trim(name)) > 0),
  price_delta INTEGER NOT NULL CHECK (typeof(price_delta) = 'integer' AND price_delta >= 0)
);

-- ตารางจับคู่ (many-to-many): เมนูไหนเลือกตัวเลือกอะไรได้บ้าง
CREATE TABLE IF NOT EXISTS menu_item_options (
  menu_item_id INTEGER NOT NULL,
  option_id    INTEGER NOT NULL,
  PRIMARY KEY (menu_item_id, option_id),
  FOREIGN KEY (menu_item_id) REFERENCES menu_items (id) ON DELETE CASCADE,
  FOREIGN KEY (option_id)    REFERENCES options (id)    ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- ฝั่งการสั่ง
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS dining_tables (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  table_no INTEGER NOT NULL UNIQUE CHECK (typeof(table_no) = 'integer' AND table_no > 0)
);

CREATE TABLE IF NOT EXISTS bills (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id  INTEGER NOT NULL,
  status    TEXT    NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  -- จำนวนลูกค้าที่นั่งโต๊ะนี้ (กรอกตอนเปิดโต๊ะ ใช้แสดงในหน้าครัว)
  guest_count INTEGER NOT NULL DEFAULT 1
              CHECK (typeof(guest_count) = 'integer' AND guest_count BETWEEN 1 AND 30),
  opened_at TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
  closed_at TEXT,
  FOREIGN KEY (table_id) REFERENCES dining_tables (id) ON DELETE RESTRICT,
  -- สถานะกับเวลาปิดต้องตรงกันเสมอ
  CHECK (
    (status = 'open'   AND closed_at IS NULL) OR
    (status = 'closed' AND closed_at IS NOT NULL)
  )
);

-- หนึ่งรอบการสั่ง = การกดยืนยันส่งเข้าครัวหนึ่งครั้ง
CREATE TABLE IF NOT EXISTS order_rounds (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  bill_id    INTEGER NOT NULL,
  round_no   INTEGER NOT NULL CHECK (typeof(round_no) = 'integer' AND round_no >= 1),
  ordered_at TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
  FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  round_id      INTEGER NOT NULL,
  menu_item_id  INTEGER NOT NULL,
  quantity      INTEGER NOT NULL CHECK (typeof(quantity) = 'integer' AND quantity > 0),
  unit_price    INTEGER NOT NULL CHECK (typeof(unit_price) = 'integer' AND unit_price > 0), -- ราคา ณ ตอนสั่ง
  note          TEXT    NOT NULL DEFAULT '',
  -- รอทำ -> กำลังทำ -> พร้อมเสิร์ฟ -> เสิร์ฟแล้ว (หรือยกเลิก ได้เฉพาะตอนรอทำ)
  status        TEXT    NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'cooking', 'ready', 'served', 'cancelled')),

  -- ข้อมูลการยกเลิก (ข3) และการแจ้งเตือนอีกฝ่าย
  cancelled_by  TEXT    CHECK (cancelled_by IN ('customer', 'kitchen')),
  cancel_reason TEXT    CHECK (length(trim(cancel_reason)) > 0),
  cancelled_at  TEXT,
  cancel_ack_at TEXT,   -- เวลาที่อีกฝ่ายกดรับทราบ (NULL = ยังไม่รับทราบ)

  FOREIGN KEY (round_id)     REFERENCES order_rounds (id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items (id)   ON DELETE RESTRICT,

  -- รายการที่ยกเลิกต้องมีผู้ยกเลิก เหตุผล และเวลาครบ
  -- รายการอื่นต้องว่างทั้งสี่ช่อง
  CHECK (
    (status = 'cancelled'
       AND cancelled_by  IS NOT NULL
       AND cancel_reason IS NOT NULL
       AND cancelled_at  IS NOT NULL)
    OR
    (status <> 'cancelled'
       AND cancelled_by  IS NULL
       AND cancel_reason IS NULL
       AND cancelled_at  IS NULL
       AND cancel_ack_at IS NULL)
  )
);

-- ตัวเลือกที่ลูกค้าเลือกในแต่ละรายการที่สั่ง
CREATE TABLE IF NOT EXISTS order_item_options (
  order_item_id INTEGER NOT NULL,
  option_id     INTEGER NOT NULL,
  price_delta   INTEGER NOT NULL CHECK (typeof(price_delta) = 'integer' AND price_delta >= 0), -- ราคา ณ ตอนสั่ง
  PRIMARY KEY (order_item_id, option_id),
  FOREIGN KEY (order_item_id) REFERENCES order_items (id) ON DELETE CASCADE,
  FOREIGN KEY (option_id)     REFERENCES options (id)     ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- INDEX
-- ------------------------------------------------------------

-- 1) หนึ่งโต๊ะเปิดบิลได้ใบเดียว และใช้ค้นบิลที่เปิดอยู่ของโต๊ะ
CREATE UNIQUE INDEX IF NOT EXISTS idx_bills_one_open_per_table
  ON bills (table_id) WHERE status = 'open';

-- 2) เลขรอบห้ามซ้ำในบิลเดียว และใช้ดึงรอบของบิลเรียงตามเลขรอบ
CREATE UNIQUE INDEX IF NOT EXISTS idx_order_rounds_bill_round
  ON order_rounds (bill_id, round_no);

-- 3) ใช้ตอนสรุปบิล (JOIN จากรอบไปรายการ) SQLite ไม่สร้างดัชนีให้คอลัมน์ FK เอง
CREATE INDEX IF NOT EXISTS idx_order_items_round
  ON order_items (round_id);

-- 4) ใช้ตอนดึงคิวครัว (กรองตามสถานะ)
CREATE INDEX IF NOT EXISTS idx_order_items_status
  ON order_items (status);

-- ------------------------------------------------------------
-- VIEW
-- ------------------------------------------------------------

-- รายการที่สั่ง พร้อมราคาต่อหน่วยและราคารวมที่คำนวณจากราคา ณ ตอนสั่ง
--   unit_total = unit_price + ราคาตัวเลือกที่เลือก
--   line_total = quantity * unit_total
-- รวมราคาตัวเลือกด้วย subquery ต่อรายการ ไม่ JOIN ตาราง order_item_options ตรง ๆ
-- เพราะการ JOIN จะทำให้รายการที่มีหลายตัวเลือกกลายเป็นหลายแถว แล้ว SUM นับราคาเมนูซ้ำ
CREATE VIEW IF NOT EXISTS order_lines AS
SELECT q.*,
       q.unit_price + q.options_price AS unit_total,
       q.quantity * (q.unit_price + q.options_price) AS line_total
FROM (
  SELECT oi.id, r.bill_id, oi.round_id, r.round_no, r.ordered_at,
         oi.menu_item_id, m.name, m.image, oi.quantity, oi.unit_price, oi.note, oi.status,
         oi.cancelled_by, oi.cancel_reason, oi.cancelled_at, oi.cancel_ack_at,
         COALESCE((SELECT SUM(oo.price_delta)
                   FROM order_item_options oo
                   WHERE oo.order_item_id = oi.id), 0) AS options_price,
         COALESCE((SELECT group_concat(o.name, ', ')
                   FROM order_item_options oo
                   JOIN options o ON o.id = oo.option_id
                   WHERE oo.order_item_id = oi.id), '') AS options_text
  FROM order_items oi
  JOIN order_rounds r ON r.id = oi.round_id
  JOIN menu_items m ON m.id = oi.menu_item_id
) q;
`;
