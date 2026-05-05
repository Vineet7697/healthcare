import React, { useEffect, useState } from "react";
import { Calendar, Sun, CloudSun, XCircle, X, Download, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";
import AppointmentService from "../../../services/AppointmentService";
import { generatePrescriptionPDF } from "../../../utils/generatePrescriptionPDF";
import api from "../../../services/api";

const BASE_URL = import.meta.env.VITE_API_URL || "";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${BASE_URL}/${imagePath}`.replace(/([^:])\/\//g, "$1/");
};

const getUiStatus = (status) => {
  switch (status) {
    case "ACCEPTED":    return "Confirmed";
    case "IN_PROGRESS": return "In Progress";
    case "COMPLETED":   return "Completed";
    case "CANCELLED":   return "Cancelled";
    case "REJECTED":    return "Rejected";
    case "PENDING":
    default:            return "Pending";
  }
};

const statusConfig = {
  Completed:   { color: "#166534", bg: "#dcfce7" },
  Cancelled:   { color: "#991b1b", bg: "#fee2e2" },
  Rejected:    { color: "#991b1b", bg: "#fee2e2" },
  Confirmed:   { color: "#0086C3", bg: "rgba(0,134,195,0.1)" },
  "In Progress": { color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  Pending:     { color: "#b45309", bg: "#fef3c7" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span
      className="font-[family-name:var(--font-dm)] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      ● {status}
    </span>
  );
}

function AppointmentActions({ doc, joinCall, cancelAppointment, setSelectedAppointment, fetchPrescription }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {(doc.status === "ACCEPTED" || doc.status === "IN_PROGRESS") && (
        <button
          onClick={() => joinCall(doc)}
          className="font-[family-name:var(--font-dm)] font-bold text-[12px] px-3 py-1.5 rounded-lg text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#2ecc71,#1aab5a)", boxShadow: "0 3px 10px rgba(46,204,113,0.35)" }}
        >
          Join Call
        </button>
      )}
      {(doc.status === "PENDING" || doc.status === "ACCEPTED") && (
        <button
          onClick={() => cancelAppointment(doc.id)}
          className="font-[family-name:var(--font-dm)] font-semibold text-[12px] px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-1 hover:bg-[rgba(239,68,68,0.1)]"
          style={{ color: "#ef4444", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <XCircle size={13} /> Cancel
        </button>
      )}
      {doc.status === "COMPLETED" && (
        <button
          onClick={() => { setSelectedAppointment(doc); fetchPrescription(doc.id); }}
          className="font-[family-name:var(--font-dm)] font-bold text-[12px] px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          style={{ color: "#0086C3", background: "rgba(0,134,195,0.08)", border: "1px solid rgba(0,134,195,0.2)" }}
        >
          View Details
        </button>
      )}
    </div>
  );
}

export default function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevStack, setPrevStack] = useState([]);

  const fetchAppointments = async (cursorValue = null) => {
    setLoading(true);
    try {
      const res = await AppointmentService.getHistory(cursorValue);
      const mapped = res.data.map((appt) => ({
        ...appt,
        statusUi: getUiStatus(appt.status),
        profile_image: getImageUrl(appt.profile_image),
      }));
      setAppointments(mapped);
      setNextCursor(res.nextCursor);
    } catch {
      notify.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescription = async (appointmentId) => {
    try {
      const { data } = await api.get(`/patient/appointments/${appointmentId}/prescription`);
      setPrescription(data);
    } catch {
      setPrescription(null);
    }
  };

  useEffect(() => { fetchAppointments(null); }, []);

  const handleNext = () => {
    if (!nextCursor) return;
    setPrevStack((p) => [...p, cursor ?? null]);
    setCursor(nextCursor);
    fetchAppointments(nextCursor);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    if (prevStack.length === 0) return;
    const prev = prevStack[prevStack.length - 1];
    setPrevStack((p) => p.slice(0, -1));
    setCursor(prev);
    fetchAppointments(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const joinCall = (appt) => navigate(`/client/onlineconsultation?room=${appt.id}`);

  const cancelAppointment = async (id) => {
    try {
      await AppointmentService.cancel(id);
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: "CANCELLED", statusUi: "Cancelled" } : a));
      notify.success("Appointment cancelled");
    } catch { notify.error("Cancel failed"); }
  };

  const handleDownloadPrescription = () => {
    if (!prescription) { notify.error("Doctor has not provided a prescription"); return; }
    generatePrescriptionPDF({ ...selectedAppointment, ...prescription });
    notify.success("Prescription downloaded successfully");
  };

  const submitRating = async () => {
    try {
      await AppointmentService.rateDoctor({ appointmentId: selectedAppointment.id, rating, comment });
      notify.success("Feedback submitted");
      setSelectedAppointment(null); setRating(0); setComment("");
    } catch { notify.error("Feedback already submitted"); }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8" style={{ background: "#f0f4f8" }}>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7 animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[24px] font-extrabold text-[#0c1e3a]">
            My Appointments
          </h1>
        
        </div>
        {appointments.length > 0 && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-[family-name:var(--font-dm)] text-[13px] font-semibold self-start sm:self-auto"
            style={{ color: "#0086C3", background: "rgba(0,134,195,0.1)" }}
          >
            <Calendar size={15} />
            {appointments.length} Appointments
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-[#0086C3] border-t-transparent rounded-full animate-spin" />
            <p className="font-[family-name:var(--font-dm)] text-[13px]" style={{ color: "#94a3b8" }}>
              Loading appointments...
            </p>
          </div>
        </div>
      )}

      {!loading && appointments.length === 0 && (
        <div
          className="bg-white rounded-2xl py-16 flex flex-col items-center gap-3 animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ boxShadow: "0 2px 20px rgba(12,30,58,0.07)", border: "1px solid rgba(12,30,58,0.06)" }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1" style={{ background: "rgba(0,134,195,0.08)" }}>
            <Calendar size={32} color="#0086C3" />
          </div>
          <p className="font-[family-name:var(--font-playfair)] text-[17px] font-bold text-[#0c1e3a]">No appointments found</p>
          <p className="font-[family-name:var(--font-dm)] text-[13px]" style={{ color: "#94a3b8" }}>Your appointment history will appear here</p>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <>
          <div
            className="hidden lg:grid grid-cols-5 px-6 py-3 mb-2 rounded-xl"
            style={{ background: "rgba(12,30,58,0.04)" }}
          >
            {["Doctor & Specialization", "Date & Shift", "Token", "Status", "Actions"].map((h) => (
              <p key={h} className="font-[family-name:var(--font-dm)] text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
                {h}
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {appointments.map((doc, idx) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl overflow-hidden transition-all duration-250"
                style={{
                  boxShadow: "0 2px 12px rgba(12,30,58,0.07)",
                  border: "1px solid rgba(12,30,58,0.06)",
                  animation: `fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) ${idx * 0.05}s both`,
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(12,30,58,0.11)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(12,30,58,0.07)")}
              >
                <div className="hidden lg:grid grid-cols-5 items-center px-6 py-4 gap-4">

                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate(`/client/doctor-profile/${doc.doctorId}`)}
                  >
                    <img
                      src={doc.profile_image}
                      alt={doc.doctorName}
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                      style={{ border: "2px solid rgba(0,134,195,0.15)" }}
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
                    />
                    <div>
                      <p className="font-[family-name:var(--font-dm)] text-[14px] font-semibold text-[#0c1e3a] leading-tight">
                        {doc.doctorName}
                      </p>
                      <p className="font-[family-name:var(--font-dm)] text-[12px] font-semibold mt-0.5" style={{ color: "#0086C3" }}>
                        {doc.specialization}
                      </p>
                       <p className="text-[12px] text-gray-500">
                          Patient: {doc.patientName} {doc.isFamily ? "(Family)" : "(Self)"}
                        </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={15} color="#94a3b8" />
                    <div>
                      <p className="font-[family-name:var(--font-dm)] text-[13px] font-semibold text-[#0c1e3a]">{doc.date}</p>
                      <span
                        className="font-[family-name:var(--font-dm)] text-[11px] font-semibold px-2 py-0.5 rounded-md mt-1 inline-flex items-center gap-1"
                        style={{ color: "#0086C3", background: "rgba(0,134,195,0.1)" }}
                      >
                        {doc.shift === "Morning" ? <Sun size={11} /> : <CloudSun size={11} />}
                        {doc.shift?.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span
                      className="font-[family-name:var(--font-playfair)] text-[18px] font-extrabold px-4 py-1.5 rounded-xl"
                      style={{ color: "#0086C3", background: "rgba(0,134,195,0.08)" }}
                    >
                      #{doc.token}
                    </span>
                  </div>

                  <div><StatusBadge status={doc.statusUi} /></div>

                  <AppointmentActions
                    doc={doc}
                    joinCall={joinCall}
                    cancelAppointment={cancelAppointment}
                    setSelectedAppointment={setSelectedAppointment}
                    fetchPrescription={fetchPrescription}
                  />
                </div>

                <div className="lg:hidden px-4 py-4">
                  <div
                    className="flex items-center gap-3 mb-3 cursor-pointer"
                    onClick={() => navigate(`/client/doctor-profile/${doc.doctorId}`)}
                  >
                    <img
                      src={doc.profile_image}
                      alt={doc.doctorName}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      style={{ border: "2px solid rgba(0,134,195,0.15)" }}
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-[family-name:var(--font-dm)] text-[15px] font-semibold text-[#0c1e3a] truncate">{doc.doctorName}</p>
                      <p className="font-[family-name:var(--font-dm)] text-[12px] font-semibold" style={{ color: "#0086C3" }}>{doc.specialization}</p>
                    </div>
                    <StatusBadge status={doc.statusUi} />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3 p-3 rounded-xl" style={{ background: "#f8fafc" }}>
                    <div>
                      <p className="font-[family-name:var(--font-dm)] text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>Date</p>
                      <p className="font-[family-name:var(--font-dm)] text-[12px] font-semibold text-[#0c1e3a]">{doc.date}</p>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-dm)] text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>Shift</p>
                      <span
                        className="font-[family-name:var(--font-dm)] text-[11px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                        style={{ color: "#0086C3", background: "rgba(0,134,195,0.1)" }}
                      >
                        {doc.shift === "Morning" ? <Sun size={11} /> : <CloudSun size={11} />}
                        {doc.shift?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-[family-name:var(--font-dm)] text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>Token</p>
                      <span className="font-[family-name:var(--font-playfair)] text-[15px] font-extrabold" style={{ color: "#0086C3" }}>#{doc.token}</span>
                    </div>
                  </div>

                  <div className="pt-2" style={{ borderTop: "1px solid rgba(12,30,58,0.06)" }}>
                    <AppointmentActions
                      doc={doc}
                      joinCall={joinCall}
                      cancelAppointment={cancelAppointment}
                      setSelectedAppointment={setSelectedAppointment}
                      fetchPrescription={fetchPrescription}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={prevStack.length === 0}
              onClick={handlePrevious}
              className="font-[family-name:var(--font-dm)] font-semibold text-[13px] px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: "#4b5e7a", background: "#fff", border: "1px solid rgba(12,30,58,0.12)", boxShadow: "0 2px 8px rgba(12,30,58,0.06)" }}
            >
              ← Previous
            </button>
            <button
              disabled={!nextCursor}
              onClick={handleNext}
              className="font-[family-name:var(--font-dm)] font-semibold text-[13px] px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: "#4b5e7a", background: "#fff", border: "1px solid rgba(12,30,58,0.12)", boxShadow: "0 2px 8px rgba(12,30,58,0.06)" }}
            >
              Next →
            </button>
          </div>
        </>
      )}

      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSelectedAppointment(null); setPrescription(null); setComment(""); setRating(0); }} />
          <div
            className="relative bg-white rounded-2xl w-full max-w-lg z-10 overflow-hidden animate-[scaleIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)_both]"
            style={{ boxShadow: "0 24px 80px rgba(12,30,58,0.2)", border: "1px solid rgba(12,30,58,0.08)" }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg,#0086C3,#00b4d8)", borderBottom: "1px solid rgba(12,30,58,0.06)" }}
            >
              <h3 className="font-[family-name:var(--font-playfair)] text-[18px] font-bold text-white">
                Appointment Details
              </h3>
              <button
                onClick={() => { setSelectedAppointment(null); setPrescription(null); setComment(""); setRating(0); }}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-white/20"
              >
                <X size={16} color="white" />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl" style={{ background: "#f8fafc" }}>
                {[
                  { label: "Doctor", value: selectedAppointment.doctorName },
                  { label: "Date", value: selectedAppointment.date },
                  { label: "Token", value: `#${selectedAppointment.token}` },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="font-[family-name:var(--font-dm)] text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>{item.label}</p>
                    <p className="font-[family-name:var(--font-dm)] text-[13px] font-semibold text-[#0c1e3a]">{item.value}</p>
                  </div>
                ))}
              </div>

              {prescription && (
                <div className="p-4 rounded-xl" style={{ background: "rgba(0,134,195,0.05)", border: "1px solid rgba(0,134,195,0.15)" }}>
                  <p className="font-[family-name:var(--font-dm)] text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: "#0086C3" }}>Medicines</p>
                  <p className="font-[family-name:var(--font-dm)] text-[13px] text-[#0c1e3a] whitespace-pre-line mb-3">{prescription.medicines}</p>
                  <p className="font-[family-name:var(--font-dm)] text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: "#0086C3" }}>Instructions</p>
                  <p className="font-[family-name:var(--font-dm)] text-[13px] text-[#0c1e3a] whitespace-pre-line">{prescription.instructions}</p>
                </div>
              )}

              <div>
                <p className="font-[family-name:var(--font-dm)] text-[12px] font-bold uppercase tracking-wider mb-2" style={{ color: "#94a3b8" }}>Rate Doctor</p>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-[28px] cursor-pointer transition-transform hover:scale-110"
                      style={{ color: rating >= star ? "#f59e0b" : "#e2e8f0" }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your feedback..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl font-[family-name:var(--font-dm)] text-[13px] text-[#0c1e3a] outline-none resize-none transition-all duration-200"
                  style={{ border: "1px solid rgba(12,30,58,0.12)", background: "#f8fafc" }}
                  onFocus={e => (e.target.style.border = "2px solid #0086C3")}
                  onBlur={e => (e.target.style.border = "1px solid rgba(12,30,58,0.12)")}
                />
              </div>

              <div className="flex gap-3">
                <button
                  disabled={!rating}
                  onClick={submitRating}
                  className="flex-1 font-[family-name:var(--font-dm)] font-bold text-[13px] py-2.5 rounded-xl text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#0086C3,#00b4d8)", boxShadow: "0 4px 12px rgba(0,134,195,0.35)" }}
                >
                  <Star size={20} /> Submit Rating
                </button>
                <button
                  onClick={handleDownloadPrescription}
                   className="flex-1 font-[family-name:var(--font-dm)] font-bold text-[13px] py-2.5 rounded-xl text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg,#2ecc71,#1aab5a)", boxShadow: "0 4px 12px rgba(46,204,113,0.35)" }}
                >
                  <Download size={20} className="ml-2" /> Download Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}