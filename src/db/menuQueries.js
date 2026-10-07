// คำสั่ง SQL ของเมนู หมวดหมู่ และตัวเลือก (รวมส่วนตั้งค่าเมนู ข5)
// ค่าจากผู้ใช้ทุกค่าส่งผ่านเครื่องหมาย ? เท่านั้น

export async function getCategories(db) {
  return db.getAllAsync("SELECT id, name FROM categories ORDER BY id");
}

// search ว่าง = ทุกเมนู, categoryId 0 = ทุกหมวด, onlyAvailable = เฉพาะรายการที่มีของ (ข2)
export async function getMenuItems(
  db,
  { search = "", categoryId = 0, onlyAvailable = false } = {},
) {
  const keyword = search.trim();
  return db.getAllAsync(
    `SELECT m.id, m.category_id, c.name AS category_name,
            m.name, m.price, m.image, m.is_available
     FROM menu_items m
     JOIN categories c ON c.id = m.category_id
     WHERE (? = '' OR instr(lower(m.name), lower(?)) > 0)
       AND (? = 0 OR m.category_id = ?)
       AND (? = 0 OR m.is_available = 1)
     ORDER BY m.category_id, m.id`,
    [keyword, keyword, categoryId, categoryId, onlyAvailable ? 1 : 0],
  );
}

export async function getMenuItemById(db, menuItemId) {
  return db.getFirstAsync(
    `SELECT m.id, m.category_id, c.name AS category_name,
            m.name, m.price, m.image, m.is_available
     FROM menu_items m
     JOIN categories c ON c.id = m.category_id
     WHERE m.id = ?`,
    [menuItemId],
  );
}

// ตัวเลือกที่เมนูนี้เลือกเพิ่มได้ (ผ่านตารางจับคู่ menu_item_options)
export async function getMenuItemOptions(db, menuItemId) {
  return db.getAllAsync(
    `SELECT o.id, o.name, o.price_delta
     FROM menu_item_options mo
     JOIN options o ON o.id = mo.option_id
     WHERE mo.menu_item_id = ?
     ORDER BY o.id`,
    [menuItemId],
  );
}

export async function getAllOptions(db) {
  return db.getAllAsync(
    "SELECT id, name, price_delta FROM options ORDER BY id",
  );
}

// เพิ่มเมนูใหม่พร้อมตัวเลือกที่ใช้ได้ ในทรานแซกชันเดียว
// image เป็น null ได้ (ไม่มีรูป)
export async function addMenuItem(
  db,
  { categoryId, name, price, image, optionIds },
) {
  let newId = null;
  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      "INSERT INTO menu_items (category_id, name, price, image) VALUES (?, ?, ?, ?)",
      [categoryId, name.trim(), price, image],
    );
    newId = result.lastInsertRowId;
    for (const optionId of optionIds) {
      await db.runAsync(
        "INSERT INTO menu_item_options (menu_item_id, option_id) VALUES (?, ?)",
        [newId, optionId],
      );
    }
  });
  return newId;
}

// แก้ราคา รูป และตัวเลือกของเมนู บิลเก่าไม่เปลี่ยนเพราะเก็บราคา ณ ตอนสั่งไว้แล้ว
// ไม่ให้แก้ชื่อ เพื่อไม่ให้ชื่อรายการในบิลเก่าเปลี่ยนตาม
export async function updateMenuItem(
  db,
  menuItemId,
  { price, image, optionIds },
) {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      "UPDATE menu_items SET price = ?, image = ? WHERE id = ?",
      [price, image, menuItemId],
    );
    await db.runAsync("DELETE FROM menu_item_options WHERE menu_item_id = ?", [
      menuItemId,
    ]);
    for (const optionId of optionIds) {
      await db.runAsync(
        "INSERT INTO menu_item_options (menu_item_id, option_id) VALUES (?, ?)",
        [menuItemId, optionId],
      );
    }
  });
}

export async function setMenuItemAvailable(db, menuItemId, isAvailable) {
  await db.runAsync("UPDATE menu_items SET is_available = ? WHERE id = ?", [
    isAvailable ? 1 : 0,
    menuItemId,
  ]);
}
