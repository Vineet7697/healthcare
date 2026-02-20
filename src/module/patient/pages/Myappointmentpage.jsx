// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { generatePrescriptionPDF } from "../../../utils/generatePrescriptionPDF";
// import { toast } from "react-toastify";
// import { FaUserMd, FaEye } from "react-icons/fa";
// import AppointmentService from "../../../services/AppointmentService";
// import api from "../../../services/api";

// /* ================= STATUS MAPPER (BACKEND → UI) ================= */
// const getUiStatus = (status) => {
//   switch (status) {
//     case "ACCEPTED":
//       return "Confirmed";
//     case "IN_PROGRESS":
//       return "In Progress";
//     case "COMPLETED":
//       return "Completed";
//     case "CANCELLED":
//       return "Cancelled";
//     case "REJECTED":
//       return "Rejected";
//     case "PENDING":
//     default:
//       return "Pending";
//   }
// };

// const Myappointmentpage = () => {
//   const navigate = useNavigate();

//   const [appointments, setAppointments] = useState([]);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [rating, setRating] = useState(0);
//   const [loading, setLoading] = useState(false);

//   /* ================= FETCH APPOINTMENTS ================= */
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       setLoading(true);
//       try {
//         const data = await AppointmentService.getHistory();

//         // backend status ko touch nahi kar rahe
//         const mapped = data.map((appt) => ({
//           ...appt,
//           uiStatus: getUiStatus(appt.status),
//         }));

//         setAppointments(mapped);
//       } catch (err) {
//         toast.error("Failed to load appointments");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   /* ================= ACTIONS ================= */

//   const joinCall = (appt) => {
//     navigate(`/client/onlineconsultation?room=${appt.id}`);
//   };

//   const cancelAppointment = async (id) => {
//     try {
//       await AppointmentService.cancel(id);

//       setAppointments((prev) =>
//         prev.map((a) =>
//           a.id === id ? { ...a, status: "CANCELLED", uiStatus: "Cancelled" } : a
//         )
//       );

//       toast.success("Appointment cancelled");
//     } catch {
//       toast.error("Cancel failed");
//     }
//   };

//   const addToTimeline = async () => {
//     try {
//       await api.post("/healthTimeline", {
//         id: Date.now(),
//         type: "Appointment",
//         title: selectedAppointment.doctorName,
//         date: selectedAppointment.date,
//         description: `Appointment with ${selectedAppointment.doctorName}`,
//       });

//       toast.success("Added to Health Timeline");
//     } catch {
//       toast.error("Timeline update failed");
//     }
//   };

//   const submitRating = async () => {
//     try {
//       await AppointmentService.rateDoctor(
//         selectedAppointment.doctorId,
//         rating
//       );

//       toast.success("Rating submitted");
//       setSelectedAppointment(null);
//       setRating(0);
//     } catch {
//       toast.error("Rating failed");
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] py-10 px-4">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl mx-auto">
//         <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
//           My Appointments
//         </h2>

//         {loading && (
//           <p className="text-center text-blue-600 font-semibold mb-4">
//             Loading appointments...
//           </p>
//         )}

//         {/* ================= DESKTOP TABLE ================= */}
//         <div className="hidden md:block overflow-x-auto">
//           <table className="w-full rounded-2xl">
//             <thead className="bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white">
//               <tr>
//                 <th className="p-3 text-left">Doctor</th>
//                 <th className="text-left">Date</th>
//                 <th className="text-left">Token</th>
//                 <th className="text-left">Status</th>
//                 <th className="text-left">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {appointments.map((appt) => (
//                 <tr key={appt.id} className="border-b">
//                   <td
//                     className="p-3 text-blue-600 cursor-pointer hover:underline"
//                     onClick={() =>
//                       navigate(`/client/doctor/${appt.doctorId}`)
//                     }
//                   >
//                     <FaUserMd className="inline mr-2" />
//                     {appt.doctorName}
//                   </td>

//                   <td>{appt.date}</td>
//                   <td>{appt.time}</td>

//                   {/* STATUS */}
//                   <td>
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm text-white
//                         ${
//                           appt.uiStatus === "Completed"
//                             ? "bg-green-500"
//                             : appt.uiStatus === "Cancelled" ||
//                               appt.uiStatus === "Rejected"
//                             ? "bg-red-500"
//                             : appt.uiStatus === "Confirmed"
//                             ? "bg-blue-600"
//                             : appt.uiStatus === "In Progress"
//                             ? "bg-purple-600"
//                             : "bg-yellow-500"
//                         }`}
//                     >
//                       {appt.uiStatus}
//                     </span>
//                   </td>

//                   {/* ACTIONS */}
//                   <td className="text-center space-x-2">
//                     {(appt.status === "ACCEPTED" ||
//                       appt.status === "IN_PROGRESS") && (
//                       <button
//                         onClick={() => joinCall(appt)}
//                         className="px-3 py-1 bg-green-600 text-white rounded"
//                       >
//                         Join
//                       </button>
//                     )}

//                     {(appt.status === "PENDING" ||
//                       appt.status === "ACCEPTED") && (
//                       <button
//                         onClick={() => cancelAppointment(appt.id)}
//                         className="px-3 py-1 bg-red-600 text-white rounded"
//                       >
//                         Cancel
//                       </button>
//                     )}

