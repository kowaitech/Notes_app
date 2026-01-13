

import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const saveTokens = async (access, refresh) => {
  if (Platform.OS === "web") {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  } else {
    await SecureStore.setItemAsync("accessToken", access);
    await SecureStore.setItemAsync("refreshToken", refresh);
  }
};

export const getAccessToken = async () => {
  return Platform.OS === "web"
    ? localStorage.getItem("accessToken")
    : SecureStore.getItemAsync("accessToken");
};

export const getRefreshToken = async () => {
  return Platform.OS === "web"
    ? localStorage.getItem("refreshToken")
    : SecureStore.getItemAsync("refreshToken");
};

export const clearTokens = async () => {
  if (Platform.OS === "web") {
    localStorage.clear();
  } else {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
  }
};

export const isLoggedIn = async () => {
  const token =
    Platform.OS === "web"
      ? localStorage.getItem("accessToken")
      : await SecureStore.getItemAsync("accessToken");

  return !!token;
};
