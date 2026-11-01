import { createTask } from "@/utils/tasks";
import { Host, Slider, TextInput, useNativeState } from "@expo/ui";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Button, View } from "react-native";

const today = new Date();

export default function ModalScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState(0.5);
  const text = useNativeState("");

  const handleChangeText = useCallback(
    (value: string) => {
      "worklet";
      text.value = value;
    },
    [text],
  );

  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      router.back();
    },
  });

  return (
    <View className="flex flex-1 items-center justify-center">
      <Host
        matchContents={{ vertical: true }}
        style={{ width: "80%", marginHorizontal: "auto" }}
      >
        <TextInput
          placeholder="Type here"
          onChangeText={handleChangeText}
          textStyle={{ color: "#000" }}
          placeholderTextColor="#000"
          value={text}
        />
      </Host>
      <DateTimePicker
        value={date}
        onValueChange={(_, selectedDate) => {
          setDate(selectedDate);
        }}
        mode="date"
        minimumDate={today}
      />
      <Host
        matchContents={{ vertical: true }}
        style={{ width: "80%", marginHorizontal: "auto" }}
      >
        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={4}
          // step={1}
        />
      </Host>
      <Button
        title="New Task"
        onPress={() => {
          mutation.mutate({
            title: text.value,
            date: date.getTime(),
            effort: value,
          });
        }}
      />
      {/* <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} /> */}
    </View>
  );
}
