import TaskItem from "@/components/TaskItem";
import { getTasks, TaskInterface } from "@/functions/tasks";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

export default function TabOneScreen() {
  // const db = useSQLiteContext();
  const [tasks, setTasks] = useState<TaskInterface[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      (async () => {
        const result = (await getTasks()) as TaskInterface[];
        setTasks(result);
      })();
      setRefreshing(false);
    }, 700);
  }, []);

  useEffect(() => {
    (async () => {
      const result = (await getTasks()) as TaskInterface[];
      setTasks(result);
    })();
  }, []);

  return (
    <View className="flex flex-col">
      <ScrollView
        className="px-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.map(({ id, title, complete }) => (
          <TaskItem key={id} id={id} title={title} complete={complete} />
        ))}
      </ScrollView>
      <Link
        href="/modal"
        className=" absolute right-3 bottom-4 p-2 bg-white rounded-md"
      >
        Add Task
      </Link>
    </View>
  );
}
