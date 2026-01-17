import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";

import VideoScreen from "./Videoback";
import theme from "../styles/theme";
import { saveTokens } from "../auth/authStorage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
    else SplashScreen.preventAutoHideAsync();
  }, [fontsLoaded]);

  const showAlert = (title, message) => {
    Platform.OS === "web"
      ? window.alert(`${title}\n\n${message}`)
      : Alert.alert(title, message);
  };

  const login = async () => {
    if (!email || !password) {
      showAlert("Validation Error", "Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://notes-app-2g6i.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        await saveTokens(data.accessToken, data.refreshToken);
        navigation.replace("Notes");
      } else {
        showAlert("Login Failed", data.message || "Invalid credentials");
      }
    } catch {
      setLoading(false);
      showAlert("Error", "Unable to login. Please try again.");
    }
  };

  if (!fontsLoaded) return null;

  return (
    <VideoScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <View style={styles.centerWrapper}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to your notes</Text>

            {/* Email */}
            <View style={[styles.inputWrapper, emailFocus && styles.focused]}>
              <MaterialIcons name="email" size={22} color={theme.colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </View>

            {/* Password */}
            <View style={[styles.inputWrapper, passwordFocus && styles.focused]}>
              <MaterialIcons name="lock" size={22} color={theme.colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.muted}
                secureTextEntry
                onChangeText={setPassword}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={login}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Create new account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </VideoScreen>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    padding: theme.spacing.lg,

    ...Platform.select({
      web: {
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      },
    }),
  },

  title: {
    fontSize: theme.fontSizes.xlarge,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },

  subtitle: {
    fontSize: theme.fontSizes.small,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: theme.colors.muted,
    marginBottom: theme.spacing.lg,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.card,
  },

  focused: {
    borderColor: theme.colors.primary,
  },

  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontFamily: "Poppins-Regular",
    fontSize: theme.fontSizes.medium,
    marginLeft: 8,
    color: theme.colors.text,
  },

  button: {
    backgroundColor: "#4F8EF7",
    borderRadius: 30,
    padding: theme.spacing.lg,
    alignItems: "center",
    marginTop: theme.spacing.md,
  },

  buttonText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: theme.fontSizes.large,
    letterSpacing: 1,
  },

  link: {
    marginTop: theme.spacing.md,
    textAlign: "center",
    color: "black",
    fontFamily: "Poppins-Regular",
  },
});
