// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaCalendarCheck,
//   FaBell,
//   FaUserMd,
//   FaClock,
//   FaListOl,
// } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { getPatientDashboard } from "../../services/patientService";

// const PatientDashboard = () => {
//   const navigate = useNavigate();

//   /* ================= STATE ================= */
//   const [upcoming, setUpcoming] = useState(null);
//   const [queue, setQueue] = useState(0);
//   const [token, setToken] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [patientName, setPatientName] = useState("");
//   /* ================= LOAD DASHBOARD ================= */
//   useEffect(() => {
//     getPatientDashboard()
//       .then((res) => {
//         const data = res.data;

//         const appt =
//           data.appointments && data.appointments.length > 0
//             ? data.appointments[0]
//             : null;

//         if (appt) {
//           console.log("Upcoming appointment raw:", appt);
//           console.log("Resolved doctorId:", appt.doctorId ?? appt.doctor_id);
//         }

//         setPatientName(data.patientName);

//         setUpcoming(
//           appt
//             ? {
//                 doctorName: appt.doctorName,
//                 specialization: appt.specialization,
//                 date: appt.appointment_date,
//                 session: appt.appointment_slot,
//                 doctorId: appt.doctorId ?? appt.doctor_id,
//               }
//             : null,
//         );

//         setQueue(data.todayToken ? data.todayToken.token : 0);
//         setToken(data.todayToken ? data.todayToken.token : 0);
//       })
//       .catch(() => toast.error("Dashboard load failed"))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#f6f7fb] px-4 py-6 md:px-8">
//       {/* ================= HEADER ================= */}
//       <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">
//             Hello, {patientName || "Patient"} 👋
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Here’s your health overview for today
//           </p>
//         </div>

//         <button
//           onClick={() => navigate("/client/book-appointment")}
//           className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-white font-semibold shadow hover:opacity-90"
//         >
//           + Book Appointment
//         </button>
//       </div>

//       {/* ================= STATUS CARDS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//         {/* Upcoming Appointment */}
//         <div className="bg-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
//           <div className="absolute top-4 right-4 opacity-10">
//             <FaCalendarCheck className="text-6xl text-blue-500" />
//           </div>

//           <p className="text-sm text-slate-500 mb-2">Upcoming Appointment</p>

//           {upcoming ? (
//             <>
//               <h3 className="font-semibold text-lg text-slate-800">
//                 {upcoming.doctorName}
//               </h3>
//               <p className="text-sm text-slate-500 mt-1">
//                 {upcoming.date} • {upcoming.session}
//               </p>

//               <button
//                 onClick={() => navigate("/client/myappointment")}
//                 className="mt-4 w-full py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
//               >
//                 View Details
//               </button>
//             </>
//           ) : (
//             <p className="text-slate-400 mt-3">No upcoming appointment</p>
//           )}
//         </div>

//         {/* Current Queue */}
//         <div className="bg-linear-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5 shadow-sm">
//           <p className="text-sm text-slate-600 flex items-center gap-2">
//             <FaClock className="text-yellow-500" />
//             Current Queue
//           </p>
//           <p className="text-5xl font-bold text-yellow-600 mt-4">
//             {queue || "--"}
//           </p>
//           <p className="text-xs text-slate-500 mt-1">Patients ahead</p>
//         </div>

//         {/* Your Token */}
//         <div className="bg-linear-to-br from-green-50 to-emerald-100 rounded-2xl p-5 shadow-sm">
//           <p className="text-sm text-slate-600 flex items-center gap-2">
//             <FaListOl className="text-green-600" />
//             Your Token
//           </p>
//           <p className="text-5xl font-bold text-emerald-600 mt-4">
//             {token || "--"}
//           </p>
//           <p className="text-xs text-slate-500 mt-1">Today’s token number</p>
//         </div>
//       </div>

//       {/* ================= MY DOCTOR ================= */}
//       <div className="bg-white rounded-2xl shadow-sm p-5">
//         <h2 className="text-lg font-semibold text-slate-800 mb-4">
//           👨‍⚕️ My Doctor
//         </h2>

