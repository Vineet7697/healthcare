// import api from "./api";

// /* ================= FETCH NOTIFICATIONS ================= */
// export const fetchNotifications = async (role) => {
//   if (role === "PATIENT") {
//     return api.get("/patient/notifications");
//   }

//   if (role === "DOCTOR") {
//     return api.get("/doctor/notifications");
//   }

//   throw new Error("Invalid role");
// };

// /* ================= MARK AS READ ================= */
// export const markNotificationRead = async (role, id) => {
//   if (role === "PATIENT") {
//     return api.put(`/patient/notifications/${id}/read`);
//   }

//   if (role === "DOCTOR") {
//     return api.put(`/doctor/notifications/${id}/read`);
//   }

//   throw new Error("Invalid role");
// };
