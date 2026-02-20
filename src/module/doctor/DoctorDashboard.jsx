// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaUsers,
//   FaQrcode,
//   FaPlus,
//   FaUserClock,
//   FaToggleOn,
//   FaToggleOff,
//   FaCheckCircle,
// } from "react-icons/fa";
// import api from "../../services/api"; // ✅ AXIOS INSTANCE

// const DoctorDashboardHome = () => {
//   const navigate = useNavigate();

//   // 🔑 IMPORTANT: loggedInUser (NOT loggedInDoctor)
//   const doctor = JSON.parse(localStorage.getItem("loggedInUser")) || {};
//   const [doctorName, setDoctorName] = useState("");

//   /* ================= STATE ================= */
//   const [dashboard, setDashboard] = useState({
//     pendingRequests: 0,
//     todayQueue: 0,
//     completedToday: 0,
//   });

//   const [isOnline, setIsOnline] = useState(true);
//   const [loading, setLoading] = useState(true);

//   /* ================= LOAD DASHBOARD ================= */
//   useEffect(() => {
//     const loadDashboard = async () => {
//       try {
//         const res = await api.get("/doctor/dashboard");

//         setDashboard({
//           pendingRequests: res.data.pendingRequests || 0,
//           todayQueue: res.data.todayQueue || 0,
//           completedToday: res.data.completedToday || 0,
//         });
//         setDoctorName(res.data.doctorName || "");
//         // backend me isOnline nahi aata, default true
//         setIsOnline(true);
//       } catch (error) {
//         console.error("Dashboard load failed", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboard();
//   }, []);

//   /* ================= DERIVED VALUES ================= */
//   const totalToday =
//     dashboard.pendingRequests + dashboard.todayQueue + dashboard.completedToday;

//   /* ================= TOGGLE ONLINE ================= */
//   const toggleAvailability = async () => {
//     const newStatus = !isOnline;

//     try {
//       // ✅ backend expects isAvailable
//       await api.put("/doctor/availability", {
//         isAvailable: newStatus,
//       });

//       setIsOnline(newStatus);
//     } catch (error) {
//       console.error("Status update failed", error);
//       alert("Unable to update status. Try again.");
//     }
//   };

//   /* ================= LOADING ================= */
//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-500">Loading dashboard...</div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       {/* ================= HEADER ================= */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//         <div>
//           <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
//             Welcome, {doctorName || "Doctor"}
//           </h2>
//           <p className="text-sm text-gray-500">
//             Here’s today’s overview of your clinic
//           </p>
//         </div>

//         <button
//           onClick={toggleAvailability}
//           className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition w-full sm:w-auto justify-center ${
//             isOnline ? "bg-green-500" : "bg-gray-400"
//           }`}
//         >
//           {isOnline ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
//           {isOnline ? "Online" : "Offline"}
//         </button>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
//         <StatCard
//           title="Incoming Appointments"
//           value={dashboard.pendingRequests}
//           icon={<FaUsers />}
//           onClick={() => navigate("/doctordashboard/incoming")}
//         />

//         <StatCard
//           title="Today Queue"
//           value={dashboard.todayQueue}
//           icon={<FaUserClock />}
//         />

//         <StatCard
//           title="Completed Today"
//           value={dashboard.completedToday}
//           icon={<FaCheckCircle />}
//         />

//         <StatCard
//           title="Today Total Patients"
//           value={totalToday}
//           icon={<FaUsers />}
//         />
//       </div>

//       {/* ================= QUICK ACTIONS ================= */}
//       <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         <ActionBtn
//           label="Live Queue"
//           icon={<FaUserClock />}
//           onClick={() => navigate("/doctordashboard/livequeue")}
//         />

//         <ActionBtn
//           label="QR Walk-In"
//           icon={<FaQrcode />}
//           onClick={() => navigate("/doctordashboard/qrcode")}
//         />

//         <ActionBtn
//           label="Manual Booking"
//           icon={<FaPlus />}
//           onClick={() => navigate("/doctordashboard/manualbooking")}
//         />
//       </div>
//     </div>
//   );
// };

// /* ================= SMALL COMPONENTS ================= */

// const StatCard = ({ title, value, icon, onClick }) => (
//   <div
//     onClick={onClick}
//     className="bg-white p-4 rounded-xl shadow border flex justify-between items-center 
//                cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition"
//   >
//     <div>
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="text-xl sm:text-2xl font-semibold text-gray-800">{value}</p>
//     </div>
//     <div className="text-[#2277f7] text-xl sm:text-2xl">{icon}</div>
//   </div>
// );

// const ActionBtn = ({ label, icon, onClick }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="flex items-center justify-center gap-3 p-4 sm:p-5
//                bg-linear-to-br from-[#2277f7] to-[#52abd4]
//                text-white rounded-xl cursor-pointer hover:opacity-90
//                text-sm sm:text-base"
//   >
//     {icon}
//     {label}
//   </button>
// );

