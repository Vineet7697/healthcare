// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import api from "../../../services/api";

// import {
//   startAppointment,
//   respondAppointment,
// } from "../../../services/doctorService";

// const IncomingAppointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
// const [processingId, setProcessingId] = useState(null);
//   /* ================= LOAD INCOMING APPOINTMENTS ================= */
//   const loadAppointments = async () => {
//     try {
//       const res = await api.get("/doctor/appointments/incoming");
//       setAppointments(res.data.appointments || []);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load appointments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAppointments();
//   }, []);

//   const isToday = (date) => {
//     const d = new Date(date);
//     const today = new Date();
//     return (
//       d.getDate() === today.getDate() &&
//       d.getMonth() === today.getMonth() &&
//       d.getFullYear() === today.getFullYear()
//     );
//   };

//   /* ================= ACCEPT / REJECT ================= */
// const handleRespond = async (id, action) => {
//   try {
//     setProcessingId(id); // 🔒 lock this appointment
//     await respondAppointment(id, action);
//     toast.success(`Appointment ${action.toLowerCase()}ed`);
//     await loadAppointments(); // 🔄 fresh data
//   } catch (err) {
//     const msg = err?.response?.data?.message;
//     if (msg?.includes("already processed")) {
//       // expected case → silently refresh
//       loadAppointments();
//     } else {
//       toast.error("Action failed");
//     }
//   } finally {
//     setProcessingId(null); // 🔓 unlock
//   }
// };

//   /* ================= START APPOINTMENT ================= */
//   const handleStart = async (id) => {
//     try {
//       await startAppointment(id);
//       toast.success("Appointment started");
//       loadAppointments();
//     } catch (err) {
//       console.error(err);
//       toast.error("Unable to start appointment");
//     }
//   };

//   if (loading) {
//     return <div className="p-6 text-center text-gray-500">Loading...</div>;
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h2 className="text-xl font-semibold mb-4">Incoming Appointments</h2>

//       {appointments.length === 0 && (
//         <p className="text-gray-500">No incoming appointments</p>
//       )}

//       {appointments.map((a) => (
//         <div
//           key={a.id}
//           className="bg-white p-4 rounded-lg shadow mb-3 flex justify-between items-center"
//         >
//           <div>
//             <p className="font-semibold">{a.patient_name}</p>
//             <p className="text-sm text-gray-500">Token #{a.token_number}</p>
//             <p className="text-sm text-gray-500">
//               {new Date(a.appointment_date).toLocaleDateString()} •{" "}
//               {a.appointment_slot}
//             </p>
//             <p className="text-sm font-medium">
//               Status:{" "}
//               <span
//                 className={
//                   a.status === "ACCEPTED" ? "text-green-600" : "text-yellow-600"
//                 }
//               >
//                 {a.status}
//               </span>
//             </p>
//           </div>

//           <div className="flex gap-2">
//             {a.status === "PENDING" && (
//               <>
//                 <button
//                 disabled={processingId === a.id}
//                   onClick={() => handleRespond(a.id, "ACCEPT")}
//                   className="px-3 py-1 bg-green-500 text-white rounded"
//                 >
//                   Accept
//                 </button>

//                 <button
//                 disabled={processingId === a.id}
//                   onClick={() => handleRespond(a.id, "REJECT")}
//                   className="px-3 py-1 bg-red-500 text-white rounded"
//                 >
//                   Reject
//                 </button>
//               </>
//             )}

//             {a.status === "ACCEPTED" && isToday(a.appointment_date) && (
//               <button
//                 onClick={() => handleStart(a.id)}
//                 className="px-3 py-1 bg-bg-[#2277f7] text-white rounded"
//               >
//                 Start
//               </button>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default IncomingAppointments;


import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";
import {
  startAppointment,
  respondAppointment,
} from "../../../services/doctorService";

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
      return appointments.filter(
        (a) => a.appointment_slot === "MORNING"
      );
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
    return (
      <div className="p-6 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-sky-50 text-gray-800">
      <div className="max-w-5xl mx-auto min-h-screen flex flex-col">


        {/* FILTER PILLS */}
        <div className="flex gap-3 px-8 py-6 flex-wrap">
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

        {/* LIST AREA */}
        <div className="flex-1 px-8 pb-20 space-y-6">

          {filteredAppointments.length === 0 && (
            <p className="text-gray-500">
              No appointments found
            </p>
          )}

          {filteredAppointments.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow-md border border-sky-100 p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between flex-wrap gap-4">
                <div>
                  <div className="flex gap-3 text-sm mb-2 flex-wrap">
                    <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-medium">
                      TOKEN #{a.token_number}
                    </span>
                    <span className="text-gray-400">
                      ID: {a.id}
                    </span>
                  </div>

                  <h2
                    className={`text-xl font-bold ${
                      a.status === "ACCEPTED"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {a.patient_name}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    {new Date(
                      a.appointment_date
                    ).toLocaleDateString()}{" "}
                    • {a.appointment_slot}
                  </p>
                </div>

                <span
                  className={`px-4 py-1 rounded-full h-fit text-sm font-semibold ${
                    a.status === "PENDING"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {a.status}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4 mt-6">
                {a.status === "PENDING" && (
                  <>
                    <button
                      disabled={processingId === a.id}
                      onClick={() =>
                        handleRespond(a.id, "ACCEPT")
                      }
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold"
                    >
                      Accept
                    </button>

                    <button
                      disabled={processingId === a.id}
                      onClick={() =>
                        handleRespond(a.id, "REJECT")
                      }
                      className="flex-1 border border-red-400 text-red-500 hover:bg-red-50 py-3 rounded-xl font-semibold"
                    >
                      Reject
                    </button>
                  </>
                )}

                {a.status === "ACCEPTED" &&
                  isToday(a.appointment_date) && (
                    <button
                      onClick={() =>
                        handleStart(a.id)
                      }
                      className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold"
                    >
                      Start
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