//         {upcoming ? (
//           <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition">
//             <div className="flex items-center gap-3">
//               <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
//                 <FaUserMd className="text-blue-600 text-xl" />
//               </div>

//               <div>
//                 <p className="font-semibold text-slate-800">
//                   {upcoming.doctorName}
//                 </p>
//                 <p className="text-sm text-slate-500">
//                   {upcoming.specialization}
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={() =>
//                 navigate(`/client/bookappointmentpage/${upcoming.doctorId}`)
//               }
//               className="px-4 py-2 rounded-lg border border-blue-500 text-blue-500 text-sm font-medium hover:bg-blue-500 hover:text-white transition"
//             >
//               Book Again
//             </button>
//           </div>
//         ) : (
//           <p className="text-slate-400">No doctors yet</p>
//         )}
//       </div>

//       {/* ================= FLOATING BUTTON (MOBILE) ================= */}
//       <button
//         onClick={() => navigate("/client/book-appointment")}
//         className="fixed bottom-6 right-6 md:hidden size-14 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-lg flex items-center justify-center text-2xl"
//       >
//         +
//       </button>
//     </div>
//   );
// };

// export default PatientDashboard;

// import React, { useMemo } from "react";
// import {
//   Calendar,
//   Plus,
//   Bell,
//   Users,
//   FlaskConical,
// } from "lucide-react";

// import { useNavigate } from "react-router-dom"; // ✅ proper navigation

// export default function PatientDashboard() {

//   const navigate = useNavigate();

//   // ✅ Future API Ready
//   // useMemo prevents unnecessary recalculation later
//   const upcomingCount = useMemo(() => appointments.length, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">

//       {/* HEADER */}
//       <div className="mb-6">

//         <h1 className="text-3xl font-bold text-gray-800 mt-2">
//           Welcome back, Alex Thompson
//         </h1>

//         <p className="text-gray-500 mt-1">
//           You have{" "}
//           <span className="text-blue-600 font-semibold">
//             {upcomingCount} appointments
//           </span>{" "}
//           scheduled for the next 7 days.
//         </p>
//       </div>

//       {/* TOP CARDS */}
//       <div className="grid lg:grid-cols-3 gap-6">

//         {/* Upcoming */}
//         <div className="rounded-2xl bg-white/60 backdrop-blur-lg border border-blue-100 shadow-sm p-6">
//           <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
//             <Calendar className="text-blue-600" />
//           </div>

//           <p className="text-gray-500 mt-4">Upcoming Appointments</p>
//           <h2 className="text-3xl font-bold text-gray-800 mt-1">
//             {upcomingCount}
//           </h2>
//         </div>

//         {/* Active Token */}
//         <div className="rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg p-6 relative overflow-hidden">
//           <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>

//           <div className="relative">
//             <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
//               Live Status
//             </span>

//             <p className="mt-6 text-sm opacity-90">
//               Today's Active Token
//             </p>

//             <h2 className="text-4xl font-bold mt-1">
//               #14 <span className="text-lg font-medium">- Cardiology</span>
//             </h2>

//             <p className="text-sm mt-1 opacity-90">
//               Est. Wait: 12 mins
//             </p>
//           </div>
//         </div>

//         {/* Lab Result */}
//         <div className="rounded-2xl bg-white/60 backdrop-blur-lg border border-blue-100 shadow-sm p-6">
//           <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
//             <FlaskConical className="text-blue-600" />
//           </div>

//           <p className="text-gray-500 mt-4">Last Lab Result</p>

//           <h3 className="font-semibold text-gray-800 mt-1">
//             Full Blood Count
//           </h3>

//           <p className="text-blue-600 font-medium text-sm mt-1">
//             ● Normal Range
//           </p>
//         </div>
//       </div>

//       {/* MAIN GRID */}
//       <div className="grid lg:grid-cols-3 gap-6 mt-6">

//         {/* APPOINTMENTS TABLE */}
//         <div className="lg:col-span-2 rounded-2xl bg-white/70 backdrop-blur-lg border border-blue-100 shadow-sm p-6">

//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Upcoming Appointments
//             </h2>

//             <button
//               onClick={() => navigate("/appointments")}
//               className="text-blue-600 font-medium hover:underline"
//             >
//               View All Schedule
//             </button>
//           </div>

//           <div className="space-y-4">
//             {appointments.map((doc) => (
//               <AppointmentRow key={doc.id} doc={doc} />
//             ))}
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="space-y-6">

//           {/* Quick Actions */}
//           <div className="rounded-2xl bg-white/70 backdrop-blur-lg border border-blue-100 shadow-sm p-6">
//             <h2 className="font-semibold text-gray-800 mb-4">
//               Quick Actions
//             </h2>

//             <div className="grid grid-cols-2 gap-4">
//               <Action icon={<Plus />} label="BOOK NOW" />
//               <Action icon={<Calendar />} label="SCHEDULE" />
//               <Action icon={<Users />} label="FAMILY" />
//               <Action icon={<Bell />} label="REMINDERS" />
//             </div>
//           </div>

//           {/* Health Tip */}
//           <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 shadow-lg">
//             <h3 className="font-semibold text-lg">
//               Health Tip of the Day
//             </h3>

//             <p className="text-sm opacity-90 mt-2">
//               Drink at least 8 glasses of water today to maintain
//               optimal kidney function and energy levels.
//             </p>

//             <button className="mt-4 font-semibold flex items-center gap-2">
//               LEARN MORE →
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ✅ Extracted Row Component
//    Prevents dashboard from becoming a monster file later
// */
// const AppointmentRow = React.memo(({ doc }) => {
//   return (
//     <div className="flex items-center justify-between p-4 rounded-xl hover:bg-blue-50 transition">
//       <div className="flex items-center gap-3">
//         <img
//           src={doc.img}
//           className="w-12 h-12 rounded-full object-cover"
//           alt={doc.name}
//         />

//         <div>
//           <p className="font-semibold text-gray-800">
//             {doc.name}
//           </p>
//           <p className="text-sm text-gray-400">
//             {doc.place}
//           </p>
//         </div>
//       </div>

//       <p className="text-gray-600">{doc.special}</p>

//       <div>
//         <p className="font-medium text-gray-700">
//           {doc.date}
//         </p>
//         <p className="text-sm text-blue-600">
//           {doc.time}
//         </p>
//       </div>

//       <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
//         {doc.token}
//       </span>
//     </div>
//   );
// });

// function Action({ icon, label }) {
//   return (
//     <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition cursor-pointer">
//       <div className="text-blue-600">{icon}</div>
//       <p className="text-sm font-semibold text-gray-700">
//         {label}
//       </p>
//     </div>
//   );
// }

// // ✅ Added IDs (CRITICAL for React diffing)
// const appointments = [
//   {
//     id: 1,
//     name: "Dr. Sarah Johnson",
//     place: "OPD Block A",
//     special: "Cardiology",
//     date: "Today, Oct 24",
//     time: "10:30 AM",
//     token: "#14",
//     img: "https://randomuser.me/api/portraits/women/44.jpg",
//   },
//   {
//     id: 2,
//     name: "Dr. Mark Richardson",
//     place: "General Ward",
//     special: "General Physician",
//     date: "Oct 26, 2023",
//     time: "02:15 PM",
//     token: "#05",
//     img: "https://randomuser.me/api/portraits/men/32.jpg",
//   },
//   {
//     id: 3,
//     name: "Dr. Elena Gilbert",
//     place: "Dental Clinic",
//     special: "Dentist",
//     date: "Oct 30, 2023",
//     time: "09:00 AM",
//     token: "#12",
//     img: "https://randomuser.me/api/portraits/women/68.jpg",
//   },
// ];

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Plus, Bell, Users, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getPatientDashboard } from "../../services/patientService";

