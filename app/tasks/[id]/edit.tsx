import { Text, View } from "@/components/Themed";
import {
  getSubtasks,
  getTask,
  Task,
  TaskChanges,
  updateTask,
} from "@/db/tasks";
import { useDbVersion } from "@/utils/dbVersion";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet } from "react-native";

export default function EditTask() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const dbVersion = useDbVersion((s) => s.version);

  const load = useCallback(
    async () => setTask(await getTask(db, +id)),
    [db, id],
  );

  const loadSubtasks = useCallback(
    async () => setSubtasks(await getSubtasks(db, +id)),
    [db, id],
  );

  const update = useCallback(
    async (changes: TaskChanges) => updateTask(db, +id, changes),
    [db, id],
  );

  useEffect(() => {
    load();
  }, [load, dbVersion]);

  useEffect(() => {
    if (task && task.parentId == +id) {
      loadSubtasks();
    }
  }, [id, task, loadSubtasks]);

  return (
    <View style={styles.container}>
      {task && (
        <Button
          title="Update task"
          onPress={() => {
            update({ label: task.label + "-edit", dueDate: task.dueDate + 1 });
          }}
        />
      )}
      <Text>{JSON.stringify(task)}</Text>
      {subtasks.length > 0 && (
        <>
          <Text>Subtasks:</Text>
          <ScrollView style={styles.scroll}>
            {subtasks.map((t) => (
              <Pressable
                key={t.id}
                onPress={() =>
                  router.push({
                    pathname: "/tasks/[id]/edit",
                    params: { id: t.id },
                  })
                }
              >
                <Text>{JSON.stringify(t)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flexGrow: 0,
    maxHeight: "70%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
