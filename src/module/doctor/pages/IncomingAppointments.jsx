import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";
import {
  startAppointment,
  respondAppointment,
} from "../../../services/doctorService";

const BASE_URL = api.defaults.baseURL;

const getImageUrl = (path) => {
  if (!path) return "/images/default-avatar.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const getInitial = (name) => {
  if (!name) return "WP";

  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 0) return "WP";
  if (words.length === 1) return words[0][0].toUpperCase();

  return words[0][0].toUpperCase() + words[1][0].toUpperCase();
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState("ALL");

  /* ================= LOAD DATA ================= */
  const loadAppointments = async () => {
    try {
      const res = await api.get("/doctor/appointments/incoming");
      setAppointments(res.data.appointments || []);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  /* ================= HELPERS ================= */
  const isToday = (date) => {
    const d = new Date(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const filteredAppointments = useMemo(() => {
    if (filter === "TODAY") {
      return appointments.filter((a) => isToday(a.appointment_date));
    }
    if (filter === "MORNING") {
      return appointments.filter((a) => a.appointment_slot === "MORNING");
    }
    return appointments;
  }, [appointments, filter]);

  /* ================= ACCEPT / REJECT ================= */
  const handleRespond = async (id, action) => {
    try {
      setProcessingId(id);
      await respondAppointment(id, action);
      toast.success(`Appointment ${action.toLowerCase()}ed`);
      await loadAppointments();
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (!msg?.includes("already processed")) {
        toast.error("Action failed");
      }
      loadAppointments();
    } finally {
      setProcessingId(null);
    }
  };

  /* ================= START ================= */
  const handleStart = async (id) => {
    try {
      await startAppointment(id);
      toast.success("Appointment started");
      loadAppointments();
    } catch {
      toast.error("Unable to start appointment");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-sky-50 text-gray-800">
      <div className="max-w-5xl mx-auto min-h-screen flex flex-col">
        {/* FILTER PILLS */}
        {/* FILTER PILLS */}
        <div className="flex justify-between items-center px-8 py-6 flex-wrap">
          {/* LEFT SIDE - FILTER BUTTONS */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-6 py-2 rounded-full font-medium shadow ${
                filter === "ALL"
                  ? "bg-sky-600 text-white"
                  : "bg-white border border-sky-200 text-sky-600"
              }`}
            >
              All
              <span className="ml-2 bg-sky-100 px-2 py-0.5 rounded-full text-sm">
                {appointments.length}
              </span>
            </button>

            <button
              onClick={() => setFilter("TODAY")}
              className={`px-6 py-2 rounded-full font-medium ${
                filter === "TODAY"
                  ? "bg-sky-600 text-white"
                  : "bg-white border border-sky-200 text-sky-600"
              }`}
            >
              Today
            </button>

            <button
              onClick={() => setFilter("MORNING")}
              className={`px-6 py-2 rounded-full font-medium ${
                filter === "MORNING"
                  ? "bg-sky-600 text-white"
                  : "bg-white border border-sky-200 text-sky-600"
              }`}
            >
              Morning
            </button>
          </div>

          {/* RIGHT SIDE - AUTO ACCEPT */}
          <button className="px-4 py-2 bg-sky-600 text-white rounded-lg shadow hover:bg-sky-700 transition">
            Auto Accept
          </button>
        </div>

        {/* LIST AREA */}
        <div className="flex-1 px-8  pb-20 space-y-6 overflow-auto">
          <div className="grid grid-cols-5  font-semibold text-bold px-6 pb-2 ">
            <div>Patient Name</div>
            <div className="pl-6">Shift</div>
            <div className="pl-4">Token</div>
            <div className="pl-6">Date</div>
            <div className="pl-8">Status</div>
          </div>
          {filteredAppointments.length === 0 && (
            <p className="text-gray-500">No appointments found</p>
          )}

          {filteredAppointments.map((a) => {
            const displayName =
              a.familyMemberName || a.patient_name || "Walk-in Patient";

            return (
              <div
                key={a.id}
                className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 hover:shadow-lg transition"
              >
                <div className="grid grid-cols-5 items-center gap-6">
                  {/* 1️⃣ Patient Name + Avatar */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 mb-2">
                      {a.familyMemberName ? (
                        <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                          {getInitial(displayName)}
                        </div>
                      ) : a.patientImage ? (
                        <img
                          src={getImageUrl(a.patientImage)}
                          alt="Patient"
                          className="w-12 h-12 rounded-full object-cover border border-sky-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                          {getInitial(displayName)}
                        </div>
                      )}
                    </div>

                    <h2 className="font-semibold truncate">{displayName}</h2>
                  </div>

                  {/* 2️⃣ Shift */}
                  <div className="text-gray-600 font-medium">
                    {a.appointment_slot}
                  </div>

                  {/* 3️⃣ Token */}
                  <div>
                    <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
                      #{a.token_number}
                    </span>
                  </div>

                  {/* 4️⃣ Date */}
                  <div className="text-gray-500 text-sm">
                    {new Date(a.appointment_date).toLocaleDateString()}
                  </div>

                  {/* 5️⃣ Status */}
                  <div>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${
                        a.status === "PENDING"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                </div>
                {/* ACTIONS */}
                <div className="flex gap-4 mt-6">
                  {a.status === "PENDING" && (
                    <>
                      <button
                        disabled={processingId === a.id}
                        onClick={() => handleRespond(a.id, "ACCEPT")}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold"
                      >
                        Accept
                      </button>

                      <button
                        disabled={processingId === a.id}
                        onClick={() => handleRespond(a.id, "REJECT")}
                        className="flex-1 border border-red-400 text-red-500 hover:bg-red-50 py-3 rounded-xl font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {a.status === "ACCEPTED" && isToday(a.appointment_date) && (
                    <button
                      onClick={() => handleStart(a.id)}
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold"
                    >
                      Start
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
