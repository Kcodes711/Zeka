import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  primary: "#0069F4",
  accent: "#FFA901",
  text: "#0C1D40",
  muted: "#8A93A6",
  border: "#E2E6ED",
  background: "#FFFFFF",
  cardBg: "#F7F9FC",
};

interface OpenTask {
  id: string;
  title: string;
  location: string;
  distanceMiles: number;
  budget: number;
  postedMinutesAgo: number;
}

const MOCK_OPEN_TASKS: OpenTask[] = [
  {
    id: "1",
    title: "Pick up prescription from pharmacy",
    location: "Downtown",
    distanceMiles: 0.8,
    budget: 12,
    postedMinutesAgo: 15,
  },
  {
    id: "2",
    title: "Grab coffee for morning meeting",
    location: "Financial District",
    distanceMiles: 1.4,
    budget: 8,
    postedMinutesAgo: 32,
  },
  {
    id: "3",
    title: "Wait in line for concert tickets",
    location: "Riverside Arena",
    distanceMiles: 3.2,
    budget: 25,
    postedMinutesAgo: 48,
  },
  {
    id: "4",
    title: "Return package to post office",
    location: "Midtown",
    distanceMiles: 2.1,
    budget: 10,
    postedMinutesAgo: 60,
  },
];

interface TaskFeedWorkerProps {
  onPressTask?: (task: OpenTask) => void;
}

export default function TaskFeedWorker({ onPressTask }: TaskFeedWorkerProps) {
  const [search, setSearch] = useState("");

  const filteredTasks = MOCK_OPEN_TASKS.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  ).sort((a, b) => a.distanceMiles - b.distanceMiles);

  const formatPostedTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const renderTask = ({ item }: { item: OpenTask }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPressTask?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardBudget}>${item.budget}</Text>
      </View>

      <View style={styles.cardMetaRow}>
        <Text style={styles.cardMeta}>{item.location}</Text>
        <View style={styles.dot} />
        <Text style={styles.cardMeta}>{item.distanceMiles} mi</Text>
        <View style={styles.dot} />
        <Text style={styles.cardMeta}>
          {formatPostedTime(item.postedMinutesAgo)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Tasks near you</Text>
      </View>

      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks"
          placeholderTextColor={COLORS.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks match your search</Text>
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
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.cardBg,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  cardBudget: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.accent,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardMeta: {
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
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
  },
});
