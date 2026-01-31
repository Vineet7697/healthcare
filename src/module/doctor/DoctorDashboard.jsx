import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaQrcode,
  FaPlus,
  FaUserClock,
  FaToggleOn,
  FaToggleOff,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../../services/api"; // ✅ AXIOS INSTANCE

const DoctorDashboardHome = () => {
  const navigate = useNavigate();

  // 🔑 IMPORTANT: loggedInUser (NOT loggedInDoctor)
  const doctor = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const [doctorName, setDoctorName] = useState("");

  /* ================= STATE ================= */
  const [dashboard, setDashboard] = useState({
    pendingRequests: 0,
    todayQueue: 0,
    completedToday: 0,
  });

  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/doctor/dashboard");

        setDashboard({
          pendingRequests: res.data.pendingRequests || 0,
          todayQueue: res.data.todayQueue || 0,
          completedToday: res.data.completedToday || 0,
        });
        setDoctorName(res.data.doctorName || "");
        // backend me isOnline nahi aata, default true
        setIsOnline(true);
      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* ================= DERIVED VALUES ================= */
  const totalToday =
    dashboard.pendingRequests + dashboard.todayQueue + dashboard.completedToday;

  /* ================= TOGGLE ONLINE ================= */
  const toggleAvailability = async () => {
    const newStatus = !isOnline;

    try {
      // ✅ backend expects isAvailable
      await api.put("/doctor/availability", {
        isAvailable: newStatus,
      });

      setIsOnline(newStatus);
    } catch (error) {
      console.error("Status update failed", error);
      alert("Unable to update status. Try again.");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading dashboard...</div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Welcome, {doctorName || "Doctor"}
          </h2>
          <p className="text-sm text-gray-500">
            Here’s today’s overview of your clinic
          </p>
        </div>

        <button
          onClick={toggleAvailability}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition w-full sm:w-auto justify-center ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        >
          {isOnline ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
          {isOnline ? "Online" : "Offline"}
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Incoming Appointments"
          value={dashboard.pendingRequests}
          icon={<FaUsers />}
          onClick={() => navigate("/doctordashboard/incoming")}
        />

        <StatCard
          title="Today Queue"
          value={dashboard.todayQueue}
          icon={<FaUserClock />}
        />

        <StatCard
          title="Completed Today"
          value={dashboard.completedToday}
          icon={<FaCheckCircle />}
        />

        <StatCard
          title="Today Total Patients"
          value={totalToday}
          icon={<FaUsers />}
        />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActionBtn
          label="Live Queue"
          icon={<FaUserClock />}
          onClick={() => navigate("/doctordashboard/livequeue")}
        />

        <ActionBtn
          label="QR Walk-In"
          icon={<FaQrcode />}
          onClick={() => navigate("/doctordashboard/qrcode")}
        />

        <ActionBtn
          label="Manual Booking"
          icon={<FaPlus />}
          onClick={() => navigate("/doctordashboard/manualbooking")}
        />
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const StatCard = ({ title, value, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-xl shadow border flex justify-between items-center 
               cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition"
  >
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl sm:text-2xl font-semibold text-gray-800">{value}</p>
    </div>
    <div className="text-[#2277f7] text-xl sm:text-2xl">{icon}</div>
  </div>
);

const ActionBtn = ({ label, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center gap-3 p-4 sm:p-5
               bg-linear-to-br from-[#2277f7] to-[#52abd4]
               text-white rounded-xl cursor-pointer hover:opacity-90
               text-sm sm:text-base"
  >
    {icon}
    {label}
  </button>
);

export default DoctorDashboardHome;
