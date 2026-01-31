// import api from "../../services/api";

import api from "../api";

export const patientLoginApi = (payload) => {
  return api.post("/auth/login", payload);
};