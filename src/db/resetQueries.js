import { seedInitialData } from "./seed";

// ลบข้อมูลทุกตารางโดยเรียงจากลูกไปหาแม่ เพื่อไม่ชน ON DELETE RESTRICT
// sqlite_sequence ถูกล้างด้วย เลข id จึงเริ่มนับใหม่เหมือนติดตั้งครั้งแรก
const WIPE_SQL = `
DELETE FROM order_item_options;
DELETE FROM order_items;
DELETE FROM order_rounds;
DELETE FROM bills;
DELETE FROM menu_item_options;
DELETE FROM menu_items;
DELETE FROM options;
DELETE FROM categories;
DELETE FROM dining_tables;
DELETE FROM sqlite_sequence;
`;

// ล้างข้อมูลการขายทั้งหมดและคืนเมนู ราคา ตัวเลือก โต๊ะ เป็นชุดตั้งต้น
// (ผู้ตรวจอาจแก้ราคาหรือเพิ่มเมนูไว้ก่อนกดล้าง) ทำในทรานแซกชันเดียว
export async function resetAllData(db) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(WIPE_SQL);
    await seedInitialData(db);
  });
}
