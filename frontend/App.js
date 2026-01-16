import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Notes from "./screens/Notes";
import AddNote from "./screens/AddNote";
import EditNote from "./screens/EditNotes";
import { isLoggedIn } from "./auth/authStorage";
import { useState,useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

const Stack = createNativeStackNavigator();


export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const loggedIn = await isLoggedIn();
    setInitialRoute(loggedIn ? "Notes" : "Login");
  };

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
      <SafeAreaProvider>

    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Notes" component={Notes} />
        <Stack.Screen name="AddNote" component={AddNote} />
        <Stack.Screen name="EditNote" component={EditNote} />
      </Stack.Navigator>
    </NavigationContainer>
      </SafeAreaProvider>

  );
}
