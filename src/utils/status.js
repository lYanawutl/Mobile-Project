export const ORDER_STATUS = {
  pending: "pending",
  cooking: "cooking",
  ready: "ready",
  served: "served",
  cancelled: "cancelled",
};

export const BILL_STATUS = {
  open: "open",
  closed: "closed",
};

export const CANCELLED_BY = {
  customer: "customer",
  kitchen: "kitchen",
};

export const STATUS_LABEL = {
  [ORDER_STATUS.pending]: "รอทำ",
  [ORDER_STATUS.cooking]: "กำลังทำ",
  [ORDER_STATUS.ready]: "พร้อมเสิร์ฟ",
  [ORDER_STATUS.served]: "เสิร์ฟแล้ว",
  [ORDER_STATUS.cancelled]: "ยกเลิก",
};

export const CANCEL_BY_LABEL = {
  [CANCELLED_BY.customer]: "ลูกค้า",
  [CANCELLED_BY.kitchen]: "ครัว",
};

export const CUSTOMER_CANCEL_REASONS = ["สั่งผิด", "เปลี่ยนใจ", "รอนานเกินไป"];
export const KITCHEN_CANCEL_REASONS = [
  "ของหมด",
  "วัตถุดิบไม่พอ",
  "ลูกค้าแจ้งเปลี่ยน",
];
