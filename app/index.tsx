import { Button, Pressable, ScrollView, Text, View } from "react-native";

import { getTasks, setCompleted, Task } from "@/db/tasks";
import { useDbVersion } from "@/utils/dbVersion";
import SegmentedControl from "@expo/ui/community/segmented-control";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabOneScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sortIndex, setSortIndex] = useState(0);
  const [showCompleteTasks, setShowCompleteTasks] = useState(true);

  return (
    <View className="flex h-screen" style={{ paddingTop: insets.top }}>
      <View className="flex justify-center items-center p-6">
        <Text className="text-xl text-white">Tasker</Text>
        <Text className="text-white">Daily Progress: 50%</Text>
      </View>
      <View className="grow" style={{ paddingBottom: insets.bottom }}>
        <View className="flex flex-row mb-2 items-center">
          <Text className="text-white">Sorting:</Text>
          <SegmentedControl
            style={{ flexGrow: 1 }}
            values={["Due Date", "Label"]}
            selectedIndex={sortIndex}
            onChange={(event) => {
              setSortIndex(event.nativeEvent.selectedSegmentIndex);
            }}
          />
        </View>
        <View className="flex flex-row mb-2">
          <Text className="text-white">Show complete tasks:</Text>
          <Checkbox
            value={showCompleteTasks}
            onValueChange={(v) => setShowCompleteTasks(v)}
          />
        </View>
        <TasksList
          showCompleteTasks={showCompleteTasks}
          sortIndex={sortIndex}
        />
      </View>
      <View
        className="inline-block"
        style={{ position: "absolute", right: 0, bottom: insets.bottom }}
      >
        <Button title="+" onPress={() => router.navigate("/tasks/new")} />
      </View>
    </View>
  );
}

function TasksList({
  showCompleteTasks,
  sortIndex,
}: {
  showCompleteTasks: boolean;
  sortIndex: number;
}) {
  const router = useRouter();
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);
  const dbVersion = useDbVersion((s) => s.version);

  const load = useCallback(async () => setTasks(await getTasks(db)), [db]);
  useEffect(() => {
    load();
  }, [dbVersion, load]);

  useEffect(() => {
    if (sortIndex === 0) setSortedTasks(tasks);
    else
      setSortedTasks(
        [...tasks].sort((a, b) => {
          if (a.label < b.label) return -1;
          if (a.label > b.label) return 1;
          return 0;
        }),
      );
  }, [tasks, sortIndex]);

  return (
    <ScrollView className="grow">
      {sortedTasks.map((t) => {
        const tc = t.isCompleted ? "text-gray-500 line-through" : "text-white";
        return (
          (!t.isCompleted || showCompleteTasks) && (
            <Pressable
              key={t.id}
              onPress={() =>
                router.navigate({
                  pathname: "/tasks/[id]/edit",
                  params: { id: t.id },
                })
              }
              className="flex flex-row gap-2 p-1"
            >
              <Checkbox
                value={t.isCompleted}
                onValueChange={(done) => setCompleted(db, t.id, done)}
              />
              <View className="flex flex-row grow justify-between">
                <Text className={`${tc}`}>{t.label}</Text>
                <Text className="text-gray-500">
                  {new Date(t.dueDate).toLocaleDateString()}
                </Text>
              </View>
            </Pressable>
          )
        );
      })}
    </ScrollView>
  );
}
