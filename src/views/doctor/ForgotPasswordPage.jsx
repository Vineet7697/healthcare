import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [doctorId, setDoctorId] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedDoctors = JSON.parse(localStorage.getItem("doctors")) || [];

    const doctorExists = storedDoctors.find(
      (doc) => doc.doctorId === doctorId
    );

    if (!doctorExists) {
      setError("Doctor ID not found.");
      setSuccessMsg("");
      return;
    }

    // In real app → Send OTP or Reset Link
    setError("");
    setSuccessMsg(
      "Password reset link has been sent! (Demo: You can now set a new password.)"
    );

    setTimeout(() => {
      navigate("/resetpassword"); // Aap alag Reset Password page bana sakte ho
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 md:p-8">

        {/* Title */}
        <h1 className="text-center text-xl md:text-2xl font-semibold text-teal-600">
          Forgot Password
        </h1>
        <div className="w-16 h-1 bg-teal-500 mx-auto mt-2 rounded-full"></div>

        <p className="text-gray-600 text-center text-sm mt-3">
          Enter your registered Doctor ID to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Doctor ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Doctor ID / Mobile Number
            </label>
            <input
              type="text"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              placeholder="Enter your Doctor ID"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 outline-none ${
                error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-teal-400"
              }`}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Success Message */}
          {successMsg && (
            <p className="text-green-600 text-sm">{successMsg}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-600 transition"
          >
            Reset Password
          </button>

          {/* Back to Login */}
          <p className="text-center text-gray-600 text-sm mt-3">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/DoctorloginPage")}
              className="text-blue-500 hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
