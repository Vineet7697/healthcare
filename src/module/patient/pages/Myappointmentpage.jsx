import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePrescriptionPDF } from "../../../utils/generatePrescriptionPDF";
import { toast } from "react-toastify";
import { FaUserMd, FaEye } from "react-icons/fa";
import AppointmentService from "../../../services/AppointmentService";
import api from "../../../services/api";

/* ================= STATUS MAPPER (BACKEND → UI) ================= */
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

const Myappointmentpage = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH APPOINTMENTS ================= */
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await AppointmentService.getHistory();

        // backend status ko touch nahi kar rahe
        const mapped = data.map((appt) => ({
          ...appt,
          uiStatus: getUiStatus(appt.status),
        }));

        setAppointments(mapped);
      } catch (err) {
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
          a.id === id ? { ...a, status: "CANCELLED", uiStatus: "Cancelled" } : a
        )
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
      await AppointmentService.rateDoctor(
        selectedAppointment.doctorId,
        rating
      );

      toast.success("Rating submitted");
      setSelectedAppointment(null);
      setRating(0);
    } catch {
      toast.error("Rating failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] py-10 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          My Appointments
        </h2>

        {loading && (
          <p className="text-center text-blue-600 font-semibold mb-4">
            Loading appointments...
          </p>
        )}

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full rounded-2xl">
            <thead className="bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white">
              <tr>
                <th className="p-3 text-left">Doctor</th>
                <th className="text-left">Date</th>
                <th className="text-left">Token</th>
                <th className="text-left">Status</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-b">
                  <td
                    className="p-3 text-blue-600 cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/client/doctor/${appt.doctorId}`)
                    }
                  >
                    <FaUserMd className="inline mr-2" />
                    {appt.doctorName}
                  </td>

                  <td>{appt.date}</td>
                  <td>{appt.time}</td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm text-white
                        ${
                          appt.uiStatus === "Completed"
                            ? "bg-green-500"
                            : appt.uiStatus === "Cancelled" ||
                              appt.uiStatus === "Rejected"
                            ? "bg-red-500"
                            : appt.uiStatus === "Confirmed"
                            ? "bg-blue-600"
                            : appt.uiStatus === "In Progress"
                            ? "bg-purple-600"
                            : "bg-yellow-500"
                        }`}
                    >
                      {appt.uiStatus}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="text-center space-x-2">
                    {(appt.status === "ACCEPTED" ||
                      appt.status === "IN_PROGRESS") && (
                      <button
                        onClick={() => joinCall(appt)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        Join
                      </button>
                    )}

                    {(appt.status === "PENDING" ||
                      appt.status === "ACCEPTED") && (
                      <button
                        onClick={() => cancelAppointment(appt.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Cancel
                      </button>
                    )}

                    {appt.status === "COMPLETED" && (
                      <button
                        onClick={() => setSelectedAppointment(appt)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                      >
                        <FaEye className="inline" /> View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= DETAILS MODAL ================= */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-white/30"
            onClick={() => setSelectedAppointment(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 z-10">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              Appointment Details
            </h3>

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Doctor:</strong>{" "}
                {selectedAppointment.doctorName}
              </p>
              <p>
                <strong>Date:</strong> {selectedAppointment.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedAppointment.time}
              </p>
              <p>
                <strong>Hospital:</strong>{" "}
                {selectedAppointment.hospital}
              </p>
            </div>

            <hr className="my-4" />

            {/* Rating */}
            <h4 className="font-semibold mb-2">Rate Doctor</h4>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    rating >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <button
              disabled={!rating}
              onClick={submitRating}
              className={`w-full py-2 rounded-lg text-white mb-3
                ${
                  rating
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Submit Rating
            </button>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  generatePrescriptionPDF(selectedAppointment)
                }
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                📄 Download Prescription
              </button>

              <button
                onClick={addToTimeline}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                🕒 Add to Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Myappointmentpage;
