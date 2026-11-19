import { Button, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { getTasks, Task } from "@/db/tasks";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";

export default function TabOneScreen() {
  const router = useRouter();
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);

  const load = useCallback(async () => setTasks(await getTasks(db)), [db]);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tasks List Here</Text>
      <Button title="New Task" onPress={() => router.navigate("/tasks/new")} />
      <Button title="Update Lates" onPress={load} />
      <Text>{JSON.stringify(tasks)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
