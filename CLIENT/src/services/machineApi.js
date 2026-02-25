import api from "../services/api";

const API = api.create({
  baseURL: "/api/machines",
});

export const getHospitalMachines = (hospitalId) =>
  API.get(`/${hospitalId}`);
