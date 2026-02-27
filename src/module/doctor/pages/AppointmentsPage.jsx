// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../../services/api";

// /* ================= STATUS MAP ================= */
// const mapStatus = (status) => {
//   switch (status) {
//     case "COMPLETED":
//       return "Completed";
//     case "REJECTED":
//     case "CANCELLED":
//       return "Cancelled";
//     case "ACCEPTED":
//       return "In Queue";
//     default:
//       return status;
//   }
// };

// const AppointmentHistory = () => {
//   const navigate = useNavigate();

//   const [appointments, setAppointments] = useState([]);
//   const [filter, setFilter] = useState("TODAY");
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD HISTORY ================= */
//   useEffect(() => {
//     loadHistory();
//   }, []);

//   const loadHistory = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get("/doctor/appointments/history");

//       const normalized = (res.data.appointments || []).map((a) => ({
//         id: a.id,
//         aptId: `APT-${a.id}`,
//         patientName:
//           a.familyMemberName || a.patientEmail || "Walk-in Patient",
//         token: a.token_number,
//         slot: a.appointment_slot,
//         time: a.time || "--",
//         date: a.appointment_date,
//         status: mapStatus(a.status),
//         rawStatus: a.status,
//       }));

//       setAppointments(normalized);
//     } catch (err) {
//       console.error("Failed to load appointment history", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= DATE FILTER ================= */
//   const isToday = (date) => {
//     const d = new Date(date);
//     const t = new Date();
//     return (
//       d.getDate() === t.getDate() &&
//       d.getMonth() === t.getMonth() &&
//       d.getFullYear() === t.getFullYear()
//     );
//   };

//   const isLast7Days = (date) => {
//     const d = new Date(date);
//     const now = new Date();
//     const diff = (now - d) / (1000 * 60 * 60 * 24);
//     return diff <= 7;
//   };

//   const filteredAppointments = useMemo(() => {
//     return appointments
//       .filter((a) => {
//         if (filter === "TODAY") return isToday(a.date);
//         if (filter === "7DAYS") return isLast7Days(a.date);
//         return true;
//       })
//       .sort((a, b) => new Date(b.date) - new Date(a.date));
//   }, [appointments, filter]);

//   /* ================= STATUS STYLE ================= */
//   const statusStyle = (status) => {
//     switch (status) {
//       case "Completed":
//         return "bg-green-100 text-green-600";
//       case "Cancelled":
//         return "bg-red-100 text-red-500";
//       case "In Queue":
//         return "bg-blue-100 text-sky-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   return (
//     <div className="bg-sky-50 font-sans min-h-screen">
//       <main className="max-w-7xl mx-auto p-6">

//         {/* Page Title */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-700">
//               Appointment History
//             </h2>
//             <p className="text-gray-500">
//               Track all completed, cancelled and queued appointments
//             </p>
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex gap-3 mb-6">
//           <button
//             onClick={() => setFilter("TODAY")}
//             className={`px-5 py-2 rounded-lg ${
//               filter === "TODAY"
//                 ? "bg-sky-500 text-white"
//                 : "bg-white border hover:bg-sky-50"
//             }`}
//           >
//             Today
//           </button>

//           <button
//             onClick={() => setFilter("7DAYS")}
//             className={`px-5 py-2 rounded-lg ${
//               filter === "7DAYS"
//                 ? "bg-sky-500 text-white"
//                 : "bg-white border hover:bg-sky-50"
//             }`}
//           >
//             Last 7 Days
//           </button>

//           <button
//             onClick={() => setFilter("ALL")}
//             className={`px-5 py-2 rounded-lg ${
//               filter === "ALL"
//                 ? "bg-sky-500 text-white"
//                 : "bg-white border hover:bg-sky-50"
//             }`}
//           >
//             All Time
//           </button>
//         </div>

//         {/* History Cards */}
//         <div className="space-y-6">

//           {loading ? (
//             <p className="text-gray-500">Loading history...</p>
//           ) : filteredAppointments.length === 0 ? (
//             <p className="text-gray-400">
//               No appointment history found
//             </p>
//           ) : (
//             filteredAppointments.map((a) => (
//               <div
//                 key={a.id}
//                 className={`bg-white p-6 rounded-xl shadow-sm border ${
//                   a.status === "Cancelled" ? "opacity-70" : ""
//                 }`}
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <div>
//                     <p className="text-sm text-gray-400">
//                       {a.aptId}
//                     </p>
//                     <h3
//                       className={`text-xl font-semibold ${
//                         a.status === "Cancelled"
//                           ? "text-gray-500"
//                           : "text-gray-700"
//                       }`}
//                     >
//                       {a.patientName}
//                     </h3>
//                   </div>

