import { Ionicons } from "@expo/vector-icons";

export const icon = {
  index: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="home" size={24} color={color} />
    ) : (
      <Ionicons name="home-outline" size={24} color={color} />
    ),
  summary: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="sunny" size={24} color={color} />
    ) : (
      <Ionicons name="sunny-outline" size={24} color={color} />
    ),
  settings: ({ color, focused }: { color: string; focused: boolean }) =>
    focused ? (
      <Ionicons name="settings" size={24} color={color} />
    ) : (
      <Ionicons name="settings-outline" size={24} color={color} />
    ),
};