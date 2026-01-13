import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { apiFetch } from "../api/api";

export default function EditNote({ route, navigation }) {
  const { note } = route.params;

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const updateNote = async () => {
    await apiFetch(`/notes/${note._id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        value={content}
        multiline
        onChangeText={setContent}
      />

      <TouchableOpacity style={styles.button} onPress={updateNote}>
        <Text style={styles.buttonText}>UPDATE NOTE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