// export default DoctorDashboardHome;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [dashboard, setDashboard] = useState({
    pendingRequests: 0,
    todayQueue: 0,
    completedToday: 0,
    totalPatients: 0,
  });

  const [doctorName, setDoctorName] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [nextPatient, setNextPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/doctor/dashboard");

        setDashboard({
          pendingRequests: res.data.pendingRequests || 0,
          todayQueue: res.data.todayQueue || 0,
          completedToday: res.data.completedToday || 0,
          totalPatients:
            (res.data.pendingRequests || 0) +
            (res.data.todayQueue || 0) +
            (res.data.completedToday || 0),
        });

        setDoctorName(res.data.doctorName || "");

        // Next patient if backend sends
        if (res.data.nextPatient) {
          setNextPatient(res.data.nextPatient);
        }

        setIsOnline(true);
      } catch (error) {
        console.error("Dashboard load failed", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* ================= TOGGLE ONLINE ================= */
  const toggleAvailability = async () => {
    const newStatus = !isOnline;

    try {
      await api.put("/doctor/availability", {
        isAvailable: newStatus,
      });

      setIsOnline(newStatus);
    } catch (error) {
      console.error("Status update failed", error);
      alert("Unable to update status. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#f4f8fb] min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="bg-[#f4f8fb] font-sans text-gray-700 min-h-screen flex">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Welcome {doctorName || "Doctor"}
          </h3>

          <button
            onClick={toggleAvailability}
            className={`px-4 py-2 rounded-full text-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </button>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div
            onClick={() => navigate("/doctordashboard/incoming")}
            className="bg-gradient-to-r from-sky-500 to-sky-400 text-white p-6 rounded-xl shadow cursor-pointer"
          >
            <p className="text-sm">Pending Requests</p>
            <h3 className="text-3xl font-bold mt-2">
              {dashboard.pendingRequests}
            </h3>
          </div>

          <div
            onClick={() => navigate("/doctordashboard/livequeue")}
            className="bg-white p-6 rounded-xl shadow cursor-pointer"
          >
            <p className="text-sm text-gray-400">Today’s Queue</p>
            <h3 className="text-3xl font-bold text-sky-600 mt-2">
              {dashboard.todayQueue}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-400">Completed</p>
            <h3 className="text-3xl font-bold text-sky-600 mt-2">
              {dashboard.completedToday}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-sm text-gray-400">Total Patients</p>
            <h3 className="text-3xl font-bold text-sky-600 mt-2">
              {dashboard.totalPatients}
            </h3>
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        

        <div className="grid grid-cols-4 gap-6 mb-10">
          <div
            onClick={() => navigate("/doctordashboard/incoming")}
            className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg cursor-pointer"
          >
            <i className="fa-solid fa-calendar-check text-sky-500 text-2xl mb-3"></i>
            <p>Incoming Appointments</p>
          </div>

          <div
            onClick={() => navigate("/doctordashboard/livequeue")}
            className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg cursor-pointer"
          >
            <i className="fa-solid fa-list text-indigo-500 text-2xl mb-3"></i>
            <p>Today Queue</p>
          </div>

          <div
            onClick={() => navigate("/doctordashboard/history")}
            className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg cursor-pointer"
          >
            <i className="fa-solid fa-clock-rotate-left text-gray-500 text-2xl mb-3"></i>
            <p>Appt. History</p>
          </div>

          <div
            onClick={() => navigate("/doctordashboard/manualbooking")}
            className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg cursor-pointer"
          >
            <i className="fa-solid fa-star text-yellow-500 text-2xl mb-3"></i>
            <p>Manual Booking</p>
          </div>
        </div>

        {/* ================= NEXT PATIENT + CHART ================= */}
        <div className="grid grid-cols-3 gap-6">

          {/* NEXT PATIENT */}
          <div className="col-span-1 bg-gradient-to-r from-sky-500 to-sky-400 text-white p-6 rounded-xl shadow">
            <p className="text-sm mb-4">
              NEXT PATIENT – {nextPatient?.time || "No upcoming"}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    nextPatient?.image ||
                    "https://i.pravatar.cc/100?img=5"
                  }
                  alt="patient"
                  className="w-12 h-12 rounded-lg"
                />
                <div>
                  <p className="font-semibold">
                    {nextPatient?.name || "No Patient"}
                  </p>
                  <p className="text-sm text-sky-100">
                    {nextPatient?.reason || "—"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/doctordashboard/livequeue")}
                className="bg-white text-sky-600 p-3 rounded-full"
              >
                <i className="fa-solid fa-play"></i>
              </button>
            </div>
          </div>

          {/* CHART (UI untouched static) */}
          <div className="col-span-2 bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between mb-6">
              <h3 className="font-semibold">Patient Trends</h3>
              <span className="text-sky-600 text-sm">Weekly</span>
            </div>

            <div className="flex items-end gap-4 h-52">
              <div className="w-8 bg-sky-200 h-24 rounded"></div>
              <div className="w-8 bg-sky-300 h-32 rounded"></div>
              <div className="w-8 bg-sky-400 h-20 rounded"></div>
              <div className="w-8 bg-sky-500 h-44 rounded"></div>
              <div className="w-8 bg-sky-300 h-28 rounded"></div>
              <div className="w-8 bg-sky-200 h-16 rounded"></div>
              <div className="w-8 bg-gray-200 h-20 rounded"></div>
            </div>

            <div className="flex justify-between text-sm text-gray-400 mt-3">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DoctorDashboard;
