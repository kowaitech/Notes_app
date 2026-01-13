import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { apiFetch } from "../api/api";
import { clearTokens } from "../auth/authStorage";
import { Platform } from "react-native";

export default function Notes({ navigation }) {
  const [notes, setNotes] = useState([]);

  // ✅ Auto refresh when screen is focused
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
  // ✅ WEB CONFIRM
  if (Platform.OS === "web") {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;

    await performDelete(id);
    return;
  }

  // ✅ MOBILE CONFIRM
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

    // ✅ INSTANT UI UPDATE
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
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
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
                  onPress={() =>
                    navigation.navigate("EditNote", { note: item })
                  }
                >
                  <Text style={styles.edit}>✏️</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteNote(item._id)}>
                  <Text style={styles.delete}>🗑</Text>
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
        <Text style={styles.addText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logout: {
    color: "#E53935",
    fontWeight: "bold",
  },

  noteCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },

  cardActions: {
    flexDirection: "row",
    gap: 12,
  },

  edit: {
    fontSize: 18,
  },

  delete: {
    fontSize: 18,
  },

  noteContent: {
    marginTop: 8,
    color: "#555",
  },

  addButton: {
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 20,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addText: {
    fontSize: 30,
    color: "#fff",
  },
});
