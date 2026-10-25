import db from "./db";

export interface TaskInterface {
  id: number;
  title: string;
  complete: number;
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

export async function updateTask({
  id,
  status,
}: {
  id: number;
  status: boolean;
}) {
  await db.runAsync(
    "UPDATE task SET complete = ? WHERE id = ?",
    status ? 1 : 0,
    id,
  );
}
