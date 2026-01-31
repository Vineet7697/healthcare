

import { useState } from "react";
import { validatePasswordFields } from "../../../controllers/FormValidation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { ChangePasswordApi } from "../../../services/patient/profile/ChangePasswordApi";
import { useNavigate } from "react-router-dom";
const DoctorChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // 👁️ Password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();
   const handleSubmit = async (e) => {
      e.preventDefault();
  
      const validateChangePassword = () => {
        const errors = {};
  
        if (!currentPassword)
          errors.currentPassword = "Current password required";
        if (!newPassword) errors.newPassword = "New password required";
        if (newPassword !== confirmPassword)
          errors.confirmPassword = "Passwords do not match";
  
        return errors;
      };
  
      // ✅ VALIDATION
      const validationErrors = validateChangePassword();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length !== 0) return;
  
      // ✅ API CALL (SIRF EK BAAR)
      try {
        const res = await ChangePasswordApi({
          currentPassword,
          newPassword,
          confirmPassword,
        });
        
        toast.success(res.message);
        navigate("/doctordashboard/dashboard");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to change password");
      }
    };

  if (!showForm) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-blue-50 px-4 ">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.currentPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showCurrent ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showNew ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => navigate("/client/dashboard")}
              className="w-full  bg-red-500 text-white cursor-pointer font-semibold py-2.5 rounded-md"
            >
              Cancel
            </button>

            {/* Update Password Button */}
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-md cursor-pointer font-semibold"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorChangePassword;
