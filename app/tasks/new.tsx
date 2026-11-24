import { addTask } from "@/db/tasks";
import { useSubtasks } from "@/utils/subtasks";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const now = new Date();
export default function NewTask() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const db = useSQLiteContext();
  const subtasks = useSubtasks((s) => s.subtasks);
  const clear = useSubtasks((s) => s.clear);
  const [dueDate, setDueDate] = useState(new Date());
  const [label, setLabel] = useState("");

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  const create = useCallback(
    async (label: string, dueDate: number, parentId?: number) =>
      await addTask(db, label, dueDate, parentId),
    [db],
  );

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
            minimumDate={now}
          />
        </View>
      </View>
      <View className="flex flex-row justify-between items-center">
        <Text className="text-white">Subtasks:</Text>
        <Button
          title="+"
          onPress={() =>
            router.navigate({
              pathname: "/subtask",
              params: { maxDueDate: dueDate.getTime() + "" },
            })
          }
        />
      </View>
      <ScrollView className="grow">
        {subtasks.map((t) => {
          return (
            <Pressable
              key={t.id}
              onPress={() =>
                router.navigate({
                  pathname: "/subtask",
                  params: {
                    id: t.id,
                    maxDueDate: dueDate.getTime() + "",
                  },
                })
              }
              className="flex flex-row gap-2 p-1"
            >
              <View className="flex flex-row grow justify-between">
                <Text className="text-white">{t.label}</Text>
                <Text className="text-gray-500">
                  {new Date(t.dueDate).toDateString()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
      <View className="flex flex-row justify-around">
        <Button
          title="Back"
          onPress={() => {
            router.back();
          }}
        />
        <Button
          title="Create"
          onPress={async () => {
            await create(label, dueDate.getTime());
            router.back();
          }}
        />
      </View>
    </View>
  );
}