//                   <span
//                     className={`px-4 py-1 rounded-full text-sm ${statusStyle(
//                       a.status
//                     )}`}
//                   >
//                     {a.status}
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-4 gap-6 text-gray-600">
//                   <div>
//                     <p className="text-sm">Shift</p>
//                     <p className="font-medium text-gray-800">
//                       {a.slot}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-sm">Time</p>
//                     <p className="font-medium text-gray-800">
//                       {new Date(a.date).toLocaleTimeString([], {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-sm">Token</p>
//                     <p className="font-medium text-sky-600">
//                       #{a.token}
//                     </p>
//                   </div>

//                   <div className="flex items-end justify-end">
//                     {a.rawStatus === "COMPLETED" && (
//                       <button
//                         onClick={() =>
//                           navigate(
//                             `/doctordashboard/visit-summary/${a.id}`
//                           )
//                         }
//                         className="text-sky-600 font-medium hover:underline"
//                       >
//                         View Details →
//                       </button>
//                     )}

//                     {a.rawStatus === "ACCEPTED" && (
//                       <button
//                         onClick={() =>
//                           navigate("/doctordashboard/livequeue")
//                         }
//                         className="text-sky-600 font-medium hover:underline"
//                       >
//                         Start Session →
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AppointmentHistory;

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

/* ================= STATUS MAP ================= */
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

const BASE_URL = "http://localhost:4000";

/* ================= IMAGE BUILDER ================= */
const buildImageUrl = (path) => {
  if (!path) return "/images/default-avatar.png";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

const getInitials = (name) => {
  if (!name) return "U";

  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();

  return words[0][0].toUpperCase() + words[1][0].toUpperCase();
};

const AppointmentHistory = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  /* ================= BACKEND FILTER MAPPING ================= */
  const getBackendFilter = () => {
    if (filter === "TODAY") return "today";
    if (filter === "7DAYS") return "last7";
    return "all";
  };

  /* ================= LOAD HISTORY ================= */
  const loadHistory = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/doctor/appointments/history?filter=${getBackendFilter()}`,
      );

      const normalized = (res.data.appointments || []).map((a) => ({
        id: a.id,
        token: a.token_number,
        patientName: a.familyMemberName || a.patientName || "Walk-in Patient",

        image: a.patientImage || null,

        type: a.appointment_type || "Consultation",
        date: a.appointment_date,
        slot: a.appointment_slot,
        rawStatus: a.status,
        status: mapStatus(a.status),
      }));

      setAppointments(normalized);
    } catch (err) {
      console.error("Failed to load appointment history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [filter]);

  /* ================= SORTED LIST ================= */
  const filteredAppointments = useMemo(() => {
    return [...appointments].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  }, [appointments]);

  /* ================= STATUS STYLE ================= */
  const statusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      case "In Queue":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <main className="flex-1 p-8">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Appointment History</h1>
            <p className="text-gray-500 mt-1">
              View and manage records of past patient consultations.
            </p>
          </div>
        </div>

        {/* ================= FILTER TABS ================= */}
        <div className="flex gap-6  mb-6">
          {["TODAY", "7DAYS", "ALL"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-3 ${
                filter === tab
                  ? "border-b-2 border-teal-500 text-teal-600 font-medium"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab === "TODAY"
                ? "Today"
                : tab === "7DAYS"
                  ? "Last 7 Days"
                  : "All Appointments"}
            </button>
          ))}
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Token</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No appointment history found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((a) => (
                  <tr key={a.id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {a.image ? (
                          <img
                            src={buildImageUrl(a.image)}
                            alt={a.patientName}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.src = "/images/default-avatar.png";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold">
                            {getInitials(a.patientName)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{a.patientName}</p>
                          <p className="text-sm text-gray-400">{a.slot}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">{a.type}</td>

                    <td className="p-4 text-gray-500">#{a.token}</td>

                    <td className="p-4">
                      {new Date(a.date).toLocaleString([], {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${statusStyle(
                          a.status,
                        )}`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td className="p-4 text-right text-teal-600 hover:underline cursor-pointer">
                      {a.rawStatus === "COMPLETED" && (
                        <span
                          onClick={() =>
                            navigate(`/doctordashboard/visit-summary/${a.id}`)
                          }
                        >
                          Prescribe
                        </span>
                      )}

                      {a.rawStatus === "ACCEPTED" && (
                        <span
                          onClick={() => navigate("/doctordashboard/livequeue")}
                        >
                          Start Session
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AppointmentHistory;
