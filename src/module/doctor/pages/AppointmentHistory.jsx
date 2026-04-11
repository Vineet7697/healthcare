import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

const mapStatus = (status) => {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "REJECTED":
      return "Rejected";
    case "CANCELLED":
      return "Cancelled";
    case "ACCEPTED":
      return "In Queue";
    default:
      return status;
  }
};

const BASE_URL = import.meta.env.VITE_API_URL || "";

const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path}`.replace(/([^:])\/\//g, "$1/");
};

const getInitials = (name) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return words[0][0].toUpperCase() + words[1][0].toUpperCase();
};

const STATUS_STYLE = {
  Completed: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Cancelled: "bg-red-50 text-red-500 border-red-200",
  Rejected: "bg-red-50 text-red-500 border-red-200",
  "In Queue": "bg-amber-50 text-amber-600 border-amber-200",
};

const FILTERS = [
  { key: "TODAY", label: "Today" },
  { key: "7DAYS", label: "Last 7 Days" },
  { key: "ALL", label: "All" },
];

const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const getBackendFilter = () => {
    if (filter === "TODAY") return "today";
    if (filter === "7DAYS") return "last7";
    return "all";
  };

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/doctor/appointments/history?filter=${getBackendFilter()}`,
      );
      setAppointments(
        (res.data.appointments || []).map((a) => ({
          id: a.id,
          token: a.token_number,
          patientName: a.familyMemberName || a.patientName || "Walk-in Patient",
          image: a.patientImage
            ? a.patientImage.startsWith("http")
              ? a.patientImage
              : `${BASE_URL}/${a.patientImage}`
            : null,
          type: a.appointment_type || "Consultation",
          date: a.appointment_date,
          slot: a.appointment_slot,
          status: mapStatus(a.status),

          // ✅ ADD THIS LINE
          hasPrescription: a.hasPrescription || false,
        })),
      );
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [filter]);

  const sorted = useMemo(
    () => [...appointments].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [appointments],
  );

  const PatientAvatar = ({ image, name }) => {
    const url = buildImageUrl(image);
    return url ? (
      <img
        src={url}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border border-black/[0.07] flex-shrink-0"
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = "none";
        }}
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-[#0e7490] text-white flex items-center justify-center font-playfair font-bold text-[14px] flex-shrink-0">
        {getInitials(name)}
      </div>
    );
  };

  return (
    <div
      className="font-dm min-h-screen bg-[#f5f3ef] px-4 sm:px-6 py-10"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 10% 5%, rgba(14,116,144,0.05) 0%, transparent 50%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="animate-fade-up mb-4">
          <h1 className="font-playfair text-[clamp(24px,3.5vw,36px)] font-bold text-[#1c2b33] leading-tight">
            Appointment History
          </h1>
        </div>

        {/* FILTER TABS */}
        <div className="animate-fade-up [animation-delay:0.07s] flex gap-2 mb-4  border-black/[0.07] pb-0">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`font-dm pb-3 px-1 text-[14px] font-semibold whitespace-nowrap border-none bg-transparent cursor-pointer transition border-b-2 -mb-px
                ${
                  filter === f.key
                    ? "border-[#0e7490] text-[#0e7490]"
                    : "border-transparent text-[#6b7f8a] hover:text-[#1c2b33]"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-9 h-9 border-4 border-[rgba(14,116,144,0.2)] border-t-[#0e7490] rounded-full animate-spin" />
            <p className="font-dm text-[13px] text-[#6b7f8a]">
              Loading history…
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-4xl opacity-30">📋</span>
            <p className="font-dm text-[14px] text-[#6b7f8a]">
              No appointments found
            </p>
            <p className="font-dm text-[12px] text-[#9fb0b8]">
              Try changing the filter above
            </p>
          </div>
        )}

        {/* TABLE — desktop */}
        {!loading && sorted.length > 0 && (
          <>
            <div
              className="animate-fade-up [animation-delay:0.13s] hidden md:block bg-white border border-black/[0.07] rounded-[18px] overflow-hidden"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    {[
                      "Patient",
                      "Type",
                      "Token",
                      "Date & Time",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="font-dm text-[10px] font-semibold tracking-widest uppercase text-[#6b7f8a] px-5 py-4"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {sorted.map((a) => (
                    <tr key={a.id} className="hover:bg-[#fafaf8] transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <PatientAvatar image={a.image} name={a.patientName} />
                          <div>
                            <p className="font-dm font-semibold text-[14px] text-[#1c2b33]">
                              {a.patientName}
                            </p>
                            <p className="font-dm text-[11px] text-[#6b7f8a]">
                              {a.slot}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-dm text-[13px] text-[#6b7f8a]">
                        {a.type}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-dm text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#ecfeff] text-[#0e7490] border border-[rgba(14,116,144,0.15)]">
                          #{a.token}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-dm text-[13px] text-[#6b7f8a]">
                        {new Date(a.date).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`font-dm text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full border ${STATUS_STYLE[a.status] || "bg-slate-50 text-slate-500 border-slate-200"}`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {a.status === "Completed" && (
                          <button
                            onClick={() =>
                              navigate(`/doctordashboard/prescription/${a.id}`)
                            }
                            className="font-dm text-[11px] font-semibold text-white bg-[#0e7490] hover:bg-[#0c5f75] px-3 py-1.5 rounded-full border-none cursor-pointer transition"
                            style={{
                              boxShadow: "0 2px 8px rgba(14,116,144,0.2)",
                            }}
                          >
                            {a.hasPrescription ? "Update Rx" : "+ Prescription"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARDS — mobile */}
            <div className="md:hidden space-y-3 animate-fade-up [animation-delay:0.13s]">
              {sorted.map((a) => (
                <div
                  key={a.id}
                  className="bg-white border border-black/[0.07] rounded-[16px] p-5"
                  style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <PatientAvatar image={a.image} name={a.patientName} />
                    <div>
                      <p className="font-dm font-semibold text-[14px] text-[#1c2b33]">
                        {a.patientName}
                      </p>
                      <p className="font-dm text-[11px] text-[#6b7f8a]">
                        {a.slot}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[12px]">
                    <div>
                      <p className="font-dm text-[9px] uppercase tracking-widest text-[#9fb0b8] mb-0.5">
                        Type
                      </p>
                      <p className="font-dm text-[#1c2b33]">{a.type}</p>
                    </div>
                    <div>
                      <p className="font-dm text-[9px] uppercase tracking-widest text-[#9fb0b8] mb-0.5">
                        Token
                      </p>
                      <p className="font-dm text-[#1c2b33]">#{a.token}</p>
                    </div>
                    <div>
                      <p className="font-dm text-[9px] uppercase tracking-widest text-[#9fb0b8] mb-0.5">
                        Date
                      </p>
                      <p className="font-dm text-[#1c2b33]">
                        {new Date(a.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="font-dm text-[9px] uppercase tracking-widest text-[#9fb0b8] mb-0.5">
                        Status
                      </p>
                      <span
                        className={`font-dm text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_STYLE[a.status] || "bg-slate-50 text-slate-500 border-slate-200"}`}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;
