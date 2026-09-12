import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

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

interface Offer {
  id: string;
  workerName: string;
  rating: number;
  jobsCompleted: number;
  bidAmount: number;
  message?: string;
}

// Mock data for now — later this will come from the real task's submitted offers
const MOCK_TASK = {
  title: 'Pick up prescription from pharmacy',
  location: 'Downtown',
  suggestedBudget: 12,
};

const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    workerName: 'James R.',
    rating: 4.8,
    jobsCompleted: 41,
    bidAmount: 12,
    message: 'I can be there in 10 minutes, right around the corner.',
  },
  {
    id: '2',
    workerName: 'Priya K.',
    rating: 5.0,
    jobsCompleted: 76,
    bidAmount: 15,
  },
  {
    id: '3',
    workerName: 'Diego M.',
    rating: 4.6,
    jobsCompleted: 12,
    bidAmount: 10,
    message: 'Happy to help, I have a car so it will be quick.',
  },
];

export default function TaskDetailsClient() {
  const router = useRouter();
  const [acceptedOfferId, setAcceptedOfferId] = useState<string | null>(null);

  const handleAccept = (offer: Offer) => {
    setAcceptedOfferId(offer.id);
    // TODO: replace with real request to accept this Offer in the backend
  };

  if (acceptedOfferId) {
    const accepted = MOCK_OFFERS.find((o) => o.id === acceptedOfferId)!;
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationIcon}>
            <Text style={styles.confirmationIconText}>✓</Text>
          </View>
          <Text style={styles.confirmationTitle}>Offer accepted</Text>
          <Text style={styles.confirmationSubtitle}>
            {accepted.workerName} will handle "{MOCK_TASK.title}" for $
            {accepted.bidAmount}.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Back to My Tasks</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderOffer = ({ item }: { item: Offer }) => (
    <View style={styles.offerCard}>
      <View style={styles.offerHeader}>
        <View style={styles.workerAvatar}>
          <Text style={styles.workerInitial}>{item.workerName.charAt(0)}</Text>
        </View>
        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{item.workerName}</Text>
          <Text style={styles.workerMeta}>
            ⭐ {item.rating} · {item.jobsCompleted} jobs completed
          </Text>
        </View>
        <Text style={styles.bidAmount}>${item.bidAmount}</Text>
      </View>

      {item.message && <Text style={styles.offerMessage}>{item.message}</Text>}

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAccept(item)}
      >
        <Text style={styles.acceptButtonText}>Accept offer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{MOCK_TASK.title}</Text>
        <Text style={styles.subtitle}>
          {MOCK_TASK.location} · Suggested ${MOCK_TASK.suggestedBudget}
        </Text>
      </View>

      <Text style={styles.offersCount}>
        {MOCK_OFFERS.length} {MOCK_OFFERS.length === 1 ? 'offer' : 'offers'}
      </Text>

      <FlatList
        data={MOCK_OFFERS}
        keyExtractor={(item) => item.id}
        renderItem={renderOffer}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No offers yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  backLink: { paddingHorizontal: 20, paddingTop: 12 },
  backLinkText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
  },
  offersCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workerInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  workerInfo: { flex: 1 },
  workerName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  workerMeta: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  bidAmount: {
    fontSize: 20,
    fontWeight: '700',
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
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
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
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  confirmationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmationIconText: {
    fontSize: 30,
    color: COLORS.success,
    fontWeight: '700',
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 15,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
