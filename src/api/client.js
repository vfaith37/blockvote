import axios from "axios";
import { getOrgToken, getVoterToken } from "./auth";

// The API is always mounted at /api on the backend. Normalize VITE_API_URL so
// it works whether it's set to the host ("https://api.example.com") or already
// includes the suffix ("https://api.example.com/api") — both resolve to /api.
const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:9000";
const baseURL = RAW_BASE.replace(/\/+$/, "").replace(/\/api$/, "") + "/api";

const client = axios.create({ baseURL });

// Only the voter's own ballot actions use the voter JWT; every other call
// (including admin voter-management endpoints like getAllVoters) uses the
// organization JWT when one is present.
const isVoterAction = (url = "") =>
  url.includes("voter/vote") || url.includes("voter/verifyBallot");

client.interceptors.request.use((config) => {
  const orgToken = getOrgToken();
  const voterToken = getVoterToken();

  if (isVoterAction(config.url)) {
    if (voterToken) config.headers.Authorization = `Bearer ${voterToken}`;
  } else if (orgToken) {
    config.headers.Authorization = `Bearer ${orgToken}`;
  } else if (voterToken) {
    config.headers.Authorization = `Bearer ${voterToken}`;
  }
  return config;
});

// On 401, send the user back to the appropriate login instead of leaving them
// on a broken page. Skip the auth endpoints themselves to avoid redirect loops.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response && error.response.status;
    const url = (error.config && error.config.url) || "";
    const isAuthCall =
      url.includes("signin") ||
      url.includes("signup") ||
      url.includes("voter/login") ||
      url.includes("verifyUser");

    if (status === 401 && !isAuthCall) {
      const path = window.location.pathname;
      if (path.startsWith("/voters") || path.startsWith("/voterselect")) {
        localStorage.removeItem("voterToken");
        localStorage.removeItem("voterInfo");
        if (!path.endsWith("/login")) window.location.assign("/voters/login");
      } else if (path.startsWith("/dashboard")) {
        ["token", "refreshToken", "userInfo", "isAuthenticated", "rememberMe"].forEach(
          (k) => localStorage.removeItem(k),
        );
        window.location.assign("/organization");
      }
    }
    return Promise.reject(error);
  },
);

export default client;
