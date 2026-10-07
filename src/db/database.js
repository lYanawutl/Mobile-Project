import { SCHEMA_SQL } from "./schema";
import { seedInitialData } from "./seed";

// ชื่อไฟล์ฐานข้อมูลของโปรเจกต์นี้ ต้องไม่ซ้ำกับโปรเจกต์อื่นในเครื่อง
// เลขท้าย (_v2) คือรุ่นของโครงตาราง ระหว่างพัฒนาถ้าแก้โครงตารางแบบที่ ALTER TABLE ทำไม่ได้
// (เช่นแก้ CHECK) ให้เพิ่มเลขนี้ แอปจะสร้างไฟล์ใหม่ตามโครงล่าสุดให้ทุกเครื่อง
//   v1 = รูปเมนูเป็น URL / v2 = รูปเมนูเป็นไฟล์ในแอป (โฟลเดอร์ lip/)
export const DATABASE_NAME = "restaurant_order_01418342_v2.db";

// ใช้เป็น onInit ของ SQLiteProvider ใน App.js (ที่เดียวที่เปิดฐานข้อมูล)
export async function initDB(db) {
  // foreign_keys เป็นค่าของการเชื่อมต่อ ต้องสั่งทุกครั้งที่เปิด
  // และต้องสั่งนอกทรานแซกชัน ไม่เช่นนั้น SQLite จะเมินคำสั่งนี้
  await db.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");

  // user_version เริ่มที่ 0 ในไฟล์ใหม่ ใช้บอกว่าสร้างตารางและใส่ข้อมูลตั้งต้นแล้วหรือยัง
  const row = await db.getFirstAsync("PRAGMA user_version");
  const version = row?.user_version ?? 0;

  if (version === 0) {
    // สร้างโครงสร้าง ใส่ข้อมูลตั้งต้น และบันทึกเวอร์ชัน ในทรานแซกชันเดียว
    // ถ้าขั้นใดล้ม ทุกอย่างย้อนกลับ ครั้งหน้าที่เปิดแอปจะเริ่มใหม่จาก 0
    await db.withTransactionAsync(async () => {
      await db.execAsync(SCHEMA_SQL);
      await seedInitialData(db);
      await db.execAsync("PRAGMA user_version = 1");
    });
  }
}
