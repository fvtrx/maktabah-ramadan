import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

axios.defaults.withCredentials = true;

export const maktabahRamadanBaseUrl = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ["X-Access-Token"]: process.env.NEXT_PUBLIC_API_KEY,
  },
});

maktabahRamadanBaseUrl.interceptors.response.use(null, (error) => {
  if (process.env.VERCEL_ENV !== "development") {
    // Overwrites console error logging.
    // Workaround hack. do better :/
    window.console.error = () => {};
  }

  throw error;
});
