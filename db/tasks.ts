import { useSubtasks } from "@/utils/subtasks";
import type { SQLiteDatabase } from "expo-sqlite";

export type Task = {
  id: number;
  parentId: number;
  label: string;
  dueDate: number;
  isCompleted: boolean;
};

type TaskRow = Omit<Task, "isCompleted"> & { isCompleted: number };
const toTask = (r: TaskRow): Task => ({
  ...r,
  isCompleted: r.isCompleted === 1,
});

export async function getTasks(db: SQLiteDatabase): Promise<Task[]> {
  const rows = await db.getAllAsync<TaskRow>(
    "SELECT * FROM task WHERE id = parentId ORDER BY id", // ORDER BY dueDate, isCompleted ASC
  );
  return rows.map(toTask);
}

export async function getSubtasks(
  db: SQLiteDatabase,
  parentId: number,
): Promise<Task[]> {
  const rows = await db.getAllAsync<TaskRow>(
    "SELECT * FROM task WHERE parentId = ? AND parentId <> id ORDER BY id", //  WHERE id =  ORDER BY dueDate, isCompleted ASC
    parentId,
  );
  return rows.map(toTask);
}

export async function getTask(
  db: SQLiteDatabase,
  id: number,
): Promise<Task | null> {
  const row = await db.getFirstAsync<TaskRow>(
    "SELECT * FROM task WHERE id = ?",
    id,
  );
  return row ? toTask(row) : null;
}

export async function addTask(
  db: SQLiteDatabase,
  label: string,
  dueDate: number,
  parentId: number | null = null,
) {
  const res = await db.runAsync(
    "INSERT INTO task (parentId, label, dueDate) VALUES (?, ?, ?)",
    parentId,
    label,
    dueDate,
  );

  const subtasks = useSubtasks.getState().subtasks;
  for (const s of subtasks) {
    await db.runAsync(
      "INSERT INTO task (parentId, label, dueDate) VALUES (?, ?, ?)",
      res.lastInsertRowId,
      res.lastInsertRowId + "-" + s.label,
      s.dueDate,
    );
  }
  return res.lastInsertRowId;
}

export async function setCompleted(
  db: SQLiteDatabase,
  id: number,
  done: boolean,
) {
  await db.runAsync(
    "UPDATE task SET isCompleted = ? WHERE id = ?",
    done ? 1 : 0,
    id,
  );
}

export async function deleteTask(db: SQLiteDatabase, id: number) {
  await db.runAsync("DELETE FROM task WHERE id = ?", id);
}
