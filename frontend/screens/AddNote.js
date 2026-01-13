// import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
// import { apiFetch } from "../api/api";

// export default function AddNote({ navigation }) {
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const saveNote = async () => {
//     await apiFetch("/notes", {
//       method: "POST",
//       body: JSON.stringify({ title, content }),
//     });
//     navigation.goBack();
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput style={styles.input} placeholder="Title" onChangeText={setTitle} />
//       <TextInput style={styles.input} placeholder="Content" multiline onChangeText={setContent} />
//       <TouchableOpacity style={styles.button} onPress={saveNote}>
//         <Text style={styles.buttonText}>SAVE</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { apiFetch } from "../api/api";

export default function AddNote({ navigation }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const saveNote = async () => {
    await apiFetch("/notes", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your note..."
        multiline
        onChangeText={setContent}
      />

      <TouchableOpacity style={styles.button} onPress={saveNote}>
        <Text style={styles.buttonText}>SAVE NOTE</Text>
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
