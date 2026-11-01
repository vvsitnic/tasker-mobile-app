import TaskItem from "@/components/TaskItem";
import { getTasks } from "@/utils/tasks";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

export default function TabOneScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const query = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      query.refetch();
      setRefreshing(false);
    }, 700);
  }, [query]);

  return (
    <View className="flex flex-1">
      <ScrollView
        className="px-5 pt-5"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {query.data?.map((data) => (
          <TaskItem key={data.id} {...data} />
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
