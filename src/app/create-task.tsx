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
  error: '#E5484D',
};

export default function CreateTaskScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [suggestedBudget, setSuggestedBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePost = () => {
    setError(null);

    if (!title.trim()) {
      setError('Give your task a title');
      return;
    }
    if (!location.trim()) {
      setError('Add a location');
      return;
    }
    if (suggestedBudget && isNaN(Number(suggestedBudget))) {
      setError('Budget must be a number');
      return;
    }

    setSubmitting(true);
    // TODO: replace with real request to create a Task in your backend
    setTimeout(() => {
      setSubmitting(false);
      // TODO: navigate to the new task's details or back to Home
      // router.replace('/');
    }, 600);
  };

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
          <Text style={styles.headerTitle}>Post a task</Text>
          <Text style={styles.headerSubtitle}>
            Describe what you need done — workers will send offers
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Pick up prescription from pharmacy"
              placeholderTextColor={COLORS.muted}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any details a worker would need to know"
              placeholderTextColor={COLORS.muted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Downtown"
              placeholderTextColor={COLORS.muted}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Suggested budget</Text>
              <View style={styles.budgetInputWrapper}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.budgetInput}
                  placeholder="0"
                  placeholderTextColor={COLORS.muted}
                  value={suggestedBudget}
                  onChangeText={setSuggestedBudget}
                  keyboardType="numeric"
                />
              </View>
              <Text style={styles.hint}>Workers can offer a different price</Text>
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Deadline</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                placeholderTextColor={COLORS.muted}
                value={deadline}
                onChangeText={setDeadline}
              />
            </View>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handlePost}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Posting...' : 'Post task'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 24,
  },
  field: { marginBottom: 18 },
  halfField: { flex: 1 },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
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
    minHeight: 90,
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
  hint: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
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
  cancelText: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 16,
  },
});
