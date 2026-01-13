// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import { saveTokens } from "../auth/authStorage";
// import { useState } from "react";
// export default function Login({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const login = async () => {
//     const res = await fetch("http://192.168.1.10:5600/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       await saveTokens(data.accessToken, data.refreshToken);
//       navigation.replace("Notes");
//     } else {
//       Alert.alert("Error", data.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
//       <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
//       <TouchableOpacity style={styles.button} onPress={login}>
//         <Text style={styles.buttonText}>LOGIN</Text>
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
import { saveTokens } from "../auth/authStorage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;

    const res = await fetch("http://192.168.0.105:5600/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      await saveTokens(data.accessToken, data.refreshToken);
      navigation.replace("Notes");
    } else {
      Alert.alert("Error", data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your notes</Text>

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

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Create new account</Text>
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
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
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
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#4CAF50",
  },
});