export default function PatientDashboard() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [queue, setQueue] = useState(0);
  const [token, setToken] = useState(0);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "http://localhost:4000";
  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    getPatientDashboard()
      .then((res) => {
        const data = res.data;

        setPatientName(data.patientName || "Patient");

        // Upcoming appointment list
        if (data.appointments && data.appointments.length > 0) {
          const formatted = data.appointments.map((appt, index) => ({
            id: index + 1,
            name: appt.doctorName,
            special: appt.specialization,
            date: appt.appointment_date,
            time: appt.appointment_slot,
            token: `#${appt.token_number || "--"}`,
            img: appt.profile_image
              ? `${BASE_URL}${appt.profile_image}`
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }));

          setAppointments(formatted);
        } else {
          setAppointments([]);
        }

        //                if (data.appointments && data.appointments.length > 0) {
//   setAppointments(data.appointments);
// } else {
//   setAppointments([]);
// }

        setQueue(data.todayToken ? data.todayToken.token : 0);
        setToken(data.todayToken ? data.todayToken.token : 0);
      })
      .catch(() => toast.error("Dashboard load failed"))
      .finally(() => setLoading(false));
  }, []);

  const upcomingCount = useMemo(() => appointments.length, [appointments]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mt-2">
          Welcome {patientName}
        </h1>

        <p className="text-gray-500 mt-1">
          You have{" "}
          <span className="text-blue-600 font-semibold">{upcomingCount}</span>{" "}
          appointments scheduled.
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-lg border border-blue-100 shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Calendar className="text-blue-600" />
          </div>

          <p className="text-gray-500 mt-4">Upcoming Appointments</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-1">
            {upcomingCount}
          </h2>
        </div>

        {/* Active Token */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl"></div>

          <div className="relative">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
              Live Status
            </span>

            <p className="mt-6 text-sm opacity-90">Today's Active Token</p>

            <h2 className="text-4xl font-bold mt-1">#{token || "--"}</h2>

            <p className="text-sm mt-1 opacity-90">
              Patients Ahead: {queue || "--"}
            </p>
          </div>
        </div>

        {/* Lab Result (Static as before) */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-lg border border-blue-100 shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <FlaskConical className="text-blue-600" />
          </div>

          <p className="text-gray-500 mt-4">Last Lab Result</p>
          <h3 className="font-semibold text-gray-800 mt-1">Full Blood Count</h3>

          <p className="text-blue-600 font-medium text-sm mt-1">
            ● Normal Range
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        {/* APPOINTMENTS TABLE */}
        <div className="lg:col-span-2 rounded-2xl bg-white/70 backdrop-blur-lg border border-blue-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Upcoming Appointments
            </h2>

            <button
              onClick={() => navigate("/client/myappointment")}
              className="text-blue-600 font-medium hover:underline"
            >
              View All Schedule
            </button>
          </div>

          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((doc) => (
                <AppointmentRow key={doc.id} doc={doc} />
              ))
            ) : (
              <p className="text-gray-400">No upcoming appointments</p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL SAME */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/70 backdrop-blur-lg border border-blue-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-4">
              <Action icon={<Plus />} label="BOOK NOW" />
              <Action icon={<Calendar />} label="SCHEDULE" />
              <Action icon={<Users />} label="FAMILY" onClick={() => navigate("/client/family")} />
              <Action icon={<Bell />} label="REMINDERS" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= ROW ================= */
const AppointmentRow = React.memo(({ doc }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-blue-50 transition">
      <div className="flex items-center gap-3">
        <img
          src={doc.img}
          onError={(e) =>
            (e.target.src =
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
          }
          className="w-12 h-12 rounded-full object-cover"
          alt={doc.name}
        />
        <div>
          <p className="font-semibold text-gray-800">{doc.name}</p>
          <p className="text-sm text-gray-400">{doc.place}</p>
        </div>
      </div>

      <p className="text-gray-600">{doc.special}</p>

      <div>
        <p className="font-medium text-gray-700">{doc.date}</p>
        <p className="text-sm text-blue-600">{doc.time}</p>
      </div>

      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
        {doc.token}
      </span>
    </div>
  );
});

/* ================= ACTION ================= */
function Action({ icon, label,onClick }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition cursor-pointer" onClick={onClick}>
      <div className="text-blue-600">{icon}</div>
      <p className="text-sm font-semibold text-gray-700">{label}</p>
    </div>
  );
}
