import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { formatK } from "@/lib/format";
import {
    claimPostedTask,
    usePostedTasks,
    useTasksHydrated,
} from "@/lib/task-store";

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
  error: "#E5484D",
};

export default function TaskDetailsWorker() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskId?: string }>();
  const taskId = typeof params.taskId === "string" ? params.taskId : "";
  const tasks = usePostedTasks();
  const tasksHydrated = useTasksHydrated();
  const task = tasks.find((item) => item.id === taskId);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleTakeTask = async () => {
    if (!task || task.status !== "Open") return;

    setError(null);
    setSubmitting(true);
    try {
      await claimPostedTask(task.id);
      router.replace("/active-jobs-worker");
    } catch {
      setError("We couldn't take this task. Please try again.");
      setSubmitting(false);
    }
  };

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationTitle}>
            {tasksHydrated ? "Task unavailable" : "Loading task..."}
          </Text>
          <Text style={styles.confirmationSubtitle}>
            {tasksHydrated
              ? "This task may have been removed or taken by someone else."
              : "Getting the latest task details."}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/worker-home")}
          >
            <Text style={styles.buttonText}>Back to available tasks</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={() => router.replace("/worker-home")}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>Back to available tasks</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{task.location}</Text>
          {task.deadline ? (
            <>
              <View style={styles.dot} />
              <Text style={styles.metaText}>Due {task.deadline}</Text>
            </>
          ) : null}
        </View>

        <View style={styles.suggestedBudgetPill}>
          <Text style={styles.suggestedBudgetLabel}>Task budget</Text>
          <Text style={styles.suggestedBudgetAmount}>
            {formatK(task.budget)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>
            {task.description || "No additional details were provided."}
          </Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {task.status === "Open" ? (
          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleTakeTask}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? "Taking task..." : "Take this task"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.statusNotice}>
            <Text style={styles.statusNoticeText}>
              {task.status === "Completed"
                ? "This task has been completed."
                : "This task is already in progress."}
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/active-jobs-worker")}
            >
              <Text style={styles.backLinkText}>Open My Jobs</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  backLink: { marginBottom: 12 },
  backLinkText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.muted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.muted,
    marginHorizontal: 6,
  },
  suggestedBudgetPill: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
  },
  suggestedBudgetLabel: {
    fontSize: 14,
    color: COLORS.muted,
  },
  suggestedBudgetAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.accent,
  },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  posterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  posterAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  posterInitial: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  posterInfo: { flex: 1 },
  posterName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  posterMeta: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },
  field: { marginBottom: 18 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.cardBg,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  budgetInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 14,
  },
  dollarSign: {
    fontSize: 15,
    color: COLORS.muted,
    marginRight: 4,
  },
  budgetInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  statusNotice: {
    gap: 12,
    padding: 16,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  statusNoticeText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
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
});
