import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";

const PatientQueuePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 Appointment ID from booking page
  const {
    appointmentId,
    token: initialToken,
    bookingFor,
    patientName,
  } = location.state || {};
  const [token, setToken] = useState(initialToken || null);
  /* ================= STATE ================= */
  const [loading, setLoading] = useState(true);
  const [nowServing, setNowServing] = useState(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState("");
  const [error, setError] = useState("");

  /* ================= LOAD QUEUE STATUS ================= */
  useEffect(() => {
    if (!appointmentId) {
      navigate("/client/dashboard");
      return;
    }

    const fetchQueueStatus = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/patient/token-status/${appointmentId}`);

        setToken(res.data.yourToken);
        setNowServing(res.data.nowServing);
        setEstimatedWaitTime(`${res.data.estimatedWaitMinutes} mins`);
      } catch (err) {
        toast.error("Failed to load queue status");
        setError("Queue information not available");
      } finally {
        setLoading(false);
      }
    };

    fetchQueueStatus();

    // 🔄 Auto refresh every 30 sec (optional but recommended)
    const interval = setInterval(fetchQueueStatus, 30000);
    return () => clearInterval(interval);
  }, [appointmentId, navigate]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-gray-600 text-lg">Loading queue status...</p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-100 to-blue-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-80 text-center space-y-4">
        <h2 className="text-xl font-semibold">Your Appointment Queue</h2>

        <div className="flex justify-center text-3xl text-blue-500">
          <FaClock />
        </div>
        <p className="text-gray-500 text-sm">
          Appointment for <span className="font-semibold">{patientName}</span>
        </p>

        <p className="text-gray-600">
          Now Serving:{" "}
          <span className="font-semibold">{nowServing ?? "-"}</span>
        </p>

        <p className="text-3xl font-bold text-black">Token #{token}</p>

        <p className="text-gray-500">
          Estimated Wait Time: {estimatedWaitTime}
        </p>

        <button
          onClick={() => navigate("/client/dashboard")}
          className="mt-4 w-full py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PatientQueuePage;
