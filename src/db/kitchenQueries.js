import { ORDER_STATUS } from "../utils/status";

const NEXT_STATUS = {
  [ORDER_STATUS.pending]: ORDER_STATUS.cooking,
  [ORDER_STATUS.cooking]: ORDER_STATUS.ready,
  [ORDER_STATUS.ready]: ORDER_STATUS.served,
};

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
