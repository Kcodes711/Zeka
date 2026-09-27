import { useRouter } from "expo-router";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { navigateToRole } from "@/lib/navigation";

const COLORS = {
  primary: "#0069F4",
  primaryDark: "#0049C2",
  accent: "#FF9F01",
  text: "#102748",
  muted: "#5E7192",
  background: "#F4F7FF",
  cardBg: "#FFFFFF",
  lightBlue: "#EAF3FF",
  lightGold: "#FFF7E0",
  deepBlue: "#071A36",
};

export default function RoleSplashScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backdropOne} />
      <View style={styles.backdropTwo} />

      <View style={styles.container}>
        <View style={styles.logoBlock}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoMark}>Z</Text>
          </View>
          <Text style={styles.logoText}>Zeka</Text>
        </View>

        <Text style={styles.eyebrow}>Built for everyday hustle</Text>
        <Text style={styles.title}>Choose your mode</Text>
        <Text style={styles.subtitle}>
          Pick up tasks to earn, or post a task to get support. Both paths are
          built for speed, clarity, and trust.
        </Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={[styles.optionCard, styles.primaryCard]}
            onPress={() => navigateToRole(router, "picker")}
            activeOpacity={0.96}
          >
            <View style={styles.cardTopRow}>
              <Text style={styles.optionBadge}>Pick up jobs</Text>
              <Text style={styles.optionEmoji}>⚡</Text>
            </View>
            <Text style={styles.optionTitle}>I want to pick tasks</Text>
            <Text style={styles.optionText}>
              Explore nearby work, claim the jobs that match your day, and earn
              fast.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, styles.secondaryCard]}
            onPress={() => navigateToRole(router, "poster")}
            activeOpacity={0.96}
          >
            <View style={styles.cardTopRow}>
              <Text style={styles.optionBadge}>Post work</Text>
              <Text style={styles.optionEmoji}>✦</Text>
            </View>
            <Text style={styles.optionTitle}>I want to post tasks</Text>
            <Text style={styles.optionText}>
              Create a request, review offers, and get the right help delivered.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  backdropOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#DBEBFF",
    top: -50,
    right: -50,
  },
  backdropTwo: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#FFF1C8",
    bottom: -100,
    left: -80,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    zIndex: 1,
  },
  logoBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  logoMark: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  logoText: {
    marginLeft: 12,
    fontSize: 40,
    fontWeight: "900",
    color: COLORS.primaryDark,
    letterSpacing: -2,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.deepBlue,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 26,
    lineHeight: 22,
    maxWidth: 420,
  },
  grid: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D6E6FF",
    minHeight: 182,
    justifyContent: "center",
    shadowColor: "#122D5F",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  primaryCard: {
    backgroundColor: COLORS.lightBlue,
  },
  secondaryCard: {
    backgroundColor: COLORS.lightGold,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  optionBadge: {
    alignSelf: "flex-start",
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    overflow: "hidden",
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.deepBlue,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
});
