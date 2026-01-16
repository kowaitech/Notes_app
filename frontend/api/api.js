import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "../auth/authStorage";

const BASE_URL = "http://192.168.0.105:5600"; 
// const BASE_URL ="https://notes-app-2g6i.onrender.com"
// const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;

export async function apiFetch(url, options = {}) {
  let token = await getAccessToken();

  let response = await fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 403) {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      await clearTokens();
      throw new Error("Session expired");
    }

    const r = await fetch(BASE_URL + "/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!r.ok) {
      await clearTokens();
      throw new Error("Session expired");
    }

    const data = await r.json();
    await saveTokens(data.accessToken, refreshToken);
    return apiFetch(url, options);
  }

  return response;
}
