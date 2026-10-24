import { Link, useRouter } from "expo-router";
import { Text, View } from "react-native";

export default function TabTwoScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Tab Two</Text>
      <Link href="/modal">Open modal</Link>
    </View>
  );
}
