import React, { useEffect, useState } from "react";
import { FaPlay, FaPhoneAlt, FaUserClock, FaSun, FaMoon } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getTodayQueue,
  startAppointment,
  callNextToken,
} from "../../../services/doctorService";

const LiveQueuePage = () => {
  const [slot, setSlot] = useState("MORNING");
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [callingNext, setCallingNext] = useState(false);

  useEffect(() => {
    loadQueue();
  }, [slot]);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const res = await getTodayQueue(slot);
      setQueue(res.data.queue || []);
    } catch (err) {
      console.error("Failed to load queue", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= START APPOINTMENT ================= */
  const handleStart = async (id) => {
    try {
      await startAppointment(id);
      loadQueue();
    } catch {
      alert("Unable to start appointment");
    }
  };

  /* ================= CALL NEXT TOKEN ================= */
  const handleCallNext = async () => {
    if (callingNext) return;
    
    try {
      setCallingNext(true);

      const res = await callNextToken(slot);
      console.log("API response:", res.data);
      toast.success(res.data.message || "Next token called");

      await loadQueue();
    } catch (err) {
      const msg = err?.response?.data?.message;

      if (msg) {
        toast.info(msg); // e.g. "No more tokens"
      } else {
        toast.error("Unable to call next token");
      }
    } finally {
      setCallingNext(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FaUserClock /> Live Queue
        </h2>
        <button
          onClick={handleCallNext}
          disabled={callingNext}
          className="bg-[#2277f7] text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
        <FaPhoneAlt />  {callingNext ? "Calling..." : "Call Next Token"}
        </button>
      </div>

      {/* ================= SLOT SWITCH ================= */}
      <div className="flex gap-4 mb-6">
        <SlotBtn
          active={slot === "MORNING"}
          label="Morning"
          icon={<FaSun />}
          onClick={() => setSlot("MORNING")}
        />

        <SlotBtn
          active={slot === "EVENING"}
          label="Evening"
          icon={<FaMoon />}
          onClick={() => setSlot("EVENING")}
        />
      </div>

      {/* ================= QUEUE LIST ================= */}
      {loading ? (
        <p className="text-gray-500">Loading queue...</p>
      ) : queue.length === 0 ? (
        <p className="text-gray-400">No patients in queue</p>
      ) : (
        <div className="space-y-3">
          {queue.map((p) => (
            <div
              key={p.id}
              className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Token #{p.token_number}</p>
                <p className="text-sm text-gray-500">
                  {p.patientEmail || p.familyMemberName || "Walk-in"}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    p.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {p.status === "ACCEPTED" && (
                <button
                  onClick={() => handleStart(p.id)}
                  className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-2"
                >
                  <FaPlay />
                  Start
                </button>
              )}

              {p.status === "IN_PROGRESS" && (
                <span className="text-blue-600 font-semibold">Consulting</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= SMALL COMPONENT ================= */

const SlotBtn = ({ active, label, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
      active ? "bg-[#2277f7] text-white" : "bg-white text-gray-600"
    }`}
  >
    {icon}
    {label}
  </button>
);

export default LiveQueuePage;
