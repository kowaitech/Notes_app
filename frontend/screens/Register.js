// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

// export default function Register({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const register = async () => {
//     const res = await fetch("http://192.168.1.10:5600/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (res.ok) {
//       Alert.alert("Success", "Registered successfully");
//       navigation.navigate("Login");
//     } else {
//       Alert.alert("Error", "Registration failed");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>
//       <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
//       <TouchableOpacity style={styles.button} onPress={register}>
//         <Text style={styles.buttonText}>REGISTER</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;

  const register = async () => {
    const res = await fetch("https://notes-app-2g6i.onrender.com/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      Alert.alert("Success", "Account created");
      navigation.navigate("Login");
    } else {
      Alert.alert("Error", "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
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
