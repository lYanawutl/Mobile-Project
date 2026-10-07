import { BILL_STATUS } from "../utils/status";

export async function getCartPreview(db, cartLines) {
  const cartJson = JSON.stringify(
    cartLines.map((line) => ({
      menuItemId: line.menuItemId,
      quantity: line.quantity,
      optionIds: line.optionIds,
    })),
  );
  return db.getAllAsync(
    `WITH cart AS (
       SELECT CAST(j.key AS INTEGER) AS idx,
              json_extract(j.value, '$.menuItemId') AS menu_item_id,
              json_extract(j.value, '$.quantity') AS quantity,
              json_extract(j.value, '$.optionIds') AS option_ids
       FROM json_each(?) j
     ),
     priced AS (
       SELECT cart.idx, cart.menu_item_id, cart.quantity,
              m.name, m.price AS unit_price, m.is_available,
              COALESCE((SELECT SUM(o.price_delta)
                        FROM json_each(cart.option_ids) k
                        JOIN options o ON o.id = k.value), 0) AS options_price,
              COALESCE((SELECT group_concat(o.name, ', ')
                        FROM json_each(cart.option_ids) k
                        JOIN options o ON o.id = k.value), '') AS options_text
       FROM cart
       JOIN menu_items m ON m.id = cart.menu_item_id
     )
     SELECT priced.*,
            priced.unit_price + priced.options_price AS unit_total,
            priced.quantity * (priced.unit_price + priced.options_price) AS line_total,
            SUM(priced.quantity * (priced.unit_price + priced.options_price)) OVER () AS cart_total
     FROM priced
     ORDER BY priced.idx`,
    [cartJson],
  );
}

export async function sendOrderRound(db, billId, cartLines) {
  if (cartLines.length === 0) {
    throw new Error("ตะกร้าว่าง ยังไม่มีรายการให้ส่ง");
  }

  let roundId = null;
  await db.withTransactionAsync(async () => {
    const bill = await db.getFirstAsync(
      "SELECT status FROM bills WHERE id = ?",
      [billId],
    );
    if (!bill || bill.status !== BILL_STATUS.open) {
      throw new Error("บิลนี้ปิดแล้วหรือไม่พบบิล");
    }

    const round = await db.runAsync(
      `INSERT INTO order_rounds (bill_id, round_no)
       SELECT ?, COALESCE(MAX(round_no), 0) + 1
       FROM order_rounds WHERE bill_id = ?`,
      [billId, billId],
    );
    roundId = round.lastInsertRowId;

    for (const line of cartLines) {
      const item = await db.runAsync(
        `INSERT INTO order_items (round_id, menu_item_id, quantity, unit_price, note)
         SELECT ?, id, ?, price, ?
         FROM menu_items
         WHERE id = ? AND is_available = 1`,
        [roundId, line.quantity, line.note, line.menuItemId],
      );
      if (item.changes === 0) {
        const menu = await db.getFirstAsync(
          "SELECT name FROM menu_items WHERE id = ?",
          [line.menuItemId],
        );
        throw new Error(
          [
            "เมนู",
            menu ? menu.name : "ที่เลือก",
            "ปิดการขายอยู่ สั่งไม่ได้",
          ].join(" "),
        );
      }

      for (const optionId of line.optionIds) {
        const option = await db.runAsync(
          `INSERT INTO order_item_options (order_item_id, option_id, price_delta)
           SELECT ?, o.id, o.price_delta
           FROM options o
           JOIN menu_item_options mo ON mo.option_id = o.id
           WHERE o.id = ? AND mo.menu_item_id = ?`,
          [item.lastInsertRowId, optionId, line.menuItemId],
        );
        if (option.changes === 0) {
          throw new Error("ตัวเลือกที่เลือกใช้กับเมนูนี้ไม่ได้");
        }
      }
    }
  });
  return roundId;
}

export async function cancelOrderItem(db, orderItemId, cancelledBy, reason) {
  const result = await db.runAsync(
    `UPDATE order_items
     SET status = 'cancelled',
         cancelled_by = ?,
         cancel_reason = ?,
         cancelled_at = datetime('now', 'localtime')
     WHERE id = ? AND status = 'pending'`,
    [cancelledBy, reason.trim(), orderItemId],
  );
  return result.changes > 0;
}