//                     {appt.status === "COMPLETED" && (
//                       <button
//                         onClick={() => setSelectedAppointment(appt)}
//                         className="px-3 py-1 bg-green-600 text-white rounded"
//                       >
//                         <FaEye className="inline" /> View
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ================= DETAILS MODAL ================= */}
//       {selectedAppointment && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 backdrop-blur-sm bg-white/30"
//             onClick={() => setSelectedAppointment(null)}
//           />

//           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 z-10">
//             <button
//               onClick={() => setSelectedAppointment(null)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
//             >
//               ✕
//             </button>

//             <h3 className="text-xl font-semibold mb-3 text-gray-700">
//               Appointment Details
//             </h3>

//             <div className="text-sm text-gray-600 space-y-1">
//               <p>
//                 <strong>Doctor:</strong>{" "}
//                 {selectedAppointment.doctorName}
//               </p>
//               <p>
//                 <strong>Date:</strong> {selectedAppointment.date}
//               </p>
//               <p>
//                 <strong>Time:</strong> {selectedAppointment.time}
//               </p>
//               <p>
//                 <strong>Hospital:</strong>{" "}
//                 {selectedAppointment.hospital}
//               </p>
//             </div>

//             <hr className="my-4" />

//             {/* Rating */}
//             <h4 className="font-semibold mb-2">Rate Doctor</h4>
//             <div className="flex gap-2 mb-3">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   onClick={() => setRating(star)}
//                   className={`text-2xl ${
//                     rating >= star
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                   }`}
//                 >
//                   ★
//                 </button>
//               ))}
//             </div>

//             <button
//               disabled={!rating}
//               onClick={submitRating}
//               className={`w-full py-2 rounded-lg text-white mb-3
//                 ${
//                   rating
//                     ? "bg-blue-600 hover:bg-blue-700"
//                     : "bg-gray-300 cursor-not-allowed"
//                 }`}
//             >
//               Submit Rating
//             </button>

//             <div className="flex gap-3">
//               <button
//                 onClick={() =>
//                   generatePrescriptionPDF(selectedAppointment)
//                 }
//                 className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
//               >
//                 📄 Download Prescription
//               </button>

//               <button
//                 onClick={addToTimeline}
//                 className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//               >
//                 🕒 Add to Timeline
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Myappointmentpage;


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
            : a
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

  return (
    <div className="bg-slate-100 min-h-screen p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            My Appointments
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track your upcoming health consultations.
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-blue-600 font-semibold mb-4">
          Loading appointments...
        </p>
      )}

      {/* TABLE HEADER */}
      <div className="grid grid-cols-5 text-sm font-semibold text-slate-400 px-6 mb-3">
        <p>DOCTOR & SPECIALIZATION</p>
        <p>DATE & SHIFT</p>
        <p>TOKEN</p>
        <p>STATUS</p>
        <p>ACTIONS</p>
      </div>

      {/* CARD */}
      <div className="space-y-4">
        {appointments.map((doc) => (
          <div
            key={doc.id}
            className="grid grid-cols-5 items-center bg-white rounded-2xl px-6 py-5 shadow-sm border border-slate-200"
          >
            {/* Doctor */}
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() =>
                navigate(`/client/doctor/${doc.doctorId}`)
              }
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {doc.doctorName?.charAt(0)}
                </span>
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  {doc.doctorName}
                </p>
                <p className="text-sm text-blue-500">
                  {doc.specialization}
                </p>
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
                TOKEN {doc.token}
              </span>
            </div>

            {/* Status */}
            <div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold
                ${
                  doc.statusUi === "Completed"
                    ? "bg-green-100 text-green-700"
                    : doc.statusUi === "Cancelled" ||
                      doc.statusUi === "Rejected"
                    ? "bg-red-100 text-red-600"
                    : doc.statusUi === "Confirmed"
                    ? "bg-blue-100 text-blue-700"
                    : doc.statusUi === "In Progress"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                ● {doc.statusUi.toUpperCase()}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {(doc.status === "ACCEPTED" ||
                doc.status === "IN_PROGRESS") && (
                <button
                  onClick={() => joinCall(doc)}
                  className="text-green-600 font-medium"
                >
                  Join
                </button>
              )}

              {(doc.status === "PENDING" ||
                doc.status === "ACCEPTED") && (
                <button
                  onClick={() => cancelAppointment(doc.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-500 font-medium cursor-pointer"
                >
                  <XCircle size={16} />
                  Cancel
                </button>
              )}

              {doc.status === "COMPLETED" && (
                <button
                  onClick={() => setSelectedAppointment(doc)}
                  className="text-blue-600 font-medium bg-green-500/10 px-3 py-1 rounded cursor-pointer"
                >
                  View
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl relative">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">
              Appointment Details
            </h3>

            <p><strong>Doctor:</strong> {selectedAppointment.doctorName}</p>
            <p><strong>Date:</strong> {selectedAppointment.date}</p>
            <p><strong>Time:</strong> {selectedAppointment.time}</p>

            <hr className="my-4" />

            {/* Rating */}
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
              className="w-full bg-blue-600 text-white py-2 rounded mb-3"
            >
              Submit Rating
            </button>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  generatePrescriptionPDF(selectedAppointment)
                }
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
