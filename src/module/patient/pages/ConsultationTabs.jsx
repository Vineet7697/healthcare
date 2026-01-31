// import { useState } from "react";
// import {
//   Building2,
//   Video,
//   MapPin,
//   Clock,
//   Phone,
//   Calendar as CalendarIcon,
// } from "lucide-react";
// import { useParams, useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import api from "../../../services/api";
// import { Button } from "react-bootstrap";
// import Calendar from "react-calendar";
// import { format, addDays, isSameDay } from "date-fns";

// const timeSlots = [
//   "09:00 AM",
//   "09:30 AM",
//   "10:00 AM",
//   "10:30 AM",
//   "11:00 AM",
//   "11:30 AM",
//   "02:00 PM",
//   "02:30 PM",
//   "03:00 PM",
//   "03:30 PM",
//   "04:00 PM",
//   "04:30 PM",
// ];

// const ConsultationTabs = () => {
//   const [activeTab, setActiveTab] = useState("clinic");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedSlot, setSelectedSlot] = useState(null);

//   const today = new Date();
//   const tomorrow = addDays(today, 1);
//   const dayAfter = addDays(today, 2);

//   const quickDates = [
//     { label: "Today", date: today },
//     { label: "Tomorrow", date: tomorrow },
//     { label: format(dayAfter, "EEE, d MMM"), date: dayAfter },
//   ];

//   const { doctorId } = useParams();
//   const location = useLocation();

//   const doctor = location.state?.doctor;

//   useEffect(() => {
//     if (!doctor && doctorId) {
//       api
//         .get(`/doctors/${doctorId}`)
//         .then((res) => {
//           setDoctor(res.data); // ✅ YAHAN setDoctor
//         })
//         .catch((err) => {
//           console.error("Doctor fetch failed", err);
//         });
//     }
//   }, [doctorId, doctor]);
//   return (
//     <div className="bg-white rounded-3xl shadow-lg p-6 animate-slide-in max-w-4xl mx-auto">
//       {/* ================= DOCTOR INFO ================= */}
//       {doctor && (
//         <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border">
//           <h3 className="text-xl fw-bold text-primary mb-1">
//             {doctor.doctorName}
//           </h3>
//           <p className="text-muted">
//             {doctor.specialization} • {doctor.city}
//           </p>
//         </div>
//       )}

//       {/* ================= TABS ================= */}
//       <div className="d-flex bg-light rounded-pill p-1 mb-4">
//         <button
//           onClick={() => setActiveTab("clinic")}
//           className={`flex-fill py-2 rounded-pill fw-semibold ${
//             activeTab === "clinic"
//               ? "bg-white text-primary shadow-sm"
//               : "text-secondary"
//           }`}
//         >
//           <Building2 size={16} className="me-2" />
//           Clinic Visit
//         </button>

//         <button
//           onClick={() => setActiveTab("online")}
//           className={`flex-fill py-2 rounded-pill fw-semibold ${
//             activeTab === "online"
//               ? "bg-white text-primary shadow-sm"
//               : "text-secondary"
//           }`}
//         >
//           <Video size={16} className="me-2" />
//           Online Consult
//         </button>
//       </div>

//       {/* ================= CONTENT ================= */}
//       {activeTab === "clinic" ? (
//         <div className="p-4 rounded-4 mb-4" style={{ background: "#f2f9ff" }}>
//           <h6 className="fw-bold d-flex align-items-center gap-2 mb-3">
//             <Building2 size={18} className="text-primary" />
//             Apollo Clinic, Sector 18
//           </h6>

//           <div className="text-muted small d-flex flex-column gap-2">
//             <div className="d-flex align-items-center gap-2">
//               <MapPin size={14} />
//               Shop No. 12, Market Complex, Sector 18, Noida
//             </div>

//             <div className="d-flex align-items-center gap-2">
//               <Clock size={14} />
//               Mon – Sat: 10:00 AM – 6:00 PM
//             </div>

//             <div className="d-flex align-items-center gap-2">
//               <Phone size={14} />
//               +91 98765 43210
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {/* ================= QUICK DATES ================= */}
//           <div className="d-flex gap-2">
//             {quickDates.map((item) => (
//               <button
//                 key={item.label}
//                 onClick={() => setSelectedDate(item.date)}
//                 className={`flex-fill py-2 rounded-pill fw-semibold ${
//                   selectedDate?.toDateString() === item.date.toDateString()
//                     ? "bg-primary text-white"
//                     : "bg-light text-secondary"
//                 }`}
//               >
//                 {item.label}
//               </button>
//             ))}
//           </div>

//           {/* ================= CALENDAR ================= */}
//           <div className="p-4 rounded-3xl border bg-light">
//             <div className="d-flex align-items-center gap-2 mb-2 fw-semibold">
//               <CalendarIcon size={16} className="text-primary" />
//               Select Date
//             </div>

//             <Calendar
//               value={selectedDate}
//               onChange={setSelectedDate}
//               minDate={new Date()}
//             />
//           </div>

//           {/* ================= TIME SLOTS ================= */}
//           {selectedDate && (
//             <div>
//               <h6 className="fw-semibold mb-3">
//                 Available Slots – {format(selectedDate, "d MMM yyyy")}
//               </h6>

//               <div
//                 className="d-grid gap-2"
//                 style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
//               >
//                 {timeSlots.map((slot) => (
//                   <button
//                     key={slot}
//                     onClick={() => setSelectedSlot(slot)}
//                     className={`py-2 rounded fw-semibold ${
//                       selectedSlot === slot
//                         ? "bg-primary text-white"
//                         : "bg-light text-secondary"
//                     }`}
//                   >
//                     {slot}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           <Button
//             disabled={!selectedDate || !selectedSlot}
//             className="w-100 py-3 fw-bold rounded-pill"
//           >
//             <Video className="me-2" size={16} />
//             Book Video Consultation
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConsultationTabs;
