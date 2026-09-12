import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
  error: '#E5484D',
};

// Mock data for now — later this will come from the task the user tapped in Explore
const MOCK_TASK = {
  title: 'Pick up prescription from pharmacy',
  description:
    'Need someone to pick up a prescription from the CVS on 5th and deliver it to my apartment lobby. Should take 15-20 minutes.',
  location: 'Downtown',
  distanceMiles: 0.8,
  suggestedBudget: 12,
  postedMinutesAgo: 15,
  poster: {
    name: 'Sarah M.',
    rating: 4.9,
    tasksPosted: 23,
  },
};

export default function TaskDetailsWorker() {
  const router = useRouter();

  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitBid = () => {
    setError(null);

    if (!bidAmount.trim() || isNaN(Number(bidAmount))) {
      setError('Enter a valid bid amount');
      return;
    }

    setSubmitting(true);
    // TODO: replace with real request to submit an Offer to the backend
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.confirmationContainer}>
          <View style={styles.confirmationIcon}>
            <Text style={styles.confirmationIconText}>✓</Text>
          </View>
          <Text style={styles.confirmationTitle}>Offer sent</Text>
          <Text style={styles.confirmationSubtitle}>
            You offered ${bidAmount} for this task. You'll be notified if it's
            accepted.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Back to Explore</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{MOCK_TASK.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{MOCK_TASK.location}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{MOCK_TASK.distanceMiles} mi</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{MOCK_TASK.postedMinutesAgo}m ago</Text>
          </View>

          <View style={styles.suggestedBudgetPill}>
            <Text style={styles.suggestedBudgetLabel}>Suggested budget</Text>
            <Text style={styles.suggestedBudgetAmount}>
              ${MOCK_TASK.suggestedBudget}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>{MOCK_TASK.description}</Text>
          </View>

          <View style={styles.posterCard}>
            <View style={styles.posterAvatar}>
              <Text style={styles.posterInitial}>
                {MOCK_TASK.poster.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.posterInfo}>
              <Text style={styles.posterName}>{MOCK_TASK.poster.name}</Text>
              <Text style={styles.posterMeta}>
                ⭐ {MOCK_TASK.poster.rating} · {MOCK_TASK.poster.tasksPosted} tasks
                posted
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Send your offer</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Your bid</Text>
            <View style={styles.budgetInputWrapper}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder={String(MOCK_TASK.suggestedBudget)}
                placeholderTextColor={COLORS.muted}
                value={bidAmount}
                onChangeText={setBidAmount}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Message (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Let them know why you're a good fit"
              placeholderTextColor={COLORS.muted}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSubmitBid}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Sending...' : 'Send offer'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '700',
    color: COLORS.accent,
  },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  posterCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  posterInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  posterInfo: { flex: 1 },
  posterName: {
    fontSize: 15,
    fontWeight: '600',
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
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
});
