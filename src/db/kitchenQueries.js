// คำสั่ง SQL ฝั่งครัว
import { ORDER_STATUS } from "../utils/status";

// สถานะที่ครัวเปลี่ยนได้ทางเดียว: รอทำ -> กำลังทำ -> พร้อมเสิร์ฟ -> เสิร์ฟแล้ว
const NEXT_STATUS = {
  [ORDER_STATUS.pending]: ORDER_STATUS.cooking,
  [ORDER_STATUS.cooking]: ORDER_STATUS.ready,
  [ORDER_STATUS.ready]: ORDER_STATUS.served,
};

// รายการที่ครัวยังต้องจัดการ (รอทำ กำลังทำ พร้อมเสิร์ฟ) ของทุกโต๊ะ
// เรียงตามเวลาที่สั่ง รายการเก่าสุดขึ้นก่อน (ก7) พร้อมโต๊ะ รอบ และหมายเหตุ (ก9)
// หน้าครัวจัดกลุ่มตามบิลเอง ลำดับโต๊ะจึงตามรายการที่เก่าสุดของโต๊ะนั้น
export async function getKitchenQueue(db) {
  return db.getAllAsync(
    `SELECT l.id, l.bill_id, l.status, l.quantity, l.note, l.round_no, l.ordered_at,
            l.name, l.image, l.options_text, l.line_total,
            t.table_no, b.guest_count
     FROM order_lines l
     JOIN bills b ON b.id = l.bill_id
     JOIN dining_tables t ON t.id = b.table_id
     WHERE l.status IN ('pending', 'cooking', 'ready')
     ORDER BY l.ordered_at, l.round_id, l.id`,
  );
}

// เปลี่ยนสถานะรายการเดียวไปขั้นถัดไป โดยเช็กว่าสถานะปัจจุบันยังเป็นค่าที่หน้าจอเห็นอยู่
// (กันกรณีรายการถูกยกเลิกหรือเปลี่ยนไปแล้ว) คืน true ถ้าเปลี่ยนสำเร็จ
export async function advanceItemStatus(db, orderItemId, currentStatus) {
  const nextStatus = NEXT_STATUS[currentStatus];
  if (!nextStatus) {
    return false;
  }
  const result = await db.runAsync(
    "UPDATE order_items SET status = ? WHERE id = ? AND status = ?",
    [nextStatus, orderItemId, currentStatus],
  );
  return result.changes > 0;
}

// เปลี่ยนสถานะทุกรายการของบิลที่อยู่ในสถานะ currentStatus ไปขั้นถัดไปพร้อมกัน
// (ปุ่มหลักของหน้าครัว เช่น "ทำเสร็จแล้ว" = กำลังทำทั้งหมด -> พร้อมเสิร์ฟ)
// เป็น UPDATE คำสั่งเดียว จึงสำเร็จหรือไม่สำเร็จทั้งชุด คืนจำนวนรายการที่เปลี่ยน
export async function advanceBillItems(db, billId, currentStatus) {
  const nextStatus = NEXT_STATUS[currentStatus];
  if (!nextStatus) {
    return 0;
  }
  const result = await db.runAsync(
    `UPDATE order_items
     SET status = ?
     WHERE status = ?
       AND round_id IN (SELECT id FROM order_rounds WHERE bill_id = ?)`,
    [nextStatus, currentStatus, billId],
  );
  return result.changes;
}

// ข้อความ "ลูกค้ายกเลิก" ที่ครัวยังไม่กดรับทราบ
export async function getCustomerCancelNotices(db) {
  return db.getAllAsync(
    `SELECT l.id, l.name, l.quantity, l.round_no, t.table_no,
            l.cancel_reason, l.cancelled_at
     FROM order_lines l
     JOIN bills b ON b.id = l.bill_id
     JOIN dining_tables t ON t.id = b.table_id
     WHERE l.status = 'cancelled'
       AND l.cancelled_by = 'customer'
       AND l.cancel_ack_at IS NULL
     ORDER BY l.cancelled_at, l.id`,
  );
}

// ตัวเลขบนแท็บครัวและกระดิ่งแจ้งเตือน
export async function getKitchenNoticeCount(db) {
  const row = await db.getFirstAsync(
    `SELECT COUNT(*) AS n
     FROM order_items
     WHERE status = 'cancelled'
       AND cancelled_by = 'customer'
       AND cancel_ack_at IS NULL`,
  );
  return row.n;
}

export async function acknowledgeCustomerCancel(db, orderItemId) {
  await db.runAsync(
    `UPDATE order_items
     SET cancel_ack_at = datetime('now', 'localtime')
     WHERE id = ?
       AND status = 'cancelled'
       AND cancelled_by = 'customer'
       AND cancel_ack_at IS NULL`,
    [orderItemId],
  );
}
