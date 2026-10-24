import { openDatabaseSync } from "expo-sqlite";

export interface TaskInterface {
  id: number;
  title: string;
  complete: number;
}

const db = openDatabaseSync("databaseTest");

export async function initDb() {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, complete INTEGER NOT NULL DEFAULT 0);
  `);
}

export async function createTask(title: string) {
  const result = await db.runAsync(
    "INSERT INTO task (title) VALUES (?)",
    title,
  );
  return result.lastInsertRowId;
}

export async function getTasks() {
  const allRows = await db.getAllAsync("SELECT * FROM task");
  return allRows as TaskInterface[];
}

export async function updateTask(id: number, status: boolean) {
  await db.runAsync(
    "UPDATE task SET complete = ? WHERE id = ?",
    status ? 1 : 0,
    id,
  );
}
