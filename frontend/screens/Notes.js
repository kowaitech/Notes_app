
import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { apiFetch } from "../api/api";
import { clearTokens } from "../auth/authStorage";
import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from '@expo/vector-icons';
import theme from "../styles/theme";
import VideoScreen from "./Videoback";
export default function Notes({ navigation }) {
  const [notes, setNotes] = useState([]);

  //  Auto refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    try {
      const res = await apiFetch("/notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.log(err);
    }
  };


const deleteNote = async (id) => {
  //  WEB CONFIRM
  if (Platform.OS === "web") {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    await performDelete(id);
    return;
  }

  // MOBILE CONFIRM
  Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
    { text: "Cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: () => performDelete(id),
    },
  ]);
};

const performDelete = async (id) => {
  try {
    const res = await apiFetch(`/notes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Delete failed:", errText);
      Alert.alert("Error", "Failed to delete note");
      return;
    }

    //  INSTANT UI UPDATE
    setNotes((prev) => prev.filter((note) => note._id !== id));
  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Server not reachable");
  }
};



  const logout = async () => {
    await clearTokens();
    navigation.replace("Login");
  };

  return (
    <VideoScreen>
   <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Notes</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <MaterialIcons name="logout" size={22} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
        {/* NOTES LIST */}
        <FlatList
          data={notes}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.noteTitle}>{item.title}</Text>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EditNote", { note: item })}
                  >
                    <MaterialIcons name="edit" size={20} color={theme.colors.primary} style={styles.actionIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteNote(item._id)}>
                    <MaterialIcons name="delete" size={20} color={theme.colors.error} style={styles.actionIcon} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.noteContent}>{item.content}</Text>
            </View>
          )}
        />
        {/* FLOATING ADD BUTTON */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddNote")}
        >
          <MaterialIcons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </VideoScreen>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: theme.spacing.lg,
    minHeight: '100vh',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xlarge,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    letterSpacing: 1,
  },
  logoutBtn: {
    padding: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  noteCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 16,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(34,43,69,0.08)',
      },
      default: {
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  noteTitle: {
    fontSize: theme.fontSizes.large,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionIcon: {
    marginLeft: theme.spacing.sm,
  },
  noteContent: {
    marginTop: theme.spacing.xs,
    color: theme.colors.muted,
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSizes.medium,
  },
  addButton: {
    backgroundColor: '#4F8EF7',
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 20,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(79,142,247,0.12)',
      },
      default: {
        shadowColor: '#4F8EF7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 3,
      },
    }),
  },
});
