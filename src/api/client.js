import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000/api",
});

// Voter endpoints are protected with the voter JWT issued by /voter/login.
client.interceptors.request.use((config) => {
  const voterToken = localStorage.getItem("voterToken");
  if (voterToken && config.url && config.url.includes("voter/")) {
    config.headers.Authorization = `Bearer ${voterToken}`;
  }
  return config;
});

export default client;
