import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "/api"
    : "https://real-estate-6q4b.onrender.com/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
