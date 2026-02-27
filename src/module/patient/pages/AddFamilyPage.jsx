import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import FamilyService from "../../../services/FamilyService";

const AddFamilyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [familyMember, setFamilyMember] = useState({
    fullName: "",
    gender: "",
    dob: "",
    heightCm: "",
    weightKg: "",
    bloodGroup: "",
    relation: "",
  });

  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= FETCH (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEdit) return;

    const fetchMember = async () => {
      try {
        const data = await FamilyService.getById(id);
        setFamilyMember(data);
      } catch {
        toast.error("Failed to load family member");
      }
    };

    fetchMember();
  }, [id, isEdit]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFamilyMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= UPDATE ================= */
  const submitUpdate = async () => {
    try {
      setLoading(true);
      await FamilyService.update(id, familyMember);
      toast.success("Family member updated successfully!");
      navigate(-1);
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
      setShowUpdateConfirm(false);
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!familyMember.fullName.trim()) newErrors.fullName = "Required";
    if (!familyMember.gender) newErrors.gender = "Required";
    if (!familyMember.dob) newErrors.dob = "Required";
    if (!familyMember.relation) newErrors.relation = "Required";
    if (!familyMember.bloodGroup) newErrors.bloodGroup = "Required";

    if (!familyMember.heightCm || Number(familyMember.heightCm) <= 0)
      newErrors.heightCm = "Valid height required";

    if (!familyMember.weightKg || Number(familyMember.weightKg) <= 0)
      newErrors.weightKg = "Valid weight required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEdit) {
      setShowUpdateConfirm(true);
      return;
    }

    try {
      setLoading(true);
      await FamilyService.create(familyMember);
      toast.success("Family member added successfully!");
      navigate(-1);
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONFIRM MODAL ================= */
  const ConfirmModal = ({ text, onYes, onNo }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onNo} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6 z-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Confirm Action
        </h3>
        <p className="text-gray-600 mb-6">{text}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onNo}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            No
          </button>
          <button
            onClick={onYes}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );

return (
  <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex justify-center">
    <div className="w-full max-w-3xl">

      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-8">

        {/* HEADER */}
        <div className="flex items-center justify-center gap-2 px-6 py-4 border-b">
          <UserPlus className="text-blue-600" size={18} />
          <h2 className="font-bold text-slate-800 text-lg sm:text-xl">
            {isEdit ? "Update Member" : "Add New Member"}
          </h2>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
        >

          {/* Full Name */}
          <div>
            <label className="font-semibold text-slate-600 text-sm">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="fullName"
              value={familyMember.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="font-semibold text-slate-600 text-sm">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={familyMember.gender}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="font-semibold text-slate-600 text-sm">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={familyMember.dob}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>

          {/* Blood Group */}
          <div>
            <label className="font-semibold text-slate-600 text-sm">
              Blood Group <span className="text-red-500">*</span>
            </label>
            <select
              name="bloodGroup"
              value={familyMember.bloodGroup}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
            {errors.bloodGroup && (
              <p className="text-red-500 text-xs mt-1">{errors.bloodGroup}</p>
            )}
          </div>

          {/* Relation */}
          <div>
            <label className="font-semibold text-slate-600 text-sm">
              Relation <span className="text-red-500">*</span>
            </label>
            <select
              name="relation"
              value={familyMember.relation}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Relation</option>
              <option>FATHER</option>
              <option>MOTHER</option>
              <option>SPOUSE</option>
              <option>SON</option>
              <option>DAUGHTER</option>
              <option>BROTHER</option>
              <option>SISTER</option>
              <option>OTHER</option>
            </select>
            {errors.relation && (
              <p className="text-red-500 text-xs mt-1">{errors.relation}</p>
            )}
          </div>

          {/* Height */}
          <div>
            <label className="font-semibold text-slate-600 text-sm">
              Height (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="heightCm"
              value={familyMember.heightCm}
              onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.heightCm && (
              <p className="text-red-500 text-xs mt-1">{errors.heightCm}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="font-semibold text-slate-600 text-sm">
              Weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="weightKg"
              value={familyMember.weightKg}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.weightKg && (
              <p className="text-red-500 text-xs mt-1">{errors.weightKg}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-400 cursor-pointer text-slate-700 font-medium hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow cursor-pointer"
            >
              {isEdit ? "Update Member" : "Save Member"}
            </button>
          </div>

        </form>
      </div>

      {showUpdateConfirm && (
        <ConfirmModal
          text="Are you sure you want to update this family member?"
          onNo={() => setShowUpdateConfirm(false)}
          onYes={submitUpdate}
        />
      )}

    </div>
  </div>
);
};

export default AddFamilyPage;
