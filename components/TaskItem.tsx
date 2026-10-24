import { TaskInterface, updateTask } from "@/functions/tasks";
import { Checkbox } from "expo-checkbox";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function TaskItem({ id, title, complete }: TaskInterface) {
  const [isComplete, setIsComplete] = useState(complete === 1 ? true : false);
  // const db = useSQLiteContext();

  useEffect(() => {
    console.log(
      `task ${id} status is: ${isComplete ? "complete" : "not complete"}`,
    );
  }, [isComplete]);

  return (
    <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
      <Checkbox
        value={isComplete}
        onValueChange={(v) => {
          updateTask(id, v);
          setIsComplete(v);
        }}
      />
      <View>
        <Text style={{ color: "#fff" }}>{id}</Text>
        <Text style={{ color: "#fff" }}>{title}</Text>
        <Text
          style={{ color: "#fff" }}
        >{`is ${isComplete ? "complete" : "not complete"}`}</Text>
      </View>
    </View>
  );
}
