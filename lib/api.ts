import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
