import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export { instance };