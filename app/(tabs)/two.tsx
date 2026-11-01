import { getMaxDate, getTasks } from "@/utils/tasks";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

export default function TabTwoScreen() {
  const tasksQuery = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  const { data: maxdate } = useQuery({
    queryKey: ["tasks", "maxdate"],
    queryFn: getMaxDate,
  });
  const datenow = Date.now();
  console.log(datenow, maxdate);
  const dif = maxdate! - datenow;
  return (
    <View className="flex flex-1 m-2">
      <View className="w-px h-full absolute right-1/2 bg-gray-600"></View>
      <View className="w-full h-px absolute bottom-1/2 bg-gray-600"></View>
      <Text className="absolute top-0 left-1/2">Effort</Text>
      <Text className="absolute bottom-1/2 right-0">Importance</Text>
      {tasksQuery.data?.map((task) => (
        <Text
          key={task.id}
          className="absolute -translate-x-1/2 translate-y-1/2"
          style={{
            bottom: `${(task.effort / 4) * 100}%`,
            right: `${((maxdate! - datenow) / task.importance) * 100}%`,
          }}
        >
          {task.title}
        </Text>
      ))}
    </View>
  );
}
