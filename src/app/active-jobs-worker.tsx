import { useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { formatK } from "@/lib/format";
import {
    completePostedTask,
    releasePostedTask,
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

type JobStatus = "Active" | "Completed";

const TABS: { key: JobStatus; label: string }[] = [
  { key: "Active", label: "Active" },
  { key: "Completed", label: "Completed" },
];

export default function ActiveJobsWorker() {
  const router = useRouter();
  const jobs = usePostedTasks();
  const jobsHydrated = useTasksHydrated();
  const [activeTab, setActiveTab] = useState<JobStatus>("Active");
  const [pendingCompletionId, setPendingCompletionId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => job.workerStatus === activeTab);

  const renderJob = ({ item }: { item: (typeof jobs)[number] }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardAmount}>{formatK(item.budget)}</Text>
      </View>

      <Text style={styles.cardMeta}>{item.location}</Text>

      {item.workerStatus === "Active" ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => setPendingCompletionId(item.id)}
          >
            <Text style={styles.completeButtonText}>Mark complete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.returnButton}
            onPress={async () => {
              setError(null);
              try {
                await releasePostedTask(item.id);
              } catch {
                setError("Couldn't return this task. Please try again.");
              }
            }}
          >
            <Text style={styles.returnButtonText}>Return task</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>✓ Completed</Text>
        </View>
      )}
      {pendingCompletionId === item.id && (
        <View style={styles.confirmationRow}>
          <Text style={styles.confirmationText}>Mark this task complete?</Text>
          <TouchableOpacity onPress={() => setPendingCompletionId(null)}>
            <Text style={styles.returnButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              setError(null);
              try {
                await completePostedTask(item.id);
                setPendingCompletionId(null);
              } catch {
                setError("Couldn't update this task. Please try again.");
              }
            }}
          >
            <Text style={styles.confirmCompleteText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My jobs</Text>
          <Text style={styles.headerSubtitle}>Work you have picked up</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace("/worker-home")}>
          <Text style={styles.browseLink}>Browse tasks</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        style={styles.jobList}
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {!jobsHydrated
                ? "Loading your jobs..."
                : activeTab === "Active"
                  ? "No active jobs. Browse open tasks to get started."
                  : "Completed jobs will appear here."}
            </Text>
            {jobsHydrated && activeTab === "Active" && (
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => router.replace("/worker-home")}
              >
                <Text style={styles.browseButtonText}>Browse tasks</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerSubtitle: {
    marginTop: 3,
    color: COLORS.muted,
    fontSize: 12,
  },
  browseLink: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  errorText: {
    marginHorizontal: 20,
    marginBottom: 8,
    color: "#B42318",
    fontSize: 13,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  jobList: {
    flex: 1,
    minHeight: 0,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  cardAmount: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.accent,
  },
  cardMeta: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 11,
    alignItems: "center",
    flex: 1,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  returnButton: {
    minWidth: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 11,
    alignItems: "center",
  },
  returnButtonText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  confirmationRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FFF7F6",
    borderWidth: 1,
    borderColor: "#F5C8C4",
    borderRadius: 6,
  },
  confirmationText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  confirmCompleteText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  browseButton: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  completedBadge: {
    backgroundColor: COLORS.success + "1A",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  completedBadgeText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: "600",
  },
});
