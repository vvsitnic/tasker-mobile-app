import { Text, View } from "@/components/Themed";
import {
  getSubtasks,
  getTask,
  setCompleted,
  Task,
  TaskChanges,
  updateTask,
} from "@/db/tasks";
import { useDbVersion } from "@/utils/dbVersion";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { Button, Pressable, ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const now = new Date();

export default function EditTask() {
  const insets = useSafeAreaInsets();
  const { id, maxDueDate } = useLocalSearchParams<{
    id: string;
    maxDueDate?: string;
  }>();
  const router = useRouter();
  const db = useSQLiteContext();
  const dbVersion = useDbVersion((s) => s.version);
  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [dueDate, setDueDate] = useState(new Date());
  const [label, setLabel] = useState("");

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
    if (task) {
      setLabel(task.label);
      setDueDate(new Date(task.dueDate));
    }
  }, [id, task, loadSubtasks]);

  if (!task) return null;

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
            maximumDate={maxDueDate ? new Date(+maxDueDate) : undefined}
          />
        </View>
      </View>
      {task.id === task.parentId && (
        <>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-white">Subtasks:</Text>
            {/* <Button
              title="+"
              onPress={() =>
                router.navigate({
                  pathname: "/subtask",
                  params: { maxDueDate: dueDate.getTime() + "" },
                })
              }
            /> */}
          </View>
          <ScrollView className="grow">
            {subtasks.map((t) => {
              return (
                <Pressable
                  key={t.id}
                  onPress={() =>
                    router.push({
                      pathname: "/tasks/[id]/edit",
                      params: {
                        id: t.id,
                        maxDueDate: dueDate.getTime() + "",
                      },
                    })
                  }
                  className="flex flex-row gap-2 p-1"
                >
                  <Checkbox
                    value={t.isCompleted}
                    onValueChange={(done) => setCompleted(db, t.id, done)}
                  />
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
        </>
      )}
      <View className="flex mt-auto flex-row justify-around items-center">
        <Button
          title="Back"
          onPress={() => {
            router.back();
          }}
        />
        <Checkbox
          value={task.isCompleted}
          onValueChange={(done) => setCompleted(db, task.id, done)}
        />
        <Button
          title="Update"
          onPress={() => {
            update({
              label,
              dueDate: dueDate.getTime(),
            });
          }}
        />
      </View>
    </View>
  );
}
