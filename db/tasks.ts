import { useDbVersion } from "@/utils/dbVersion";
import { useSubtasks } from "@/utils/subtasks";
import type { SQLiteDatabase } from "expo-sqlite";

export type Task = {
  id: number;
  parentId: number;
  label: string;
  dueDate: number;
  isCompleted: boolean;
};

export type TaskChanges = Partial<
  Pick<Task, "label" | "dueDate" | "isCompleted">
>;

type TaskRow = Omit<Task, "isCompleted"> & { isCompleted: number };
const toTask = (r: TaskRow): Task => ({
  ...r,
  isCompleted: r.isCompleted === 1,
});

export async function getTasks(db: SQLiteDatabase): Promise<Task[]> {
  const rows = await db.getAllAsync<TaskRow>(
    "SELECT * FROM task WHERE id = parentId ORDER BY dueDate ASC", // ORDER BY dueDate, isCompleted ASC
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
  await db.withTransactionAsync(async () => {
    const task = await db.runAsync(
      "INSERT INTO task (parentId, label, dueDate) VALUES (?, ?, ?)",
      parentId,
      label,
      dueDate,
    );

    const subtasks = useSubtasks.getState().subtasks;
    for (const s of subtasks) {
      await db.runAsync(
        "INSERT INTO task (parentId, label, dueDate) VALUES (?, ?, ?)",
        task.lastInsertRowId,
        s.label,
        s.dueDate,
      );
    }
  });
  useDbVersion.getState().bump();
}

export async function updateTask(
  db: SQLiteDatabase,
  id: number,
  changes: TaskChanges,
) {
  await db.withTransactionAsync(async () => {
    const columns = Object.keys(changes) as (keyof typeof changes)[];
    if (columns.length === 0) return;

    const setClause = columns.map((col) => `${col} = ?`).join(", ");
    const values = columns.map((col) => {
      if (col === "isCompleted") return changes[col] ? 1 : 0;
      return changes[col] as string | number;
    });

    await db.runAsync(
      `UPDATE task SET ${setClause} WHERE id = ?`,
      ...values,
      id,
    );

    const subtasks = useSubtasks.getState().subtasks;
    for (const s of subtasks) {
      await db.runAsync(
        "INSERT INTO task (parentId, label, dueDate) VALUES (?, ?, ?)",
        id,
        s.label,
        s.dueDate,
      );
    }

    if (subtasks.length > 0) {
      await db.runAsync(
        `UPDATE task
         SET isCompleted = NOT EXISTS (
           SELECT 1 FROM task c
           WHERE c.parentId = task.id AND c.id <> c.parentId AND c.isCompleted = 0
         )
         WHERE id = ?`,
        id,
      );
    }
  });

  useDbVersion.getState().bump();
}

export async function setCompleted(
  db: SQLiteDatabase,
  id: number,
  done: boolean,
) {
  const v = done ? 1 : 0;

  await db.withTransactionAsync(async () => {
    const row = await db.getFirstAsync<{ parentId: number }>(
      "SELECT parentId FROM task WHERE id = ?",
      id,
    );
    if (!row) return;

    if (row.parentId === id) {
      await db.runAsync(
        "UPDATE task SET isCompleted = ? WHERE parentId = ?",
        v,
        id,
      );
    } else {
      await db.runAsync("UPDATE task SET isCompleted = ? WHERE id = ?", v, id);
      await db.runAsync(
        `UPDATE task
         SET isCompleted = NOT EXISTS (
           SELECT 1 FROM task c
           WHERE c.parentId = task.id AND c.id <> c.parentId AND c.isCompleted = 0
         )
         WHERE id = ?`,
        row.parentId,
      );
    }
  });
  useDbVersion.getState().bump();
}

export async function deleteTask(db: SQLiteDatabase, id: number) {
  await db.withTransactionAsync(async () => {
    const row = await db.getFirstAsync<{ parentId: number }>(
      "SELECT parentId FROM task WHERE id = ?",
      id,
    );
    if (!row) return;

    await db.runAsync("DELETE FROM task WHERE id = ?", id);

    if (row.parentId !== id) {
      await db.runAsync(
        `UPDATE task
         SET isCompleted = NOT EXISTS (
           SELECT 1 FROM task c
           WHERE c.parentId = task.id AND c.id <> c.parentId AND c.isCompleted = 0
         )
         WHERE id = ?`,
        row.parentId,
      );
    }
  });
  useDbVersion.getState().bump();
}
