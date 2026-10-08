import { seedInitialData } from "./seed";

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

export async function resetAllData(db) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(WIPE_SQL);
    await seedInitialData(db);
  });
}
