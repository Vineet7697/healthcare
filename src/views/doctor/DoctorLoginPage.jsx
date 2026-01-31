

import React, { useState } from "react";
import { validateDoctorLogin } from "../../controllers/FormValidation";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { DoctorLoginApi } from "../../services/doctor/DoctorLoginApi";

const DoctorLoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [formValues, setFormValues] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = { ...formValues, [name]: value };
    setFormValues(updated);

    const fieldErrors = validateDoctorLogin(updated);
    setErrors({ ...errors, [name]: fieldErrors[name] });
  };

  /* ================= LOGIN ================= */
const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await DoctorLoginApi({
      identifier: formValues.identifier,
      password: formValues.password,
    });

    // 🔥 BACKEND RESPONSE KE HISAB SE
    const { user, token } = res;

    // 🔥 EXACT & SAFE STORAGE
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        id: user.id,          // ✅ 28
        role: user.role,      // ✅ DOCTOR
        name: user.email,     // ya doctorName agar future me aaye
        phone: user.mobile,
      })
    );

    localStorage.setItem("token", token);

    window.dispatchEvent(new Event("userLogin"));

    toast.success("Doctor login successful");
    navigate("/doctordashboard");
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Invalid email/mobile or password"
    );
  }
};


  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-blue-50">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-11/12 max-w-5xl md:flex">
        {/* LEFT */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-[#2277f7] mb-6 text-center">
            Yo Doctor
          </h1>

          <h2 className="text-2xl font-semibold text-gray-700 mb-8 text-center">
            Doctor / Clinic Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL / MOBILE */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email / Mobile Number
              </label>


              <input
                type="text"
                name="identifier"
                value={formValues.identifier}
                placeholder="Enter email or mobile number"
                onChange={handleChange}
                className={`w-full pl-4 pr-4 py-2 border rounded-lg outline-none focus:border-[#2277f7] focus:border-2 ${
                  errors.identifier ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.identifier}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>


              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full pl-4 pr-4 py-2 border rounded-lg outline-none focus:border-[#2277f7] focus:border-2 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* REMEMBER / FORGOT */}
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
                onClick={() => navigate("/forgotpassword")}
                className="text-red-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full bg-linear-to-br from-[#2277f7] to-[#52abd4] font-bold text-white py-2 rounded-full"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => navigate("/doctorregistrationpage")}
                className="w-full border border-[#2277f7] font-bold text-[#2277f7] py-2 rounded-full"
              >
                Register
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex w-1/2 bg-teal-100 items-center justify-center">
          <img
            src="/images/doctorclinic.jpg"
            alt="doctor"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorLoginPage;
