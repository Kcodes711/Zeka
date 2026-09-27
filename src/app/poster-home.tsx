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
import { goHome } from "@/lib/navigation";
import type { PostedTask } from "@/lib/task-store";
import {
    deletePostedTask,
    updatePostedTask,
    usePostedTasks,
    useTasksHydrated,
} from "@/lib/task-store";

const COLORS = {
  primary: "#0069F4",
  primaryDeep: "#004FC9",
  accent: "#FF9F01",
  accentSoft: "#FFF1D6",
  text: "#0D2142",
  muted: "#5F708C",
  background: "#F4F8FF",
  card: "#FFFFFF",
  border: "#DDE8FF",
  green: "#1DBF73",
  greenSoft: "#E7FFF4",
  lilac: "#ECEBFF",
  shadow: "#0A1B38",
};

export default function PosterHomeScreen() {
  const router = useRouter();
  const postedTasks = usePostedTasks();
  const tasksHydrated = useTasksHydrated();
  const [activeTab, setActiveTab] = useState<
    "Open" | "In progress" | "Completed"
  >("Open");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const taskList = postedTasks;
  const filteredTasks = taskList.filter((task) => task.status === activeTab);
  const openTaskCount = taskList.filter(
    (task) => task.status === "Open",
  ).length;
  const offerCount = taskList.reduce(
    (total, task) => total + task.offerCount,
    0,
  );
  const openBudget = taskList
    .filter((task) => task.status === "Open")
    .reduce((total, task) => total + task.budget, 0);

  const renderTask = ({ item }: { item: PostedTask }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            item.status === "Completed"
              ? styles.statusCompleted
              : item.status === "In progress"
                ? styles.statusInProgress
                : styles.statusOpen,
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.metaText}>{item.location}</Text>

      <View style={styles.taskFooter}>
        <Text style={styles.offerText}>
          {item.offerCount} {item.offerCount === 1 ? "offer" : "offers"}
        </Text>
        <Text style={styles.taskBudget}>{formatK(item.budget)}</Text>
      </View>
      {item.id.startsWith("posted-") && (
        <>
          <View style={styles.manageActions}>
            <TouchableOpacity
              style={styles.detailsAction}
              onPress={() =>
                router.push({
                  pathname: "/task-details-client",
                  params: { taskId: item.id },
                })
              }
              accessibilityRole="button"
            >
              <Text style={styles.detailsActionText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editAction}
              onPress={() =>
                router.push({
                  pathname: "/create-task",
                  params: { taskId: item.id },
                })
              }
              accessibilityRole="button"
            >
              <Text style={styles.editActionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusAction}
              onPress={() =>
                updatePostedTask(item.id, {
                  status:
                    item.status === "Open"
                      ? "In progress"
                      : item.status === "In progress"
                        ? "Completed"
                        : "Open",
                  workerStatus:
                    item.status === "In progress" &&
                    item.workerStatus === "Active"
                      ? "Completed"
                      : undefined,
                })
              }
              accessibilityRole="button"
            >
              <Text style={styles.statusActionText}>
                {item.status === "Open"
                  ? "Start task"
                  : item.status === "In progress"
                    ? "Complete"
                    : "Reopen"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteAction}
              onPress={() => setPendingDeleteId(item.id)}
              accessibilityRole="button"
            >
              <Text style={styles.deleteActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
          {pendingDeleteId === item.id && (
            <View style={styles.deleteConfirmation}>
              <Text style={styles.confirmationText}>Delete this task?</Text>
              <TouchableOpacity onPress={() => setPendingDeleteId(null)}>
                <Text style={styles.cancelDeleteText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deletePostedTask(item.id);
                  setPendingDeleteId(null);
                }}
              >
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.brandBlock}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoMark}>Z</Text>
            </View>
            <Text style={styles.brandText}>Zeka</Text>
          </View>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => goHome(router)}
          >
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View>
            <Text style={styles.eyebrow}>Poster path</Text>
            <Text style={styles.heroTitle}>Get help when you need it</Text>
          </View>
          <Text style={styles.heroEmoji}>📋</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => router.push("/create-task")}
          activeOpacity={0.86}
          accessibilityRole="button"
        >
          <Text style={styles.primaryActionIcon}>+</Text>
          <Text style={styles.primaryActionText}>Post a task</Text>
        </TouchableOpacity>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Open</Text>
            <Text style={styles.statValue}>{openTaskCount}</Text>
          </View>
          <View style={styles.statCardAlt}>
            <Text style={styles.statLabel}>Offers</Text>
            <Text style={styles.statValue}>{offerCount}</Text>
          </View>
          <View style={styles.statCardSoft}>
            <Text style={styles.statLabel}>Budget</Text>
            <Text style={styles.statValue}>{formatK(openBudget)}</Text>
          </View>
        </View>

        <View style={styles.tabRow}>
          {(["Open", "In progress", "Completed"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My tasks</Text>
        </View>

        <FlatList
          style={styles.taskList}
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {tasksHydrated
                  ? "No tasks in this view yet"
                  : "Loading your tasks..."}
              </Text>
              {tasksHydrated && activeTab === "Open" && (
                <TouchableOpacity
                  style={styles.emptyAction}
                  onPress={() => router.push("/create-task")}
                >
                  <Text style={styles.emptyActionText}>
                    Post your first task
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  logoMark: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  brandText: {
    marginLeft: 10,
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "800",
  },
  homeButton: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  homeButtonText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 13,
  },
  heroCard: {
    backgroundColor: COLORS.accent,
    experimental_backgroundImage:
      "linear-gradient(135deg, #FF9F01 0%, #F47B00 100%)",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: COLORS.primaryDeep,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 7,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#4A2A00",
    marginBottom: 8,
  },
  heroTitle: {
    color: COLORS.text,
    fontWeight: "800",
    fontSize: 23,
    maxWidth: 220,
  },
  heroEmoji: {
    fontSize: 32,
  },
  primaryAction: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    gap: 10,
  },
  primaryActionIcon: {
    color: "#FFFFFF",
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "500",
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardAlt: {
    flex: 1,
    backgroundColor: COLORS.lilac,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#D9D7FF",
  },
  statCardSoft: {
    flex: 1,
    backgroundColor: COLORS.greenSoft,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#CBEEDC",
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.muted,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 4,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.muted,
    fontWeight: "700",
    fontSize: 12,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  listContent: {
    paddingBottom: 30,
  },
  taskList: {
    flex: 1,
    minHeight: 0,
  },
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 8,
  },
  taskTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusOpen: {
    backgroundColor: COLORS.accentSoft,
  },
  statusInProgress: {
    backgroundColor: COLORS.lilac,
  },
  statusCompleted: {
    backgroundColor: COLORS.greenSoft,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.text,
  },
  metaText: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  taskBudget: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  manageActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  editAction: {
    minWidth: 64,
    alignItems: "center",
    backgroundColor: "#EAF3FF",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  detailsAction: {
    minWidth: 64,
    alignItems: "center",
    backgroundColor: COLORS.greenSoft,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  detailsActionText: {
    color: "#16633E",
    fontSize: 12,
    fontWeight: "700",
  },
  editActionText: {
    color: COLORS.primaryDeep,
    fontSize: 12,
    fontWeight: "700",
  },
  statusAction: {
    flex: 1,
    minWidth: 100,
    alignItems: "center",
    backgroundColor: COLORS.accentSoft,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  statusActionText: {
    color: "#684100",
    fontSize: 12,
    fontWeight: "700",
  },
  deleteAction: {
    minWidth: 64,
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  deleteActionText: {
    color: "#B42318",
    fontSize: 12,
    fontWeight: "700",
  },
  deleteConfirmation: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 10,
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
  cancelDeleteText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  confirmDeleteText: {
    color: "#B42318",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  emptyAction: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  emptyActionText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});
