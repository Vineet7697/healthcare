import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/notify";
import {
  getPatientDashboard,
  getTokenStatus,
} from "../../services/patientService";
import { Plus, Users, Calendar, Clock } from "lucide-react";

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
                  className="bg-white rounded-2xl p-5 transition-all duration-250 hover:-translate-y-1"
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
