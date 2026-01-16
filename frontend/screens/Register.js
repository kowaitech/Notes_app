// import { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";

// export default function Register({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

// // const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;

//   const register = async () => {
//     const res = await fetch("https://notes-app-2g6i.onrender.com/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (res.ok) {
//       Alert.alert("Success", "Account created");
//       navigation.navigate("Login");
//     } else {
//       Alert.alert("Error", "Registration failed");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         onChangeText={setPassword}
//       />

//       <TouchableOpacity style={styles.button} onPress={register}>
//         <Text style={styles.buttonText}>REGISTER</Text>
//       </TouchableOpacity>


//        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//             <Text style={styles.link}>Already have an account? Login</Text>
//         </TouchableOpacity>
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
  Platform,
} from "react-native";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Unified alert for mobile + web
  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // ✅ Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ✅ Password validation
  const isValidPassword = (password) => {
    // at least 6 chars, one letter, one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return passwordRegex.test(password);
  };

  const register = async () => {
    if (!email || !password) {
      showAlert("Validation Error", "All fields are required");
      return;
    }

    if (!isValidEmail(email)) {
      showAlert("Validation Error", "Enter a valid email address");
      return;
    }

    if (!isValidPassword(password)) {
      showAlert(
        "Validation Error",
        "Password must be at least 6 characters and contain at least one letter and one number"
      );
      return;
    }

    try {
      const res = await fetch(
        "https://notes-app-2g6i.onrender.com/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (res.ok) {
        showAlert("Success", "Account created");
        navigation.navigate("Login");
      } else {
        showAlert("Error", "Registration failed");
      }
    } catch (error) {
      showAlert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
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

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
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
   link: {
    marginTop: 20,
    textAlign: "center",
    color: "#4CAF50",
  },
});

