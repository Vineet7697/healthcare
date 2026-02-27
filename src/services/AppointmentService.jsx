import api from "./api";

/* ================= API → UI MAPPER =================
   Backend truth:
   status = PENDING | ACCEPTED | IN_PROGRESS | COMPLETED | CANCELLED | REJECTED
--------------------------------------------------- */
const mapFromApi = (a) => ({
  id: a.id,

  // doctor
  doctorId: a.doctor_id || a.doctorId,
  doctorName: a.doctor_name || a.doctorName,
  specialization: a.specialization || "",
 profile_image: a.profile_image || null,
  // appointment
  date: a.appointment_date
    ? a.appointment_date.slice(0, 10)
    : "",
  token: a.token_number
    ? `Token #${a.token_number}`
    : a.appointment_time || "--",

  status: a.status, // 👈 backend status as-is

  // optional
  hospital: a.hospital || "N/A",
  prescription: a.prescription || null,
});

/* ================= SERVICE ================= */
const AppointmentService = {

  getHistory: async () => {
    const res = await api.get(
      "/patient/visit/appointments/history"
    );

    const list = res.data.appointments || []; // 👈 backend-safe
    return list.map(mapFromApi);
  },

  /* 🔹 CANCEL APPOINTMENT */
  cancel: async (id) => {
    const res = await api.put(
      `/patient/visit/appointments/${id}/cancel`
    );
    return res.data;
  },

  /* 🔹 RATE DOCTOR (backend aligned) */
  rateDoctor: async (doctorId, rating) => {
    const res = await api.post("/patient/doctor-feedback", {
      doctorId,
      rating,
    });
    return res.data;
  },
};

export default AppointmentService;
