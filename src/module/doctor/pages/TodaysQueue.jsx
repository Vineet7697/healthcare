import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  getTodayQueue,
  // startAppointment,
  callNextToken,
  markPatientAbsent,
} from "../../../services/doctorService";

const TodaysQueue = () => {
  const [slot, setSlot] = useState("MORNING");
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [callingNext, setCallingNext] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);

  // { patientId: number }
  /* ================= LOAD QUEUE ================= */
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
      toast.error("Unable to load queue");
    } finally {
      setLoading(false);
    }
  };

  // /* ================= START APPOINTMENT ================= */
  // const handleStart = async (id) => {
  //   try {
  //     await startAppointment(id);
  //     toast.success("Appointment started");
  //     loadQueue();
  //   } catch {
  //     toast.error("Unable to start appointment");
  //   }
  // };

  /* ================= CALL NEXT TOKEN ================= */
  const handleCallNext = async () => {
    if (callingNext) return;

    try {
      setCallingNext(true);
      const res = await callNextToken(slot);
      toast.success(res.data.message || "Next token called");
      loadQueue();
    } catch (err) {
      const msg = err?.response?.data?.message;
      if (msg) toast.info(msg);
      else toast.error("Unable to call next token");
    } finally {
      setCallingNext(false);
    }
  };

  /* ================= STATS ================= */
  const total = queue.length;
  const waiting = queue.filter((p) => p.status === "ACCEPTED").length;
  const done = queue.filter((p) => p.status === "COMPLETED").length;

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-xs tracking-widest text-sky-600 font-semibold uppercase">
              Clinic Management
            </p>
            <h1 className="text-3xl font-semibold mt-2 text-gray-900">
              Today’s Queue
            </h1>
          </div>
        </div>

        {/* Session Toggle */}
        <div className="bg-white p-2 rounded-2xl shadow-sm  flex w-full md:w-96 mb-10">
          <button
            onClick={() => setSlot("MORNING")}
            className={`flex-1 py-2.5 rounded-xl font-medium ${
              slot === "MORNING" ? "bg-sky-600 text-white" : "text-gray-500"
            }`}
          >
            Morning
          </button>

          <button
            onClick={() => setSlot("EVENING")}
            className={`flex-1 py-2.5 rounded-xl font-medium ${
              slot === "EVENING" ? "bg-sky-600 text-white" : "text-gray-500"
            }`}
          >
            Evening
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-sky-200">
            <p className="text-xs text-sky-600 font-medium uppercase">Total</p>
            <h2 className="text-3xl font-bold mt-2">{total}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-200">
            <p className="text-xs text-amber-500 font-medium uppercase">
              Waiting
            </p>
            <h2 className="text-3xl font-bold mt-2">{waiting}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-200">
            <p className="text-xs text-emerald-600 font-medium uppercase">
              Done
            </p>
            <h2 className="text-3xl font-bold mt-2">{done}</h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => {
              const next = queue.find((p) => p.status === "ACCEPTED");
              if (next) {
                setConfirmModal({ patientId: next.id });
              } else {
                toast.info("No waiting patient");
              }
            }}
            className="bg-sky-700 hover:bg-sky-800 text-white rounded-2xl py-8 text-lg font-semibold shadow-md transition"
          >
            ▶ Start Appointment
          </button>

          <button
            onClick={() => {
              const next = queue.find((p) => p.status === "ACCEPTED");

              if (!next) {
                toast.info("No waiting patient");
                return;
              }

              setConfirmModal({ patientId: next.id });
            }}
            disabled={callingNext}
            className="bg-white border hover:bg-gray-50 rounded-2xl py-8 text-lg font-semibold shadow-sm transition"
          >
            📢 {callingNext ? "Calling..." : "Call Next Token"}
          </button>
        </div>

        {/* Patient List Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Patient List</h2>
            <span className="bg-sky-100 text-sky-600 text-xs px-3 py-1 rounded-full">
              LIVE
            </span>
          </div>
          <div className="text-sky-600 text-lg cursor-pointer">≡</div>
        </div>

        {/* Patient Cards */}
        {loading ? (
          <p className="text-gray-500">Loading queue...</p>
        ) : queue.length === 0 ? (
          <p className="text-gray-400">No patients in queue</p>
        ) : (
          <div className="space-y-6">
            {queue.map((p) => (
              <div
                key={p.id}
                className={`bg-white p-6 rounded-2xl border flex justify-between items-center ${
                  p.status === "COMPLETED" ? "opacity-70" : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`px-6 py-4 rounded-xl text-center ${
                      p.status === "IN_PROGRESS"
                        ? "bg-sky-700 text-white"
                        : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    <p className="text-xs">TOKEN</p>
                    <p className="text-xl font-bold">{p.token_number}</p>
                  </div>

                  <div>
                    <p
                      className={`font-semibold text-gray-900 ${
                        p.status === "COMPLETED" ? "line-through" : ""
                      }`}
                    >
                      {p.patientEmail || p.familyMemberName || "Walk-in"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {p.reason || "Consultation"}
                    </p>
                  </div>
                </div>

                {/* Status */}
                {p.status === "ACCEPTED" && (
                  <span className="bg-amber-100 text-amber-600 px-4 py-1.5 rounded-lg text-sm">
                    WAITING
                  </span>
                )}

                {p.status === "IN_PROGRESS" && (
                  <span className="bg-sky-700 text-white px-4 py-1.5 rounded-lg text-sm">
                    IN-PROGRESS
                  </span>
                )}

                {p.status === "COMPLETED" && (
                  <span className="bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-lg text-sm">
                    COMPLETED
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmModal && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Is{" "}
              {queue.find((p) => p.id === confirmModal?.patientId)
                ?.patientEmail || "this patient"}{" "}
              present?
            </h2>

            <div className="flex justify-end gap-4">
              {/* ABSENT */}
              <button
                onClick={async () => {
                  try {
                    const patientId = confirmModal.patientId;

                    if (!patientId) {
                      toast.info("No patient selected");
                      return;
                    }

                    await markPatientAbsent(patientId);
                    await callNextToken(slot);

                    toast.info("Patient marked absent. Calling next...");
                    setConfirmModal(null);
                    loadQueue();
                  } catch {
                    toast.error("Something went wrong");
                  }
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Absent
              </button>

              {/* PRESENT */}
              <button
                onClick={async () => {
                  try {
                    const patientId = confirmModal.patientId;

                    if (!patientId) {
                      toast.info("No patient selected");
                      return;
                    }

                    await callNextToken(slot);

                    toast.success("Appointment started");
                    setConfirmModal(null);
                    loadQueue();
                  } catch {
                    toast.error("Something went wrong");
                  }
                }}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg"
              >
                Present
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysQueue;
