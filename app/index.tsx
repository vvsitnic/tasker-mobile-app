import { Button, Pressable, ScrollView, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { getTasks, Task } from "@/db/tasks";
import { useDbVersion } from "@/utils/dbVersion";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

export default function TabOneScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const dbVersion = useDbVersion((s) => s.version);

  const load = useCallback(async () => setTasks(await getTasks(db)), [db]);
  useEffect(() => {
    load();
  }, [dbVersion, load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks List Here</Text>
      <Button title="New Task" onPress={() => router.navigate("/tasks/new")} />
      <Button title="Update Lates" onPress={load} />
      <ScrollView style={styles.scroll}>
        {tasks.map((t) => (
          <Pressable
            key={t.id}
            onPress={() =>
              router.navigate({
                pathname: "/tasks/[id]/edit",
                params: { id: t.id },
              })
            }
          >
            <Text>{JSON.stringify(t)}</Text>
          </Pressable>
        ))}
      </ScrollView>
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
