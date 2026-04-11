import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { notify } from "../../../utils/notify";

const AddPrescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);

  /* ================= LOAD EXISTING PRESCRIPTION ================= */
  useEffect(() => {
    const loadPrescription = async () => {
      setFetchLoading(true);
      try {
        const res = await api.get(`/doctor/prescription/${id}`);
        if (res.data) {
          setMedicines(res.data.medicines || "");
          setInstructions(res.data.instructions || "");
           setIsUpdate(true);
        }
      } catch {
        console.log("No previous prescription");
      } finally {
        setFetchLoading(false);
      }
    };
    loadPrescription();
  }, [id]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!medicines.trim() && !instructions.trim()) {
      notify.info("Please add medicines or instructions");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/doctor/appointments/${id}/prescription`, {
        medicines,
        instructions,
      });

      notify.success(res.data?.message || "Prescription saved successfully");
      navigate("/doctordashboard/livequeue");
    } catch (error) {
      console.error(error);
      notify.error("Failed to save prescription");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading prescription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Add Prescription</h2>

      <div className="mb-4">
        <label className="block text-gray-600 mb-1">Medicines</label>
        <textarea
          value={medicines}
          onChange={(e) => setMedicines(e.target.value)}
          placeholder="Example: Paracetamol 500mg - twice daily"
          className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-600 mb-1">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Take after food. Drink plenty of water."
          className="w-full border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading
            ? "Saving..."
            : isUpdate
              ? "Update Prescription"
              : "Save Prescription"}
        </button>
      </div>
    </div>
  );
};

export default AddPrescription;
