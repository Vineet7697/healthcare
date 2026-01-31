import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";

import {
  startAppointment,
  respondAppointment,
} from "../../../services/doctorService";

const IncomingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
const [processingId, setProcessingId] = useState(null);
  /* ================= LOAD INCOMING APPOINTMENTS ================= */
  const loadAppointments = async () => {
    try {
      const res = await api.get("/doctor/appointments/incoming");
      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  /* ================= ACCEPT / REJECT ================= */
const handleRespond = async (id, action) => {
  try {
    setProcessingId(id); // 🔒 lock this appointment
    await respondAppointment(id, action);
    toast.success(`Appointment ${action.toLowerCase()}ed`);
    await loadAppointments(); // 🔄 fresh data
  } catch (err) {
    const msg = err?.response?.data?.message;
    if (msg?.includes("already processed")) {
      // expected case → silently refresh
      loadAppointments();
    } else {
      toast.error("Action failed");
    }
  } finally {
    setProcessingId(null); // 🔓 unlock
  }
};

  /* ================= START APPOINTMENT ================= */
  const handleStart = async (id) => {
    try {
      await startAppointment(id);
      toast.success("Appointment started");
      loadAppointments();
    } catch (err) {
      console.error(err);
      toast.error("Unable to start appointment");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Incoming Appointments</h2>

      {appointments.length === 0 && (
        <p className="text-gray-500">No incoming appointments</p>
      )}

      {appointments.map((a) => (
        <div
          key={a.id}
          className="bg-white p-4 rounded-lg shadow mb-3 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{a.patient_name}</p>
            <p className="text-sm text-gray-500">Token #{a.token_number}</p>
            <p className="text-sm text-gray-500">
              {new Date(a.appointment_date).toLocaleDateString()} •{" "}
              {a.appointment_slot}
            </p>
            <p className="text-sm font-medium">
              Status:{" "}
              <span
                className={
                  a.status === "ACCEPTED" ? "text-green-600" : "text-yellow-600"
                }
              >
                {a.status}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            {a.status === "PENDING" && (
              <>
                <button
                disabled={processingId === a.id}
                  onClick={() => handleRespond(a.id, "ACCEPT")}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Accept
                </button>

                <button
                disabled={processingId === a.id}
                  onClick={() => handleRespond(a.id, "REJECT")}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Reject
                </button>
              </>
            )}

            {a.status === "ACCEPTED" && isToday(a.appointment_date) && (
              <button
                onClick={() => handleStart(a.id)}
                className="px-3 py-1 bg-bg-[#2277f7] text-white rounded"
              >
                Start
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncomingAppointments;
