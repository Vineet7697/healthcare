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
    <div className="min-h-screen bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] p-6">
      {/* ================= HERO ================= */}
      <div className="mb-6 bg-white rounded-3xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">
            Hello, {patientName || "Patient"}
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Here’s a quick overview of your health activities
          </p>
        </div>

        <button
          onClick={() => navigate("/client/book-appointment")}
          className="mt-3 md:mt-0 px-5 py-3 rounded-xl bg-linear-to-r from-blue-500 to-teal-500 text-white font-semibold shadow cursor-pointer hover:opacity-90 flex items-center gap-2"
        >
          + Book Appointment
        </button>
      </div>

      {/* ================= TOP CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Upcoming Appointment */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaCalendarCheck className="text-blue-500" />
            Upcoming Appointment
          </p>

          {upcoming ? (
            <>
              <p className="font-semibold text-lg text-gray-800 mt-2">
                {upcoming.doctorName}
              </p>
              <p className="text-sm text-gray-600">
                {upcoming.date} • {upcoming.time || upcoming.session}
              </p>

              <button
                onClick={() => navigate("/client/appointment")}
                className="mt-4 w-full py-2 rounded-xl bg-blue-500 text-white"
              >
                View Details
              </button>
            </>
          ) : (
            <p className="mt-3 text-gray-500">No upcoming appointment</p>
          )}
        </div>

        {/* Current Queue */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-l-4 border-yellow-400">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaClock className="text-yellow-500" />
            Current Queue
          </p>
          <p className="text-4xl font-bold text-yellow-500 mt-4">{queue}</p>
        </div>

        {/* Your Token */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaListOl className="text-green-500" />
            Your Token
          </p>
          <p className="text-4xl font-bold text-green-600 mt-4">{token}</p>
        </div>
      </div>

      {/* ================= MY DOCTORS ================= */}
      <div className="bg-white rounded-3xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          👨‍⚕️ My Doctors
        </h2>

        {upcoming ? (
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <FaUserMd className="text-blue-500 text-2xl" />
              <div>
                <p className="font-medium">{upcoming.doctorName}</p>
                <p className="text-sm text-gray-500">
                  {upcoming.specialization}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                navigate(`/client/bookappointmentpage/${upcoming.doctorId}`)
              }
              className="text-sm px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              Book Again
            </button>
          </div>
        ) : (
          <p className="text-gray-500">No doctors yet</p>
        )}
      </div>

      {/* ================= NOTIFICATIONS ================= */}
      <div className="bg-white rounded-3xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FaBell className="text-orange-500" /> Notifications
        </h2>

        <p className="text-gray-500 text-sm">No new notifications</p>
      </div>
    </div>
  );
};

export default PatientDashboard;
