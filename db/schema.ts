import * as SQLite from "expo-sqlite";

export async function migrateDb(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS task (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      parentId    INTEGER REFERENCES task(id) ON DELETE CASCADE,
      label       TEXT    NOT NULL,
      dueDate     INTEGER NOT NULL,
      isCompleted INTEGER NOT NULL DEFAULT 0 CHECK (isCompleted IN (0, 1))
    );

    CREATE TRIGGER IF NOT EXISTS task_default_parent
    AFTER INSERT ON task
    WHEN NEW.parentId IS NULL
    BEGIN
      UPDATE task SET parentId = NEW.id WHERE id = NEW.id;
    END;

    CREATE INDEX IF NOT EXISTS idx_task_parentId ON task(parentId);
  `);
}
