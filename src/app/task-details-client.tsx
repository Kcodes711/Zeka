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
    acceptBidForTask,
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
};

export default function TaskDetailsClient() {
  const router = useRouter();
  const params = useLocalSearchParams<{ taskId?: string }>();
  const taskId = typeof params.taskId === "string" ? params.taskId : "";
  const tasks = usePostedTasks();
  const tasksHydrated = useTasksHydrated();
  const task = tasks.find((item) => item.id === taskId);
  const [processingBidId, setProcessingBidId] = useState<string | null>(null);

  const handleAcceptBid = async (bidId: string) => {
    if (!task) return;

    setProcessingBidId(bidId);
    try {
      await acceptBidForTask(task.id, bidId);
    } finally {
      setProcessingBidId(null);
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
              ? "This task may have been deleted."
              : "Getting the latest task details."}
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Back to My Tasks</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const bids = task.bids ?? [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Back to My Tasks</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.categoryPill}>
              {task.category || "Small errands"}
            </Text>
            <Text style={styles.subtitle}>{task.location}</Text>
          </View>
          <Text style={styles.subtitle}>Budget {formatK(task.budget)}</Text>
        </View>

        <View style={styles.taskSummary}>
          <Text style={styles.statusLabel}>{task.status}</Text>
          {task.deadline ? (
            <Text style={styles.subtitle}>Due {task.deadline}</Text>
          ) : null}
        </View>

        <Text style={styles.offersCount}>
          {bids.length} {bids.length === 1 ? "offer" : "offers"}
        </Text>

        {bids.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No offers yet. This task is visible to workers.
            </Text>
          </View>
        ) : (
          <View style={styles.offerList}>
            {bids.map((bid) => (
              <View key={bid.id} style={styles.offerCard}>
                <View style={styles.offerHeader}>
                  <View style={styles.workerAvatar}>
                    <Text style={styles.workerInitial}>
                      {bid.workerName?.charAt(0)?.toUpperCase() ?? "W"}
                    </Text>
                  </View>
                  <View style={styles.workerInfo}>
                    <Text style={styles.workerName}>{bid.workerName}</Text>
                    <Text style={styles.workerMeta}>Offer received</Text>
                  </View>
                  <Text style={styles.bidAmount}>{formatK(bid.amount)}</Text>
                </View>

                <Text style={styles.offerMessage}>
                  {bid.message || "No message provided."}
                </Text>

                {bid.status === "Accepted" || task.acceptedBidId === bid.id ? (
                  <View style={styles.acceptedBadge}>
                    <Text style={styles.acceptedBadgeText}>Accepted</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      processingBidId === bid.id && styles.acceptButtonDisabled,
                    ]}
                    onPress={() => handleAcceptBid(bid.id)}
                    disabled={processingBidId === bid.id}
                  >
                    <Text style={styles.acceptButtonText}>
                      {processingBidId === bid.id
                        ? "Accepting..."
                        : "Accept offer"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  categoryPill: {
    backgroundColor: "#EAF3FF",
    color: COLORS.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: "700",
    overflow: "hidden",
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
  offerList: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
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
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  acceptedBadge: {
    backgroundColor: "#E7FFF4",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  acceptedBadgeText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: "700",
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
