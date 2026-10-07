export async function getTables(db) {
  return db.getAllAsync(
    `SELECT t.id, t.table_no, b.id AS open_bill_id,
            (SELECT COUNT(*)
             FROM order_lines l
             WHERE l.bill_id = b.id
               AND l.status = 'cancelled'
               AND l.cancelled_by = 'kitchen'
               AND l.cancel_ack_at IS NULL) AS notice_count
     FROM dining_tables t
     LEFT JOIN bills b ON b.table_id = t.id AND b.status = 'open'
     ORDER BY t.table_no`,
  );
}
export async function getTable(db, tableId) {
  return db.getFirstAsync(
    `SELECT t.id, t.table_no, b.id AS open_bill_id
     FROM dining_tables t
     LEFT JOIN bills b ON b.table_id = t.id AND b.status = 'open'
     WHERE t.id = ?`,
    [tableId],
  );
}
export async function openBill(db, tableId, guestCount = 1) {
  const existing = await db.getFirstAsync(
    "SELECT id FROM bills WHERE table_id = ? AND status = 'open'",
    [tableId],
  );
  if (existing) {
    return existing.id;
  }
  const result = await db.runAsync(
    "INSERT INTO bills (table_id, guest_count) VALUES (?, ?)",
    [tableId, guestCount],
  );
  return result.lastInsertRowId;
}

export async function getBill(db, billId) {
  return db.getFirstAsync(
    `SELECT b.id, b.table_id, t.table_no, b.status, b.guest_count, b.opened_at, b.closed_at
     FROM bills b
     JOIN dining_tables t ON t.id = b.table_id
     WHERE b.id = ?`,
    [billId],
  );
}

export async function getBillTotal(db, billId) {
  const row = await db.getFirstAsync(
    `SELECT COALESCE(SUM(line_total), 0) AS total
     FROM order_lines
     WHERE bill_id = ? AND status <> 'cancelled'`,
    [billId],
  );
  return row.total;
}
export async function getBillLines(db, billId) {
  return db.getAllAsync(
    `SELECT id, round_no, ordered_at, name, quantity, unit_price, note, status,
            cancelled_by, cancel_reason, cancelled_at,
            options_price, options_text, unit_total, line_total
     FROM order_lines
     WHERE bill_id = ?
     ORDER BY round_no, id`,
    [billId],
  );
}
export async function getUnfinishedItems(db, billId) {
  return db.getAllAsync(
    `SELECT id, name, quantity, status
     FROM order_lines
     WHERE bill_id = ? AND status IN ('pending', 'cooking', 'ready')
     ORDER BY round_no, id`,
    [billId],
  );
}
export async function closeBill(db, billId) {
  const result = await db.runAsync(
    `UPDATE bills
     SET status = 'closed', closed_at = datetime('now', 'localtime')
     WHERE id = ? AND status = 'open'
       AND NOT EXISTS (
         SELECT 1
         FROM order_lines l
         WHERE l.bill_id = bills.id AND l.status IN ('pending', 'cooking', 'ready'))`,
    [billId],
  );
  return result.changes > 0;
}
export async function getClosedBills(db) {
  return db.getAllAsync(
    `SELECT b.id, t.table_no, b.opened_at, b.closed_at,
            COALESCE((SELECT SUM(l.line_total)
                      FROM order_lines l
                      WHERE l.bill_id = b.id AND l.status <> 'cancelled'), 0) AS total
     FROM bills b
     JOIN dining_tables t ON t.id = b.table_id
     WHERE b.status = 'closed'
     ORDER BY b.closed_at DESC, b.id DESC`,
  );
}

export async function getKitchenCancelNotices(db, billId) {
  return db.getAllAsync(
    `SELECT id, name, quantity, round_no, cancel_reason, cancelled_at
     FROM order_lines
     WHERE bill_id = ?
       AND status = 'cancelled'
       AND cancelled_by = 'kitchen'
       AND cancel_ack_at IS NULL
     ORDER BY cancelled_at, id`,
    [billId],
  );
}

export async function acknowledgeKitchenCancels(db, billId) {
  await db.runAsync(
    `UPDATE order_items
     SET cancel_ack_at = datetime('now', 'localtime')
     WHERE status = 'cancelled'
       AND cancelled_by = 'kitchen'
       AND cancel_ack_at IS NULL
       AND round_id IN (SELECT id FROM order_rounds WHERE bill_id = ?)`,
    [billId],
  );
}
