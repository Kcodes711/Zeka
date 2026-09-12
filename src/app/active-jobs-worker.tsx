import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

// Once constants/colors.ts is set up, replace this with:
// import { COLORS } from '@/constants/colors';
const COLORS = {
  primary: '#0066EF',
  accent: '#FF9F01',
  text: '#0A1D3F',
  muted: '#8A93A6',
  border: '#E2E6ED',
  background: '#FFFFFF',
  cardBg: '#F7F9FC',
  success: '#1FAE64',
};

type JobStatus = 'accepted' | 'completed';

interface Job {
  id: string;
  title: string;
  location: string;
  clientName: string;
  amount: number;
  status: JobStatus;
}

const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Pick up prescription from pharmacy',
    location: 'Downtown',
    clientName: 'Sarah M.',
    amount: 12,
    status: 'accepted',
  },
  {
    id: '2',
    title: 'Wait in line for concert tickets',
    location: 'Riverside Arena',
    clientName: 'Marcus T.',
    amount: 25,
    status: 'accepted',
  },
  {
    id: '3',
    title: 'Deliver package to office',
    location: 'Midtown',
    clientName: 'Elena V.',
    amount: 8,
    status: 'completed',
  },
];

const TABS: { key: JobStatus; label: string }[] = [
  { key: 'accepted', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

export default function ActiveJobsWorker() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [activeTab, setActiveTab] = useState<JobStatus>('accepted');

  const filteredJobs = jobs.filter((j) => j.status === activeTab);

  const handleMarkComplete = (job: Job) => {
    Alert.alert(
      'Mark as complete?',
      `Confirm that "${job.title}" is done.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark complete',
          onPress: () => {
            // TODO: replace with real request to update Task/Offer status in the backend
            setJobs((prev) =>
              prev.map((j) =>
                j.id === job.id ? { ...j, status: 'completed' } : j
              )
            );
          },
        },
      ]
    );
  };

  const renderJob = ({ item }: { item: Job }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardAmount}>${item.amount}</Text>
      </View>

      <Text style={styles.cardMeta}>
        {item.location} · for {item.clientName}
      </Text>

      {item.status === 'accepted' ? (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleMarkComplete(item)}
        >
          <Text style={styles.completeButtonText}>Mark as complete</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>✓ Completed</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Jobs</Text>
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
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nothing here yet</Text>
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
    paddingBottom: 40,
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
  cardAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.accent,
  },
  cardMeta: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: COLORS.success + '1A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  completedBadgeText: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
  },
});
