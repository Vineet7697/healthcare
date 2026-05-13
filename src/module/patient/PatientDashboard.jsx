import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { notify } from "../../utils/notify";
import {
  getPatientDashboard,
  getTokenStatus,
  cancelAppointment,
} from "../../services/patientService";
import { Plus, Users, Calendar, Clock } from "lucide-react";
import { notify } from "../../utils/notify";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const getImageUrl = (imagePath) => {
  if (!imagePath)
    return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${BASE_URL}/${imagePath}`.replace(/([^:])\/\//g, "$1/");
};

const getGreeting = () => {
  const h = new Date().getHours();

  if (h >= 5 && h < 12) return "Good Morning";
  if (h >= 12 && h < 17) return "Good Afternoon";
  if (h >= 17 && h < 21) return "Good Evening";
  if (h >= 21 && h < 24) return "Good Late Night";
  return "Good Night";
};

const statusConfig = {
  ACCEPTED: { color: "#166534", bg: "#dcfce7" },
  PENDING: { color: "#b45309", bg: "#fef3c7" },
  CANCELLED: { color: "#991b1b", bg: "#fee2e2" },
  COMPLETED: { color: "#0086C3", bg: "rgba(0,134,195,0.1)" },
  IN_PROGRESS: { color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
};

export default function PatientDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState("Patient");
  const [todayToken, setTodayToken] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelAppointmentId, setCancelAppointmentId] = useState(null);

  const isMyTurn =
    tokenStatus?.yourToken === tokenStatus?.nowServing &&
    tokenStatus?.status === "IN_PROGRESS";
  useEffect(() => {
    getPatientDashboard()
      .then((res) => {
        const data = res.data;
        setPatientName(data.patientName || "Patient");
        setTodayToken(data.todayToken || null);
        setUpcomingCount(data.upcomingCount || 0);
        if (data.appointments) {
          setAppointments(
            data.appointments.map((appt) => ({
              id: appt.id,
              doctor: appt.doctorName,
              specialization: appt.specialization,
              date: appt.appointment_date,
              slot: appt.appointment_slot,
              token: appt.token_number,
              status: appt.status,
              familyName: appt.familyName,
              relation: appt.relation,
              isFamily: !!appt.family_member_id,
              img: getImageUrl(appt.profile_image),
              experience: appt.experience,
              qualification: appt.qualification,
              consultationFee: appt.consultationFee,
              clinic: appt.clinic_name,
              address: appt.address,
              city: appt.city,
              languages: appt.languages,
              rating: appt.rating,
            })),
          );
        }
      })
      .catch(() => notify.error("Dashboard load failed"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (todayToken?.appointmentId) fetchTokenStatus(todayToken.appointmentId);
  }, [todayToken]);

  const fetchTokenStatus = async (appointmentId) => {
    try {
      const res = await getTokenStatus(appointmentId);
      setTokenStatus(res.data);
    } catch (err) {
      console.error("Token status error:", err);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      const res = await cancelAppointment(cancelAppointmentId);

      if (res.data.success) {
        notify.success("Appointment cancelled successfully");

        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === cancelAppointmentId
              ? { ...appt, status: "CANCELLED" }
              : appt,
          ),
        );

        setSelectedAppointment((prev) => ({
          ...prev,
          status: "CANCELLED",
        }));

        setShowCancelPopup(false);
      }
    } catch (err) {
      console.log(err);

      notify.error(
        err?.response?.data?.message || "Failed to cancel appointment",
      );
    }
  };

  const filteredAppointments = useMemo(() => {
    if (activeTab === "today") {
      const today = new Date().toDateString();
      return appointments.filter(
        (a) => new Date(a.date).toDateString() === today,
      );
    }
    if (activeTab === "next7") {
      const today = new Date();
      const next7 = new Date();
      next7.setDate(today.getDate() + 7);
      return appointments.filter((a) => {
        const d = new Date(a.date);
        return d >= today && d <= next7;
      });
    }
    return appointments;
  }, [appointments, activeTab]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen"
        style={{ background: "#f0f4f8" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0086C3] border-t-transparent rounded-full animate-spin" />
          <p className="font-[family-name:var(--font-dm)] text-sm text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 pb-20 pt-8"
      style={{ background: "#f0f4f8" }}
    >
      <div className="flex justify-between items-center mb-8 animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div>
          <p
            className="font-[family-name:var(--font-dm)] text-[13px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: "#0086C3" }}
          >
            {getGreeting()}
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-[26px] sm:text-[30px] font-extrabold text-[#0c1e3a]">
            {patientName}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 animate-[fadeUp_0.5s_0.08s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#0086C3,#00b4d8,#2ecc71)",
            boxShadow: "0 8px 32px rgba(0,134,195,0.35)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative">
            <p className="font-[family-name:var(--font-dm)] text-[13px] font-semibold text-white/80 uppercase tracking-wider mb-2">
              Upcoming Visits
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-[36px] font-extrabold text-white leading-none">
              {upcomingCount}
            </h2>
            <p className="font-[family-name:var(--font-dm)] text-[13px] text-white/70 mt-1">
              Appointments scheduled
            </p>
          </div>
        </div>

        {todayToken ? (
          <div
            className="bg-white rounded-2xl p-6"
            style={{
              boxShadow: "0 2px 20px rgba(12,30,58,0.08)",
              border: "1px solid rgba(0,134,195,0.15)",
            }}
          >
            <p
              className="font-[family-name:var(--font-dm)] text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "#94a3b8" }}
            >
              Upcoming Token Visit
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2
                className="font-[family-name:var(--font-playfair)] text-[32px] font-extrabold"
                style={{ color: "#0086C3" }}
              >
                #{tokenStatus?.yourToken || todayToken.token}
              </h2>
              <span
                className="font-[family-name:var(--font-dm)] text-[12px] font-bold px-3 py-1.5 rounded-full"
                style={
                  tokenStatus?.yourToken === tokenStatus?.nowServing
                    ? { color: "#166534", background: "#dcfce7" }
                    : { color: "#0086C3", background: "rgba(0,134,195,0.1)" }
                }
              >
                {tokenStatus?.nowServing !== null ? (
                  isMyTurn ? (
                    "🟢 Now Serving: Your Token"
                  ) : (
                    <>
                      Now Serving: #{tokenStatus?.nowServing} <br />
                      Your Token: #{tokenStatus?.yourToken}
                    </>
                  )
                ) : (
                  "Waiting..." // ✅ IMPORTANT
                )}
              </span>
            </div>
            <p
              className="font-[family-name:var(--font-dm)] text-[12px] mt-2"
              style={{ color: "#94a3b8" }}
            >
              {todayToken.type} Visit
            </p>
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl p-6 flex items-center justify-center"
            style={{
              boxShadow: "0 2px 20px rgba(12,30,58,0.08)",
              border: "1px solid rgba(12,30,58,0.06)",
            }}
          >
            <div className="text-center">
              <Clock size={28} color="#94a3b8" className="mx-auto mb-2" />
              <p
                className="font-[family-name:var(--font-dm)] text-[13px] font-semibold"
                style={{ color: "#94a3b8" }}
              >
                No token for today
              </p>
            </div>
          </div>
        )}

        <div
          className="bg-white rounded-2xl p-6"
          style={{
            boxShadow: "0 2px 20px rgba(12,30,58,0.08)",
            border: "1px solid rgba(12,30,58,0.06)",
          }}
        >
          <p
            className="font-[family-name:var(--font-dm)] text-[11px] font-bold uppercase tracking-widest mb-4"
            style={{ color: "#94a3b8" }}
          >
            Quick Actions
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Action
              icon={<Plus size={20} />}
              label="Book Now"
              onClick={() => navigate("/client/book-appointment")}
              color="#0086C3"
            />
            <Action
              icon={<Users size={20} />}
              label="Family"
              onClick={() => navigate("/client/family")}
              color="#2ecc71"
            />
          </div>
        </div>
      </div>

      <div className="animate-[fadeUp_0.5s_0.16s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-[family-name:var(--font-playfair)] text-[18px] font-bold text-[#0c1e3a]">
            Upcoming List
          </h3>
        </div>

        <div className="mb-5 overflow-x-auto">
          <div
            className="flex p-1 gap-1 rounded-xl w-max"
            style={{ background: "rgba(12,30,58,0.06)" }}
          >
            {[
              { key: "all", label: "All" },
              { key: "today", label: "Today" },
              { key: "next7", label: "Next 7 Days" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="font-[family-name:var(--font-dm)] text-[13px] font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap"
                style={
                  activeTab === tab.key
                    ? {
                        background: "#0086C3",
                        color: "#fff",
                        boxShadow: "0 2px 8px rgba(0,134,195,0.35)",
                      }
                    : { color: "#64748b", background: "transparent" }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4">
            {filteredAppointments.map((appt, idx) => {
              const cfg = statusConfig[appt.status] || {
                color: "#64748b",
                bg: "#f0f4f8",
              };
              return (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl p-5 transition-all duration-250 hover:-translate-y-1 cursor-pointer"
                  style={{
                    boxShadow: "0 2px 12px rgba(12,30,58,0.07)",
                    border: "1px solid rgba(12,30,58,0.06)",
                    animation: `fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) ${idx * 0.05}s both`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 8px 28px rgba(12,30,58,0.12)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 2px 12px rgba(12,30,58,0.07)")
                  }
                  onClick={() => {
                    setSelectedAppointment(appt);
                    setShowDetails(true);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={appt.img}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        style={{ border: "2px solid rgba(0,134,195,0.15)" }}
                        alt="doctor"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                        }}
                      />
                      <div>
                        <p className="font-[family-name:var(--font-dm)] text-[14px] font-semibold text-[#0c1e3a] leading-tight">
                          {appt.doctor}
                        </p>
                        <p
                          className="font-[family-name:var(--font-dm)] text-[12px] font-semibold mt-0.5"
                          style={{ color: "#0086C3" }}
                        >
                          {appt.specialization}
                        </p>
                        <p
                          className="font-[family-name:var(--font-dm)] text-[11px] mt-0.5 font-medium"
                          style={{
                            color: appt.isFamily ? "#7c3aed" : "#2ecc71",
                          }}
                        >
                          {appt.isFamily ? `👨‍👩‍👦 ${appt.familyName}` : "👤 Self"}
                        </p>
                      </div>
                    </div>
                    <span
                      className="font-[family-name:var(--font-dm)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex-shrink-0"
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between mt-4 px-3 py-2.5 rounded-xl gap-2 flex-wrap"
                    style={{ background: "#f8fafc" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} color="#94a3b8" />
                      <p className="font-[family-name:var(--font-dm)] text-[11px] font-medium text-[#64748b]">
                        {new Date(appt.date).toDateString()}
                      </p>
                    </div>
                    <p className="font-[family-name:var(--font-dm)] text-[11px] font-medium text-[#64748b]">
                      {appt.slot}
                    </p>
                    <p
                      className="font-[family-name:var(--font-playfair)] text-[13px] font-extrabold"
                      style={{ color: "#0086C3" }}
                    >
                      #{appt.token}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="bg-white rounded-2xl py-12 flex flex-col items-center gap-3"
            style={{
              boxShadow: "0 2px 12px rgba(12,30,58,0.07)",
              border: "1px solid rgba(12,30,58,0.06)",
            }}
          >
            <Calendar size={32} color="#94a3b8" />
            <p
              className="font-[family-name:var(--font-dm)] text-[14px] font-semibold"
              style={{ color: "#94a3b8" }}
            >
              No upcoming appointments
            </p>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {showDetails && selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="flex items-start justify-between px-5 pt-5 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Appointment Details
                </h2>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl font-light leading-none"
              >
                ✕
              </button>
            </div>

            <div className="px-5 pb-6 space-y-4">
              {/* ── Doctor Row ── */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAppointment.img}
                    alt="doctor"
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {selectedAppointment.doctor}
                    </h3>
                    <p className="text-sm font-semibold text-blue-500">
                      {selectedAppointment.specialization}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {selectedAppointment.rating} ⭐
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-500 text-xs font-bold tracking-wide">
                  {selectedAppointment.status}
                </span>
              </div>

              {/* ── Appointment Info Card ── */}
              <div className="border border-gray-100 rounded-2xl p-4 grid grid-cols-2 gap-y-4 gap-x-3">
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-xs text-gray-400">Patient</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedAppointment.isFamily
                      ? selectedAppointment.familyName
                      : "Self"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-xs text-gray-400">Date</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(selectedAppointment.date).toDateString()}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-xs text-gray-400">Time</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedAppointment.slot}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="4" y1="9" x2="20" y2="9" />
                      <line x1="4" y1="15" x2="20" y2="15" />
                      <line x1="10" y1="3" x2="8" y2="21" />
                      <line x1="16" y1="3" x2="14" y2="21" />
                    </svg>
                    <span className="text-xs text-gray-400">Token Number</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedAppointment.token}
                  </p>
                </div>
              </div>

              {/* ── Doctor & Clinic Info ── */}
              <h3 className="text-base font-bold text-gray-900">
                Doctor &amp; Clinic Information
              </h3>

              <div className="border border-gray-100 rounded-2xl p-5 grid grid-cols-2 gap-5">
                {/* Experience */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Experience</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 break-words">
                    {selectedAppointment.experience} Years
                  </p>
                </div>

                {/* Qualification */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Qualification</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 break-words">
                    {selectedAppointment.qualification}
                  </p>
                </div>

                {/* Clinic */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Clinic</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 break-words">
                    {selectedAppointment.clinic}
                  </p>
                </div>

                {/* Fee */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">
                      Consultation Fee
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800">
                    ₹{selectedAppointment.consultationFee}
                  </p>
                </div>

                {/* Languages */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Languages</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 break-words">
                    {selectedAppointment.languages}
                  </p>
                </div>

                {/* City */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">City</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 break-words">
                    {selectedAppointment.city}
                  </p>
                </div>

                {/* Address */}
                <div className="col-span-2 space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">Address</span>
                  </div>

                  <p className="text-sm font-semibold text-gray-800 break-words">
                    {selectedAppointment.address}
                  </p>
                </div>
              </div>

              {/* ── Actions ── */}
              <h3 className="text-base font-bold text-gray-900">Actions</h3>

              <div className="grid grid-cols-3 gap-3">
                {/* Reschedule */}
                {/* <button className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-500 hover:bg-blue-100 transition">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-xs font-semibold">Reschedule</span>
                </button> */}

                {/* Cancel */}
                <button
                  onClick={() => {
                    setCancelAppointmentId(selectedAppointment.id);
                    setShowCancelPopup(true);
                  }}
                  disabled={
                    selectedAppointment.status === "CANCELLED" ||
                    selectedAppointment.status === "COMPLETED"
                  }
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition ${
                    selectedAppointment.status === "CANCELLED" ||
                    selectedAppointment.status === "COMPLETED"
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-red-50 border-red-100 text-red-400 hover:bg-red-100"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                  <span className="text-xs font-semibold text-center leading-tight">
                    {selectedAppointment.status === "CANCELLED"
                      ? "Appointment Cancelled"
                      : selectedAppointment.status === "COMPLETED"
                        ? "Appointment Completed"
                        : "Cancel Appointment"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* CANCEL CONFIRM POPUP */}

{showCancelPopup && (
  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-[fadeUp_0.2s_ease]">

      {/* ICON */}

      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
      </div>

      {/* TEXT */}

      <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
        Cancel Appointment?
      </h2>

      <p className="text-sm text-gray-500 text-center leading-relaxed mb-8">
        Are you sure you want to cancel this appointment?
        This action cannot be undone.
      </p>

      {/* BUTTONS */}

      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={() => setShowCancelPopup(false)}
          className="py-3 rounded-2xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          Keep Appointment
        </button>

        <button
          onClick={handleCancelAppointment}
          className="py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition shadow-lg shadow-red-200"
        >
          Yes, Cancel
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}

function Action({ icon, label, onClick, color }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: `${color}10`, border: `1px solid ${color}25` }}
      onMouseEnter={(e) => (e.currentTarget.style.background = `${color}18`)}
      onMouseLeave={(e) => (e.currentTarget.style.background = `${color}10`)}
    >
      <div style={{ color }}>{icon}</div>
      <p className="font-[family-name:var(--font-dm)] text-[12px] font-bold text-[#0c1e3a]">
        {label}
      </p>
    </div>
  );
}
