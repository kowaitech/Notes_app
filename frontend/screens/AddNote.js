import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { apiFetch } from "../api/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "../styles/theme";
import VideoScreen from "./Videoback";

export default function AddNote({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleFocus, setTitleFocus] = useState(false);
  const [contentFocus, setContentFocus] = useState(false);

  const showAlert = (title, message) => {
    Platform.OS === "web"
      ? window.alert(`${title}\n\n${message}`)
      : Alert.alert(title, message);
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      showAlert("Validation Error", "Both title and content are required.");
      return;
    }

    try {
      await apiFetch("/notes", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      navigation.goBack();
    } catch {
      showAlert("Error", "Failed to save note");
    }
  };

  return (
    <VideoScreen>
      <SafeAreaView style={{ flex: 1, width: "100%" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <View style={styles.centerWrapper}>
            <View style={styles.card}>
              {/* 🔙 Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={22}
                  color={theme.colors.text}
                />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              {/* Title */}
              <View
                style={[
                  styles.inputWrapper,
                  titleFocus && styles.inputWrapperFocused,
                ]}
              >
                <MaterialIcons
                  name="title"
                  size={22}
                  color={theme.colors.muted}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  placeholderTextColor={theme.colors.muted}
                  value={title}
                  onChangeText={setTitle}
                  onFocus={() => setTitleFocus(true)}
                  onBlur={() => setTitleFocus(false)}
                />
              </View>

              {/* Content */}
              <View
                style={[
                  styles.inputWrapper,
                  contentFocus && styles.inputWrapperFocused,
                ]}
              >
                <MaterialIcons
                  name="notes"
                  size={22}
                  color={theme.colors.muted}
                  style={styles.icon}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Write your note..."
                  placeholderTextColor={theme.colors.muted}
                  multiline
                  value={content}
                  onChangeText={setContent}
                  onFocus={() => setContentFocus(true)}
                  onBlur={() => setContentFocus(false)}
                />
              </View>

              {/* Save */}
              <TouchableOpacity style={styles.button} onPress={saveNote}>
                <Text style={styles.buttonText}>SAVE NOTE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: theme.spacing.lg,
    maxWidth: 420,
    width: "100%",

    ...(Platform.OS === "web"
      ? { boxShadow: "0 8px 32px rgba(34,43,69,0.18)" }
      : {
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 32,
          elevation: 8,
        }),
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },

  backText: {
    marginLeft: 6,
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: "#fff",
  },

  inputWrapperFocused: {
    borderColor: theme.colors.primary,
    ...(Platform.OS === "web"
      ? { boxShadow: "0 0 0 2px #4F8EF7" }
      : {
          shadowColor: theme.colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 4,
        }),
  },

  icon: {
    marginRight: theme.spacing.sm,
  },

  input: {
    flex: 1,
    fontSize: theme.fontSizes.medium,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    paddingVertical: theme.spacing.md,
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#4F8EF7",
    padding: theme.spacing.lg,
    borderRadius: 30,
    alignItems: "center",
    marginTop: theme.spacing.md,
  },

  buttonText: {
    color: "#fff",
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSizes.large,
    letterSpacing: 1,
  },
});
