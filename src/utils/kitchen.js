// ตรรกะของหน้าครัว: จัดรายการเป็นการ์ดต่อโต๊ะ สถานะรวมของโต๊ะ และปุ่มที่ต้องกดถัดไป
// (จัดกลุ่มและเลือกปุ่มเท่านั้น ไม่มีการคำนวณเงิน)
import { ORDER_STATUS } from "./status";

const { pending, cooking, ready } = ORDER_STATUS;

export const KITCHEN_FILTER = {
  all: "all",
  cooking,
  ready,
  pending,
};

// ป้ายของปุ่มเปลี่ยนสถานะรายการเดียว ตามสถานะปัจจุบัน
export const ITEM_ACTION_LABEL = {
  [pending]: "เริ่มทำ",
  [cooking]: "เสร็จแล้ว",
  [ready]: "เสิร์ฟแล้ว",
};

// ขั้นของออเดอร์ที่แสดงในแถบความคืบหน้า
export const PROGRESS_STEPS = ["รับออเดอร์", "กำลังทำ", "พร้อมเสิร์ฟ", "เสิร์ฟแล้ว"];

// สถานะรวมของโต๊ะ บอกว่าครัวต้องทำอะไรต่อ
// มีรายการกำลังทำ = กำลังทำ / ไม่มีแต่ยังมีรอทำ = รอทำ / เหลือแต่พร้อมเสิร์ฟ = พร้อมเสิร์ฟ
export function tableStatusOf(items) {
  if (items.some((item) => item.status === cooking)) {
    return cooking;
  }
  if (items.some((item) => item.status === pending)) {
    return pending;
  }
  return ready;
}

// ตำแหน่งปัจจุบันในแถบความคืบหน้า (0 = รับออเดอร์)
export function progressIndexOf(tableStatus) {
  if (tableStatus === cooking) {
    return 1;
  }
  if (tableStatus === ready) {
    return 2;
  }
  return 0;
}

// ปุ่มหลักของโต๊ะ: เลื่อนทุกรายการที่อยู่สถานะเดียวกันไปขั้นถัดไปพร้อมกัน
export function primaryActionOf(items) {
  if (items.some((item) => item.status === cooking)) {
    return { from: cooking, label: "ทำเสร็จแล้ว" };
  }
  if (items.some((item) => item.status === pending)) {
    return { from: pending, label: "เริ่มทำทั้งหมด" };
  }
  if (items.some((item) => item.status === ready)) {
    return { from: ready, label: "เสิร์ฟครบแล้ว" };
  }
  return null;
}

// รายการจาก SQL เรียงเก่าสุดก่อนอยู่แล้ว โต๊ะจึงเรียงตามรายการที่เก่าสุดของโต๊ะ (ก7)
export function groupKitchenTables(items) {
  const tables = [];
  const byBill = new Map();
  for (const item of items) {
    let table = byBill.get(item.bill_id);
    if (!table) {
      table = {
        billId: item.bill_id,
        tableNo: item.table_no,
        guestCount: item.guest_count,
        firstOrderedAt: item.ordered_at,
        items: [],
      };
      byBill.set(item.bill_id, table);
      tables.push(table);
    }
    table.items.push(item);
  }
  return tables.map((table) => ({ ...table, status: tableStatusOf(table.items) }));
}

// จำนวนโต๊ะในแต่ละตัวกรอง
export function countTablesByStatus(tables) {
  const counts = { [KITCHEN_FILTER.all]: tables.length, [cooking]: 0, [ready]: 0, [pending]: 0 };
  for (const table of tables) {
    counts[table.status] += 1;
  }
  return counts;
}
