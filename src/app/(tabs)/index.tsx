import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const COLORS = {
  primary: '#0069F4',
  primaryDark: '#0058D3',
  accent: '#FFA901',
  text: '#0C1D40',
  muted: '#8A93A6',
  border: '#E2E6ED',
  background: '#FFFFFF',
  cardBg: '#F7F9FC',
  success: '#1FAE64',
};

type TaskStatus = 'open' | 'in_progress' | 'completed';

interface Task {
  id: string;
  title: string;
  location: string;
  status: TaskStatus;
  offerCount: number;
  budget?: number;
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Pick up prescription from pharmacy',
    location: 'Downtown',
    status: 'open',
    offerCount: 3,
    budget: 12,
  },
  {
    id: '2',
    title: 'Wait in line for concert tickets',
    location: 'Riverside Arena',
    status: 'in_progress',
    offerCount: 1,
    budget: 25,
  },
  {
    id: '3',
    title: 'Deliver package to office',
    location: 'Midtown',
    status: 'completed',
    offerCount: 5,
    budget: 8,
  },
];

const TABS: { key: TaskStatus; label: string }[] = [
  { key: 'open', label: 'Open' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

interface HomeFeedClientProps {
  onPressTask?: (task: Task) => void;
  onPressCreateTask?: () => void;
}

export default function HomeFeedClient({
  onPressTask,
  onPressCreateTask,
}: HomeFeedClientProps) {
  const [activeTab, setActiveTab] = useState<TaskStatus>('open');

  const filteredTasks = MOCK_TASKS.filter((t) => t.status === activeTab);

  const statusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'open':
        return { label: 'Open', color: COLORS.primary };
      case 'in_progress':
        return { label: 'In Progress', color: COLORS.accent };
      case 'completed':
        return { label: 'Completed', color: COLORS.success };
    }
  };

  const renderTask = ({ item }: { item: Task }) => {
    const status = statusLabel(item.status);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPressTask?.(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[styles.badge, { backgroundColor: status.color + '1A' }]}>
            <Text style={[styles.badgeText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>
        <Text style={styles.cardLocation}>{item.location}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardOffers}>
            {item.offerCount} {item.offerCount === 1 ? 'offer' : 'offers'}
          </Text>
          {item.budget && (
            <Text style={styles.cardBudget}>${item.budget}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
      </View>

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
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tasks here yet</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={onPressCreateTask}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  tabRow: {
    flexDirection: 'row',
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
    fontWeight: '600',
    color: COLORS.muted,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardLocation: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardOffers: {
    fontSize: 13,
    color: COLORS.muted,
  },
  cardBudget: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '400',
    marginTop: -2,
  },
});
