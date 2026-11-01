import db from "./db";

export interface TaskInterface {
  id: number;
  title: string;
  complete: number;
  effort: number;
  importance: number;
}

export async function createTask({
  title,
  date,
  effort,
}: {
  title: string;
  date: number;
  effort: number;
}) {
  const result = await db.runAsync(
    "INSERT INTO task (title, effort, importance) VALUES (?, ?, ?)",
    [title, effort, date],
  );
  await db.runAsync("UPDATE maxdate SET value = ? WHERE value < ?", [
    date,
    date,
  ]);
  return result.lastInsertRowId;
}

export async function getTasks() {
  const allRows = await db.getAllAsync("SELECT * FROM task");
  console.log(allRows[0]);
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

export async function getMaxDate() {
  const maxdate = (await db.getFirstAsync("SELECT value FROM maxdate")) as {
    value: number;
  };
  console.log(new Date(maxdate.value));
  return maxdate.value as number;
}
