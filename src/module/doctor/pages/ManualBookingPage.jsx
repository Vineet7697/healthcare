// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import { createManualBookingApi } from "../../../services/doctor/ManualBookingApi";

// const ManualBookingPage = () => {
//   // 🔑 LOGIN ke time saved doctor
//   const doctor = JSON.parse(localStorage.getItem("loggedInUser")) || {};

//   const [form, setForm] = useState({
//     patientName: "",
//     patientMobile: "",
//     patientAge: "",
//     appointmentType: "CLINIC",
//     slot: "MORNING",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!doctor?.id) {
//       toast.error("Doctor not logged in");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         doctorId: doctor.id, // 🔥 backend expects this
//         appointmentType: form.appointmentType,
//         slot: form.slot,
//         patientName: form.patientName,
//         patientMobile: form.patientMobile,
//         patientAge: form.patientAge || null,
//       };

//       const { data } = await createManualBookingApi(payload);

//       toast.success(
//         `Token #${data.token} booked (${data.slot} shift)`
//       );

//       // reset form
//       setForm({
//         patientName: "",
//         patientMobile: "",
//         patientAge: "",
//         appointmentType: "CLINIC",
//         slot: "MORNING",
//       });
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message || "Booking failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="p-6 max-w-md mx-auto">
//       <h2 className="text-xl font-semibold mb-4">
//         Manual Appointment Booking
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="patientName"
//           value={form.patientName}
//           onChange={handleChange}
//           placeholder="Patient Name"
//           required
//           className="w-full border p-2 rounded"
//         />

//         <input
//           name="patientMobile"
//           value={form.patientMobile}
//           onChange={handleChange}
//           placeholder="Mobile Number"
//           required
//           className="w-full border p-2 rounded"
//         />

//         <input
//           name="patientAge"
//           type="number"
//           value={form.patientAge}
//           onChange={handleChange}
//           placeholder="Age (optional)"
//           className="w-full border p-2 rounded"
//         />

//         <select
//           name="slot"
//           value={form.slot}
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//         >
//           <option value="MORNING">Morning</option>
//           <option value="EVENING">Evening</option>
//         </select>

//         <button
//           disabled={loading}
//           className="w-full py-2  bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white rounded cursor-pointer hover:opacity-90 "
//         >
//           {loading ? "Creating..." : "Create & Add to Queue"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ManualBookingPage;

import React, { useState } from "react";
import { toast } from "react-toastify";
import { createManualBookingApi } from "../../../services/doctor/ManualBookingApi";

export default function ManualVisitBooking() {

  // 🔑 Logged-in doctor (same as first code logic)
  const doctor = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const [formData, setFormData] = useState({
    appointmentType: "CLINIC",
    slot: "MORNING",
    patientName: "",
    patientMobile: "",
    patientAge: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor?.id) {
      toast.error("Doctor not logged in");
      return;
    }

    if (!formData.patientName || !formData.patientMobile) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        doctorId: doctor.id, // 🔥 from login
        appointmentType: formData.appointmentType,
        slot: formData.slot,
        patientName: formData.patientName,
        patientMobile: formData.patientMobile,
        patientAge: formData.patientAge || null,
      };

      const { data } = await createManualBookingApi(payload);

      toast.success(
        `Token #${data.token} booked successfully (${data.slot} shift)`
      );

      // Reset form
      setFormData({
        appointmentType: "CLINIC",
        slot: "MORNING",
        patientName: "",
        patientMobile: "",
        patientAge: "",
      });

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-sky-100">
      <h2 className="text-2xl font-bold text-sky-700 mb-6">
        Manual Visit Booking
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        

        {/* Patient Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Patient Name *
          </label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Enter patient name"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Mobile Number *
          </label>
          <input
            type="tel"
            name="patientMobile"
            value={formData.patientMobile}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Age
          </label>
          <input
            type="number"
            name="patientAge"
            value={formData.patientAge}
            onChange={handleChange}
            placeholder="Enter age"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
          />
        </div>
        {/* Shift */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Select Shift *
          </label>
          <select
            name="slot"
            value={formData.slot}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
          >
            <option value="MORNING">Morning</option>
            <option value="EVENING">Evening</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold transition"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>

      </form>
    </div>
  );
}