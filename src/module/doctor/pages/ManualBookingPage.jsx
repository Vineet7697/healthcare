import React, { useState } from "react";
import { toast } from "react-toastify";
import { createManualBookingApi } from "../../../services/doctor/ManualBookingApi";

const ManualBookingPage = () => {
  // 🔑 LOGIN ke time saved doctor
  const doctor = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const [form, setForm] = useState({
    patientName: "",
    patientMobile: "",
    patientAge: "",
    appointmentType: "CLINIC",
    slot: "MORNING",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctor?.id) {
      toast.error("Doctor not logged in");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        doctorId: doctor.id, // 🔥 backend expects this
        appointmentType: form.appointmentType,
        slot: form.slot,
        patientName: form.patientName,
        patientMobile: form.patientMobile,
        patientAge: form.patientAge || null,
      };

      const { data } = await createManualBookingApi(payload);

      toast.success(
        `Token #${data.token} booked (${data.slot} shift)`
      );

      // reset form
      setForm({
        patientName: "",
        patientMobile: "",
        patientAge: "",
        appointmentType: "CLINIC",
        slot: "MORNING",
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Booking failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Manual Appointment Booking
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          placeholder="Patient Name"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="patientMobile"
          value={form.patientMobile}
          onChange={handleChange}
          placeholder="Mobile Number"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="patientAge"
          type="number"
          value={form.patientAge}
          onChange={handleChange}
          placeholder="Age (optional)"
          className="w-full border p-2 rounded"
        />

        <select
          name="slot"
          value={form.slot}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="MORNING">Morning</option>
          <option value="EVENING">Evening</option>
        </select>

        <button
          disabled={loading}
          className="w-full py-2  bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white rounded cursor-pointer hover:opacity-90 "
        >
          {loading ? "Creating..." : "Create & Add to Queue"}
        </button>
      </form>
    </div>
  );
};

export default ManualBookingPage;
