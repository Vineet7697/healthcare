import api from "./api";

/* ================= DOCTOR ================= */

export const getDoctorNotifications = () =>
  api.get("/doctor/notifications");

export const getDoctorUnreadCount = () =>
  api.get("/doctor/notifications/unread-count");

export const markDoctorNotificationRead = (id) =>
  api.put(`/doctor/notifications/${id}/read`);

export const markAllDoctorNotificationsRead = () =>
  api.put("/doctor/notifications/read-all");


/* ================= PATIENT ================= */

export const getPatientNotifications = () =>
  api.get("/patient/notifications");

export const markPatientNotificationRead = (id) =>
  api.put(`/patient/notifications/${id}/read`);

export const getPatientUnreadCount = () =>
  api.get("/patient/notifications/unread-count");