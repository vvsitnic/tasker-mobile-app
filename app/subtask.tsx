import { useSubtasks } from "@/utils/subtasks";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const today = new Date();

export default function Subtask() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, maxDueDate } = useLocalSearchParams<{
    id?: string;
    maxDueDate?: string;
  }>();
  const addSubtask = useSubtasks((s) => s.addSubtask);
  const updateSubtask = useSubtasks((s) => s.updateSubtask);
  const getSubtask = useSubtasks((s) => s.getSubtask);
  const [dueDate, setDueDate] = useState(new Date());
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (id) {
      const subtask = getSubtask(id);
      if (subtask) {
        setDueDate(new Date(subtask.dueDate));
        setLabel(subtask.label);
      }
    }
  }, [id]);

  return (
    <View
      className="flex h-screen"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View>
        <TextInput
          placeholder="Task label*"
          className="text-white text-lg mb-2"
          onChangeText={(t) => setLabel(t)}
          value={label}
        />
        <View className="flex flex-row gap-2 items-center">
          <Text className="text-white">Due Date:</Text>
          <DateTimePicker
            value={dueDate}
            onValueChange={(event, selectedDate) => {
              setDueDate(selectedDate);
            }}
            mode="datetime"
            minimumDate={today}
            maximumDate={maxDueDate ? new Date(+maxDueDate) : undefined}
          />
        </View>
      </View>
      <View className="mt-auto flex flex-row justify-around">
        <Button
          title="Back"
          onPress={() => {
            router.back();
          }}
        />
        {id ? (
          <Button
            title="Update"
            onPress={() => {
              updateSubtask(id, { label, dueDate: dueDate.getTime() });
              router.back();
            }}
          />
        ) : (
          <Button
            title="Create"
            onPress={() => {
              addSubtask(label, dueDate.getTime());
              router.back();
            }}
          />
        )}
      </View>
    </View>
  );
}
