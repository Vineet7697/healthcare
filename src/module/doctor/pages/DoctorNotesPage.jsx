import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaNotesMedical, FaFilePrescription, FaCalendarAlt } from "react-icons/fa";

import { addVisitSummary } from "../../../services/doctorService";

const DoctorNotesPage = () => {
  const { id } = useParams(); // appointmentId
  const navigate = useNavigate();

  const [notes, setNotes] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUpAfterDays, setFollowUpAfterDays] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!notes && !prescription) {
      alert("Please add notes or prescription");
      return;
    }

    try {
      setLoading(true);

      await addVisitSummary(id, {
        notes,
        prescription,
        followUpAfterDays: followUpAfterDays
          ? Number(followUpAfterDays)
          : null,
      });

      alert("Visit summary saved successfully");
      navigate("/doctordashboard/history");
    } catch (err) {
      console.error(err);
      alert("Failed to save visit summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* ================= HEADER ================= */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FaNotesMedical />
        Visit Summary
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-5"
      >
        {/* ================= NOTES ================= */}
        <div>
          <label className="block font-medium mb-1">
            Doctor Notes
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Diagnosis, observations, advice..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring"
          />
        </div>

        {/* ================= PRESCRIPTION ================= */}
        <div>
          <label className=" font-medium mb-1 flex items-center gap-2">
            <FaFilePrescription />
            Prescription
          </label>
          <textarea
            rows={4}
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Medicines, dosage, instructions..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring"
          />
        </div>

        {/* ================= FOLLOW UP ================= */}
        <div>
          <label className=" font-medium mb-1 flex items-center gap-2">
            <FaCalendarAlt />
            Follow-up After (Days)
          </label>
          <input
            type="number"
            min="1"
            value={followUpAfterDays}
            onChange={(e) => setFollowUpAfterDays(e.target.value)}
            placeholder="e.g. 7"
            className="w-40 border rounded-lg p-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional – reminder will be sent automatically
          </p>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className=" bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white px-6 py-2 rounded-lg hover:bg-teal-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Summary"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg border hover:bg-linear-to-br from-[#f72222] to-[#c20808] cursor-pointer hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorNotesPage;
