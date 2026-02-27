import React, { useEffect, useState } from "react";
import { Calendar, Sun, CloudSun, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppointmentService from "../../../services/AppointmentService";
import { generatePrescriptionPDF } from "../../../utils/generatePrescriptionPDF";
import api from "../../../services/api";

/* ================= STATUS MAPPER ================= */
const getUiStatus = (status) => {
  switch (status) {
    case "ACCEPTED":
      return "Confirmed";
    case "IN_PROGRESS":
      return "In Progress";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "REJECTED":
      return "Rejected";
    case "PENDING":
    default:
      return "Pending";
  }
};

export default function MyAppointments() {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:4000";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await AppointmentService.getHistory();

        const mapped = data.map((appt) => ({
          ...appt,
          statusUi: getUiStatus(appt.status),
          profile_image: appt.profile_image
            ? `${BASE_URL}${appt.profile_image}`
            : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        }));

        setAppointments(mapped);
      } catch {
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /* ================= ACTIONS ================= */

  const joinCall = (appt) => {
    navigate(`/client/onlineconsultation?room=${appt.id}`);
  };

  const cancelAppointment = async (id) => {
    try {
      await AppointmentService.cancel(id);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "CANCELLED", statusUi: "Cancelled" }
            : a,
        ),
      );

      toast.success("Appointment cancelled");
    } catch {
      toast.error("Cancel failed");
    }
  };

  const addToTimeline = async () => {
    try {
      await api.post("/healthTimeline", {
        id: Date.now(),
        type: "Appointment",
        title: selectedAppointment.doctorName,
        date: selectedAppointment.date,
        description: `Appointment with ${selectedAppointment.doctorName}`,
      });

      toast.success("Added to Health Timeline");
    } catch {
      toast.error("Timeline update failed");
    }
  };

  const submitRating = async () => {
    try {
      await AppointmentService.rateDoctor(selectedAppointment.doctorId, rating);

      toast.success("Rating submitted");
      setSelectedAppointment(null);
      setRating(0);
    } catch {
      toast.error("Rating failed");
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            My Appointments
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Manage and track your upcoming health consultations.
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-blue-600 font-semibold mb-4">
          Loading appointments...
        </p>
      )}

      {/* DESKTOP HEADER */}
      <div className="hidden lg:grid grid-cols-5 text-sm font-semibold text-slate-400 px-6 mb-3">
        <p>DOCTOR & SPECIALIZATION</p>
        <p>DATE & SHIFT</p>
        <p>TOKEN</p>
        <p>STATUS</p>
        <p>ACTIONS</p>
      </div>

      {/* APPOINTMENTS */}
      <div className="space-y-4">
        {appointments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200"
          >
            {/* DESKTOP */}
            <div className="hidden lg:grid grid-cols-5 items-center px-6 py-5">
              {/* Doctor */}
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/client/doctor/${doc.doctorId}`)}
              >
                <img
                  src={doc.profile_image}
                  alt={doc.doctorName}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-slate-800">
                    {doc.doctorName}
                  </p>
                  <p className="text-sm text-blue-500">{doc.specialization}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar size={18} />
                <div>
                  <p>{doc.date}</p>
                  <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md mt-1 w-fit">
                    {doc.shift === "Morning" ? (
                      <Sun size={14} />
                    ) : (
                      <CloudSun size={14} />
                    )}
                    {doc.shift?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Token */}
              <div>
                <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-semibold">
                  {doc.token}
                </span>
              </div>

              {/* Status */}
              <div>
                <StatusBadge status={doc.statusUi} />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <AppointmentActions
                  doc={doc}
                  joinCall={joinCall}
                  cancelAppointment={cancelAppointment}
                  setSelectedAppointment={setSelectedAppointment}
                />
              </div>
            </div>

            {/* MOBILE + TABLET */}
            <div className="lg:hidden px-4 py-5 space-y-4">
              {/* Doctor */}
              <div
                className="flex items-center gap-4"
                onClick={() => navigate(`/client/doctor/${doc.doctorId}`)}
              >
                <img
                  src={doc.profile_image}
                  alt={doc.doctorName}
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold text-slate-800 text-base">
                    {doc.doctorName}
                  </p>
                  <p className="text-sm text-blue-500">{doc.specialization}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm text-slate-600">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Date</p>
                  <p>{doc.date}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Shift</p>
                  <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md w-fit">
                    {doc.shift === "Morning" ? (
                      <Sun size={14} />
                    ) : (
                      <CloudSun size={14} />
                    )}
                    {doc.shift?.toUpperCase()}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Token</p>
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-semibold">
                    {doc.token}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  <StatusBadge status={doc.statusUi} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-100">
                <AppointmentActions
                  doc={doc}
                  joinCall={joinCall}
                  cancelAppointment={cancelAppointment}
                  setSelectedAppointment={setSelectedAppointment}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl relative">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>

            <p>
              <strong>Doctor:</strong> {selectedAppointment.doctorName}
            </p>
            <p>
              <strong>Date:</strong> {selectedAppointment.date}
            </p>
            <p>
              <strong>Token:</strong> {selectedAppointment.token}
            </p>

            <hr className="my-4" />

            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <button
              disabled={!rating}
              onClick={submitRating}
              className="w-full bg-blue-600 text-white py-2 rounded mb-3"
            >
              Submit Rating
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => generatePrescriptionPDF(selectedAppointment)}
                className="flex-1 bg-green-600 text-white py-2 rounded"
              >
                Download Prescription
              </button>

              <button
                onClick={addToTimeline}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Add to Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold
      ${
        status === "Completed"
          ? "bg-green-100 text-green-700"
          : status === "Cancelled" || status === "Rejected"
            ? "bg-red-100 text-red-600"
            : status === "Confirmed"
              ? "bg-blue-100 text-blue-700"
              : status === "In Progress"
                ? "bg-purple-100 text-purple-700"
                : "bg-orange-100 text-orange-600"
      }`}
    >
      ● {status.toUpperCase()}
    </span>
  );
}

function AppointmentActions({
  doc,
  joinCall,
  cancelAppointment,
  setSelectedAppointment,
}) {
  return (
    <>
      {(doc.status === "ACCEPTED" || doc.status === "IN_PROGRESS") && (
        <button
          onClick={() => joinCall(doc)}
          className="text-green-600 font-medium"
        >
          Join
        </button>
      )}

      {(doc.status === "PENDING" || doc.status === "ACCEPTED") && (
        <button
          onClick={() => cancelAppointment(doc.id)}
          className="flex items-center gap-1 text-slate-400 hover:text-red-500 font-medium"
        >
          <XCircle size={16} />
          Cancel
        </button>
      )}

      {doc.status === "COMPLETED" && (
        <button
          onClick={() => setSelectedAppointment(doc)}
          className="text-blue-600 font-medium bg-green-500/10 px-3 py-1 rounded"
        >
          View
        </button>
      )}
    </>
  );
}
