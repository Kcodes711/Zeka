import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="worker-home" />
      <Stack.Screen name="poster-home" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" options={{ presentation: "modal" }} />
      <Stack.Screen name="create-task" options={{ presentation: "modal" }} />
      <Stack.Screen
        name="task-details-worker"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="task-details-client"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="active-jobs-worker"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
}
