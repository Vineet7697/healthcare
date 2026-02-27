import api from "./api";

/* ================= DASHBOARD ================= */
export const getDoctorDashboard = () =>
  api.get("/doctor/dashboard");

/* ================= AVAILABILITY ================= */
export const updateDoctorAvailability = (isAvailable) =>
  api.put("/doctor/availability", { isAvailable });

/* ================= APPOINTMENTS ================= */
export const getIncomingAppointments = () =>
  api.get("/doctor/appointments/incoming");

export const respondAppointment = (id, action) =>
  api.put(`/doctor/respond-appointment/${id}`, { action });

export const startAppointment = (id) =>
  api.put(`/doctor/appointments/${id}/start`);

export const completeAppointment = (id) =>
  api.put(`/doctor/appointments/${id}/complete`);

/* ================= LIVE QUEUE ================= */
export const getTodayQueue = (slot) =>
  api.get(`/doctor/appointments/today-queue?slot=${slot}`);

export const callNextToken = (slot) =>
  api.post("/doctor/appointments/next-token", { slot });

export const markPatientAbsent = (id) => {
  return api.put(`/doctor/appointments/${id}/absent`);
};

/* ================= HISTORY ================= */
export const getAppointmentHistory = (filter = "all") =>
  api.get(`/doctor/appointments/history?filter=${filter}`);

/* ================= PROFILE ================= */
export const getDoctorProfile = () =>
  api.get("/doctor/profile");

export const updateDoctorProfile = (data) =>
  api.put("/doctor/profile", data);

/* ================= VISIT SUMMARY ================= */
export const addVisitSummary = (appointmentId, data) =>
  api.post(`/doctor/appointments/${appointmentId}/summary`, data);

/* ================= REVIEWS ================= */
export const getDoctorReviews = () =>
  api.get("/doctor/reviews");


/* ================= WALK-IN (QR BOOKING) ================= */
export const getMyQR = () => {
  return api.get("/doctor/my-qr");
};
