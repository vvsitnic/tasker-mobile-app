import { openDatabaseSync } from "expo-sqlite";

const db = openDatabaseSync("databaseTest");
db.execSync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, complete INTEGER NOT NULL DEFAULT 0);
`);

export default db;
