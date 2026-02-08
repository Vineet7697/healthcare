import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateLoginForm } from "../../controllers/FormValidation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { patientLoginApi } from "../../services/patient/PatientLoginApi";
import { jwtDecode } from "jwt-decode";
import { FaGoogle } from "react-icons/fa";

const ClientLoginPage = () => {
  // ✅ identifier = phone OR email
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    toast.info("Forgot Password (frontend only)");
  };

  const handleGoogleLogin = () => {
    toast.info("Google Login (frontend only)");
  };

  // 🔹 Identifier change (phone/email)
  const handleIdentifierChange = (e) => {
    const value = e.target.value;
    setIdentifier(value);
    setErrors(validateLoginForm({ identifier: value, password }));
  };

  // 🔹 Password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(validateLoginForm({ identifier, password: value }));
  };

  // 🔹 LOGIN

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await patientLoginApi({ identifier, password });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // ✅ TOKEN SE ROLE NIKAALO
      const decoded = jwtDecode(token);
      const role = decoded.role?.toUpperCase();

      const loggedInUser = {
        role,
        identifier,
      };

      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

      toast.success("Login successful");

      // ✅ ROLE BASED REDIRECT
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "PATIENT") {
        navigate("/client/dashboard");
      } else {
        toast.error("Unauthorized role");
      }
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-blue-50 px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Login to{" "}
            <img
              src="/images/yo.png"
              alt="YoDoctor"
              className="h-10 inline align-middle"
            />
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          {/* Phone / Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number / Email
            </label>

            <input
              type="text"
              value={identifier}
              placeholder="Enter phone number or email"
              onChange={handleIdentifierChange}
              className={`w-full pl-4 pr-4 py-2 border rounded-lg outline-none focus:border-[#2277f7] focus:border-2 ${
                errors.identifier ? "border-red-500" : "border-gray-300"
              }`}
            />

            {errors.identifier && (
              <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              onChange={handlePasswordChange}
              className={`w-full pl-4 pr-4 py-2 border rounded-lg outline-none focus:border-[#2277f7] focus:border-2 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9.5 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-red-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="w-full bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white py-2 rounded-md cursor-pointer"
          >
            Login
          </button>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="
    w-full
    flex items-center justify-center gap-3
    border-2 border-gray-400
    rounded-full
    py-2
    bg-white
    hover:bg-gray-50
    transition
  "
          >
            {/* Google Icon */}
            <img src="/images/google.png" alt="Google" className="h-6 w-6" />

            {/* Text */}
            <span className="text-gray-800 font-medium text-lg">
              Sign in with Google
            </span>
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/clientregisterpage")}
              className="text-blue-500 hover:underline"
            >
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ClientLoginPage;
