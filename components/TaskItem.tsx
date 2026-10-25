import { TaskInterface, updateTask } from "@/utils/tasks";
import { useMutation } from "@tanstack/react-query";
import { Checkbox } from "expo-checkbox";
import { useState } from "react";
import { Text, View } from "react-native";

export default function TaskItem({ id, title, complete }: TaskInterface) {
  const [isComplete, setIsComplete] = useState(complete === 1 ? true : false);

  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (_, { status }) => {
      setIsComplete(status);
    },
  });

  return (
    <View className="flex gap-1.5">
      <Checkbox
        value={isComplete}
        onValueChange={(v) => {
          mutation.mutate({ id, status: v });
        }}
      />
      <View>
        <Text>{id}</Text>
        <Text>{title}</Text>
        <Text>{`is ${isComplete ? "complete" : "not complete"}`}</Text>
      </View>
    </View>
  );
}
