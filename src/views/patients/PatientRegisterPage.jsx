import React, { useState } from "react";
import { CalendarDays, User, Mail, Lock, Phone } from "lucide-react";
import { INPUT_BASE_CLASS } from "../../const/Signup_login";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { validateRegisterForm } from "../../controllers/FormValidation";
import { toast } from "react-toastify";
import { PatientSignupApi } from "../../services/patient/PatientSignupApi";

const ClientRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    confirmPassword: "",
    // role: "PATIENT",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ REGISTER → data.json (/users)

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        gender: formData.gender.toUpperCase(),
        dob: formData.dob,
      };

      console.log("REGISTER PAYLOAD 👉", payload);

      const res = await PatientSignupApi(payload);

      console.log("REGISTER RESPONSE 👉", res.data);

      toast.success("Registration successful!");
      navigate("/clientloginpage");
    } catch (error) {
      console.error("REGISTER ERROR 👉", error);
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 relative flex items-center justify-center overflow-hidden mt-16">
      <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-tr-full rounded-br-full"></div>

      <div className="relative z-10 bg-white shadow-2xl rounded-3xl md:flex max-w-5xl w-full mx-4 md:mx-0">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 ">
            Create Patient Account
          </h2>
          <p className="text-gray-500 mb-8">
            Join us to manage your health with ease.
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className={`${INPUT_BASE_CLASS} ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`${INPUT_BASE_CLASS} ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                placeholder="Enter mobile number"
                className={`${INPUT_BASE_CLASS} ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Gender */}
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 pr-10 py-2 text-md outline-none
      focus:border-2 focus:border-[#2277f7]
      ${errors.gender ? "border-red-500" : "border-gray-300"}
    `}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            {/* DOB */}
            <div className="relative">
              <CalendarDays className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`${INPUT_BASE_CLASS} ${
                  errors.dob ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dob && (
                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`${INPUT_BASE_CLASS} ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`${INPUT_BASE_CLASS} ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-[#2277f7] to-[#52abd4] cursor-pointer text-white py-2 rounded-full font-semibold"
            >
              Register & Continue
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/clientLoginpage")}
              className="text-blue-500 font-medium hover:underline cursor-pointer"
            >
              Login here
            </button>
          </p>
        </div>

        {/* Illustration (unchanged) */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-r-3xl">
          <div className="w-72 h-72 bg-[url('https://cdn3d.iconscout.com/3d/premium/thumb/doctor-with-patient-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--consultation-medicine-illustrations-4323381.png')] bg-contain bg-no-repeat bg-center"></div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegisterPage;
