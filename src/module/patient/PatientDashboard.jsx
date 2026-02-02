import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  FaCalendarCheck,
  FaBell,
  FaUserMd,
  FaClock,
  FaListOl,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getPatientDashboard } from "../../services/patientService";

const PatientDashboard = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [upcoming, setUpcoming] = useState(null);
  const [queue, setQueue] = useState(0);
  const [token, setToken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("");
  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    getPatientDashboard()
      .then((res) => {
        const data = res.data;
        setPatientName(data.patientName);
        // 🔁 BACKEND → UI MAPPING (NO UI CHANGE)
        setUpcoming(
          data.appointments && data.appointments.length > 0
            ? {
                doctorName: data.appointments[0].doctorName,
                specialization: data.appointments[0].specialization,
                date: data.appointments[0].appointment_date,
                session: data.appointments[0].appointment_slot,
                doctorId: data.appointments[0].doctor_id,
              }
            : null,
        );

        setQueue(data.todayToken ? data.todayToken.token : 0);

        setToken(data.todayToken ? data.todayToken.token : 0);
      })
      .catch(() => toast.error("Dashboard load failed"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-6 md:px-8">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Hello, {patientName || "Patient"} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here’s your health overview for today
          </p>
        </div>

        <button
          onClick={() => navigate("/client/book-appointment")}
          className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow hover:opacity-90"
        >
          + Book Appointment
        </button>
      </div>

      {/* ================= STATUS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Upcoming Appointment */}
        <div className="bg-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 opacity-10">
            <FaCalendarCheck className="text-6xl text-blue-500" />
          </div>

          <p className="text-sm text-slate-500 mb-2">Upcoming Appointment</p>

          {upcoming ? (
            <>
              <h3 className="font-semibold text-lg text-slate-800">
                {upcoming.doctorName}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {upcoming.date} • {upcoming.session}
              </p>

              <button
                onClick={() => navigate("/client/appointment")}
                className="mt-4 w-full py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
              >
                View Details
              </button>
            </>
          ) : (
            <p className="text-slate-400 mt-3">No upcoming appointment</p>
          )}
        </div>

        {/* Current Queue */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <FaClock className="text-yellow-500" />
            Current Queue
          </p>
          <p className="text-5xl font-bold text-yellow-600 mt-4">
            {queue || "--"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Patients ahead</p>
        </div>

        {/* Your Token */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-600 flex items-center gap-2">
            <FaListOl className="text-green-600" />
            Your Token
          </p>
          <p className="text-5xl font-bold text-emerald-600 mt-4">
            {token || "--"}
          </p>
          <p className="text-xs text-slate-500 mt-1">Today’s token number</p>
        </div>
      </div>

      {/* ================= MY DOCTOR ================= */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          👨‍⚕️ My Doctor
        </h2>

        {upcoming ? (
          <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUserMd className="text-blue-600 text-xl" />
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  {upcoming.doctorName}
                </p>
                <p className="text-sm text-slate-500">
                  {upcoming.specialization}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                navigate(`/client/bookappointmentpage/${upcoming.doctorId}`)
              }
              className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 text-sm font-medium hover:bg-blue-500 hover:text-white transition"
            >
              Book Again
            </button>
          </div>
        ) : (
          <p className="text-slate-400">No doctors yet</p>
        )}
      </div>

      {/* ================= FLOATING BUTTON (MOBILE) ================= */}
      <button
        onClick={() => navigate("/client/book-appointment")}
        className="fixed bottom-6 right-6 md:hidden size-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg flex items-center justify-center text-2xl"
      >
        +
      </button>
    </div>
  );
};

export default PatientDashboard;