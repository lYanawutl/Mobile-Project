import { SCHEMA_SQL } from "./schema";
import { seedInitialData } from "./seed";

export const DATABASE_NAME = "restaurant_order_01418342_v2.db";

export async function initDB(db) {
  await db.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  const row = await db.getFirstAsync("PRAGMA user_version");
  const version = row?.user_version ?? 0;

  if (version === 0) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(SCHEMA_SQL);
      await seedInitialData(db);
      await db.execAsync("PRAGMA user_version = 1");
    });
  }
}