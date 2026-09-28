import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Colors — swap these out once you've finalized your brand palette,
// or wire this up to your existing @/constants/theme file instead.
const COLORS = {
  primary: "#0069F4",
  primaryDark: "#0058D3",
  text: "#0C1D40",
  muted: "#8A93A6",
  border: "#E2E6ED",
  background: "#FFFFFF",
  error: "#E5484D",
};

type Step = "phone" | "otp";
const OTP_LENGTH = 6;

export default function LoginScreen() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const otpInputs = useRef<Array<TextInput | null>>([]);

  const isValidPhone = (value: string) => value.replace(/\D/g, "").length >= 10;

  const handleSendCode = () => {
    setError(null);
    if (!isValidPhone(phoneNumber)) {
      setError("Enter a valid phone number");
      return;
    }
    setLoading(true);
    // TODO: replace with real request to your auth backend (e.g. Supabase OTP send)
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 600);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // ignore paste-multiple for now
    const next = [...otp];
    next[index] = value.replace(/\D/g, "");
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setError(null);
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setError("Enter the full code");
      return;
    }
    setLoading(true);
    // TODO: replace with real verification call to your auth backend
    setTimeout(() => {
      setLoading(false);
      router.replace("/");
    }, 600);
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setError(null);
    // TODO: trigger real resend request
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            {step === "phone" ? "Welcome to Zeka" : "Enter the code"}
          </Text>
          <Text style={styles.subtitle}>
            {step === "phone"
              ? "We'll text you a verification code"
              : `Sent to ${phoneNumber}`}
          </Text>

          {step === "phone" ? (
            <>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Phone number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="(555) 555-5555"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  autoFocus
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendCode}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Sending..." : "Send code"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      otpInputs.current[index] = ref;
                    }}
                    style={styles.otpBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleOtpKeyPress(nativeEvent.key, index)
                    }
                  />
                ))}
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Verifying..." : "Verify & continue"}
                </Text>
              </TouchableOpacity>

              <View style={styles.resendRow}>
                <Text style={styles.mutedText}>Didn't get a code? </Text>
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendLink}>Resend</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => setStep("phone")}>
                <Text style={[styles.mutedText, styles.editNumber]}>
                  Edit phone number
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginBottom: 32,
  },
  inputWrapper: { marginBottom: 20 },
  inputLabel: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 12,
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  mutedText: { color: COLORS.muted, fontSize: 14 },
  resendLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  editNumber: { textAlign: "center", marginTop: 14 },
});
