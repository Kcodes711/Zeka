import { useLocalSearchParams, useRouter } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { formatK } from "@/lib/format";
import { usePostedTasks, useTasksHydrated } from "@/lib/task-store";

// Once constants/colors.ts is set up, replace this with:
// import { COLORS } from '@/constants/colors';
const COLORS = {
  primary: "#0066EF",
  accent: "#FF9F01",
  text: "#0A1D3F",
  muted: "#8A93A6",
  border: "#E2E6ED",
  background: "#FFFFFF",
  cardBg: "#F7F9FC",
  success: "#1FAE64",
};

export default function TaskDetailsClient() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskId?: string }>();
  const taskId = typeof params.taskId === "string" ? params.taskId : "";
  const tasks = usePostedTasks();
  const tasksHydrated = useTasksHydrated();
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationTitle}>
            {tasksHydrated ? "Task unavailable" : "Loading task..."}
          </Text>
          <Text style={styles.confirmationSubtitle}>
            {tasksHydrated
              ? "This task may have been deleted."
              : "Getting the latest task details."}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/poster-home")}
          >
            <Text style={styles.buttonText}>Back to My Tasks</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          onPress={() => router.replace("/poster-home")}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>Back to My Tasks</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.subtitle}>
            {task.location} · Budget {formatK(task.budget)}
          </Text>
        </View>

        <View style={styles.taskSummary}>
          <Text style={styles.statusLabel}>{task.status}</Text>
          {task.deadline ? (
            <Text style={styles.subtitle}>Due {task.deadline}</Text>
          ) : null}
        </View>

        <Text style={styles.offersCount}>
          {task.offerCount} {task.offerCount === 1 ? "offer" : "offers"}
        </Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {task.offerCount === 0
              ? "No offers yet. This task is visible to workers."
              : "Worker offer details will appear here when offer support is connected."}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/create-task",
              params: { taskId: task.id },
            })
          }
        >
          <Text style={styles.buttonText}>Edit task</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: {
    paddingBottom: 40,
  },
  backLink: { paddingHorizontal: 20, paddingTop: 12 },
  backLinkText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
  },
  offersCount: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
  },
  taskSummary: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    gap: 6,
  },
  statusLabel: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  offerCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  workerInitial: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  workerInfo: { flex: 1 },
  workerName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  workerMeta: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  bidAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.accent,
  },
  offerMessage: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  confirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success + "1A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  confirmationIconText: {
    fontSize: 30,
    color: COLORS.success,
    fontWeight: "700",
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
