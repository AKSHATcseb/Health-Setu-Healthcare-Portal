import { getAuth } from "firebase/auth";
import api from "../services/api";

const API = api.create({
  baseURL: "/api/hospitals",
});

API.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getMyHospital = () => API.get("/my");
