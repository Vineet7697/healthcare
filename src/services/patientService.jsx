import api from "./api";

/* ================= DASHBOARD ================= */
export const getPatientDashboard = () =>
  api.get("/patient/dashboard");

/* ================= SEARCH ================= */
export const searchVisitDoctors = (params) =>
  api.get("/patient/visit/doctors", { params });

export const getCities = () =>
  api.get("/patient/cities");

export const getDiseases = () =>
  api.get("/patient/diseases");

/* ================= APPOINTMENTS ================= */
export const bookVisitAppointment = (data) =>
  api.post("/patient/visit/appointments", data);



export const getUpcomingAppointments = (filter = "") =>
  api.get("/patient/appointments/upcoming", {
    params: filter ? { filter } : {},
  });

export const cancelAppointment = (id) =>
  api.put(`/patient/visit/appointments/${id}/cancel`);

/* ================= FAMILY ================= */
export const getFamilyMembers = () =>
  api.get("/patient/getfamily");

export const addFamilyMember = (data) =>
  api.post("/patient/addfamily", data);

export const updateFamilyMember = (id, data) =>
  api.put(`/patient/updatefamily/${id}`, data);

export const deleteFamilyMember = (id) =>
  api.delete(`/patient/deletefamily/${id}`);

/* ================= NOTIFICATIONS ================= */
export const getNotifications = () =>
  api.get("/patient/notifications");

export const markNotificationRead = (id) =>
  api.put(`/patient/notifications/${id}/read`);
