import { ORDER_STATUS } from "./status";

const { pending, cooking, ready } = ORDER_STATUS;

export const KITCHEN_FILTER = {
  all: "all",
  cooking,
  ready,
  pending,
};


export const ITEM_ACTION_LABEL = {
  [pending]: "เริ่มทำ",
  [cooking]: "เสร็จแล้ว",
  [ready]: "เสิร์ฟแล้ว",
};


export const PROGRESS_STEPS = ["รับออเดอร์", "กำลังทำ", "พร้อมเสิร์ฟ", "เสิร์ฟแล้ว"];

export function tableStatusOf(items) {
  if (items.some((item) => item.status === cooking)) {
    return cooking;
  }
  if (items.some((item) => item.status === pending)) {
    return pending;
  }
  return ready;
}

export function progressIndexOf(tableStatus) {
  if (tableStatus === cooking) {
    return 1;
  }
  if (tableStatus === ready) {
    return 2;
  }
  return 0;
}

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

export function countTablesByStatus(tables) {
  const counts = { [KITCHEN_FILTER.all]: tables.length, [cooking]: 0, [ready]: 0, [pending]: 0 };
  for (const table of tables) {
    counts[table.status] += 1;
  }
  return counts;
}
