import { getAuth } from "firebase/auth";
import api from "../services/api";

const API = api.create({
  baseURL: "/api/appointments",
});

API.interceptors.request.use(async (config) => {
  const user = getAuth().currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getHospitalAppointments = (hospitalId) =>
  API.get(`/hospital/${hospitalId}`);

export const cancelAppointment = (id) =>
  API.put(`/cancel/${id}`);

export const startSession = (id) =>
  API.put(`/start/${id}`);

export const completeSession = (id) =>
  API.put(`/complete/${id}`);
