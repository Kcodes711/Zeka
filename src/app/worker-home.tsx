import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { formatK } from "@/lib/format";
import { goHome } from "@/lib/navigation";
import {
    TASK_CATEGORIES,
    usePostedTasks,
    useTasksHydrated,
} from "@/lib/task-store";

const COLORS = {
  primary: "#0069F4",
  primaryDeep: "#004FC9",
  accent: "#FF9F01",
  accentSoft: "#FFF4CF",
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

export default function WorkerHomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const postedTasks = usePostedTasks();
  const tasksHydrated = useTasksHydrated();
  const categoryOptions = ["All", ...TASK_CATEGORIES];
  const availableTasks = [
    ...postedTasks
      .filter((task) => task.status === "Open")
      .map((task) => ({
        ...task,
        distanceMiles: null as number | null,
        postedMinutesAgo: Math.max(
          0,
          Math.floor((Date.now() - task.createdAt) / 60000),
        ),
        urgency: task.deadline ? `Due ${task.deadline}` : "Open task",
      })),
  ];

  const filteredTasks = useMemo(
    () =>
      availableTasks.filter(
        (task) =>
          (selectedCategory === "All" || task.category === selectedCategory) &&
          task.title.toLowerCase().includes(search.toLowerCase()),
      ),
    [availableTasks, search, selectedCategory],
  );

  const renderTask = ({ item }: { item: (typeof availableTasks)[number] }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() =>
        router.push({
          pathname: "/task-details-worker",
          params: { taskId: item.id },
        })
      }
      activeOpacity={0.9}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.taskBudget}>{formatK(item.budget)}</Text>
      </View>

      <View style={styles.rowMeta}>
        <Text style={styles.categoryPill}>
          {item.category || "Small errands"}
        </Text>
        <Text style={styles.metaText}>{item.location}</Text>
        <View style={styles.dot} />
        <Text style={styles.metaText}>
          {item.distanceMiles == null ? "Nearby" : `${item.distanceMiles} mi`}
        </Text>
        <View style={styles.dot} />
        <Text style={styles.metaText}>{item.postedMinutesAgo}m ago</Text>
      </View>

      <View style={styles.taskFooter}>
        <View style={styles.urgencyPill}>
          <Text style={styles.urgencyText}>{item.urgency}</Text>
        </View>
        <Text style={styles.viewText}>View task</Text>
      </View>
    </TouchableOpacity>
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
            <Text style={styles.eyebrow}>Worker path</Text>
            <Text style={styles.heroTitle}>Find work that fits your day</Text>
          </View>
          <Text style={styles.heroEmoji}>⚡</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Open tasks</Text>
            <Text style={styles.statValue}>{availableTasks.length}</Text>
          </View>
          <View style={styles.statCardAlt}>
            <Text style={styles.statLabel}>My active jobs</Text>
            <Text style={styles.statValue}>
              {
                postedTasks.filter((task) => task.workerStatus === "Active")
                  .length
              }
            </Text>
          </View>
          <View style={styles.statCardSoft}>
            <Text style={styles.statLabel}>Completed value</Text>
            <Text style={styles.statValue}>
              {formatK(
                postedTasks
                  .filter((task) => task.workerStatus === "Completed")
                  .reduce((total, task) => total + task.budget, 0),
              )}
            </Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search for a task"
            placeholderTextColor={COLORS.muted}
          />
        </View>

        <View style={styles.filterRow}>
          {categoryOptions.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available tasks</Text>
          <TouchableOpacity onPress={() => router.push("/active-jobs-worker")}>
            <Text style={styles.linkText}>My jobs</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {!tasksHydrated
                  ? "Loading available tasks..."
                  : search
                    ? "No tasks match your search"
                    : "No open tasks yet. Check back soon."}
              </Text>
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
    backgroundColor: COLORS.primaryDeep,
    experimental_backgroundImage:
      "linear-gradient(135deg, #005AD9 0%, #0069F4 100%)",
    borderRadius: 8,
    padding: 20,
    marginBottom: 18,
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
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 28,
    maxWidth: 220,
  },
  heroEmoji: {
    fontSize: 40,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardAlt: {
    flex: 1,
    backgroundColor: COLORS.lilac,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D9D7FF",
  },
  statCardSoft: {
    flex: 1,
    backgroundColor: COLORS.greenSoft,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#CBEEDC",
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  searchWrap: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  listContent: {
    paddingBottom: 30,
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
    gap: 12,
    marginBottom: 8,
  },
  taskTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  taskBudget: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  rowMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 6,
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
  metaText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.muted,
    marginHorizontal: 6,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urgencyPill: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  urgencyText: {
    color: COLORS.primaryDeep,
    fontWeight: "700",
    fontSize: 11,
  },
  viewText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
  },
});
