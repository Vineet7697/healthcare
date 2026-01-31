import React, { useState } from "react";
import { validateDoctorRegistration } from "../../controllers/FormValidation";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { DoctorSignupApi } from "../../services/doctor/DoctorSignupApi";

const DoctorRegistrationPage = () => {
  const [formValues, setFormValues] = useState({
    doctorName: "",
    clinicName: "",
    licenseNumber: "",
    degree: "",
    specialization: "",
    address: "",
    city: "",
    consultationFee: "",
    timings: "",
    availableDays: [],
    password: "",
    confirmPassword: "",
    email: "",

    // backend required (UI me nahi)
    phone: "",
    experienceYears: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);

    const fieldError = validateDoctorRegistration(updatedValues);
    setErrors({ ...errors, [name]: fieldError[name] });
  };

  const handleCheckboxChange = (day) => {
    const newDays = formValues.availableDays.includes(day)
      ? formValues.availableDays.filter((d) => d !== day)
      : [...formValues.availableDays, day];

    const updatedValues = { ...formValues, availableDays: newDays };
    setFormValues(updatedValues);

    const fieldError = validateDoctorRegistration(updatedValues);
    setErrors({ ...errors, availableDays: fieldError.availableDays });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateDoctorRegistration(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return;

    // ✅ payload FIRST
    const payload = {
      placeType: "CLINIC",
      placeName: formValues.clinicName,

      doctorName: formValues.doctorName,
      degree: formValues.degree,
      licenseNumber: formValues.licenseNumber,
      specialization: formValues.specialization,

      city: formValues.city,
      address: formValues.address,

      consultationFee: Number(formValues.consultationFee),
      timings: formValues.timings,

      availableDays: formValues.availableDays.map((d) => d.toUpperCase()),

      experienceYears: Number(formValues.experienceYears || 0),
      email: formValues.email,
      phone: formValues.phone || "9999999999",

      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
    };

    try {
      await DoctorSignupApi(payload); // ✅ now safe

      toast.success("Registration successful! Awaiting admin approval.");
      navigate("/approvalstatuspage");
    } catch (error) {
      toast.error(error?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-blue-50 px-3 py-6 mt-16">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-6 md:p-10">
        {/* Title Section */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-[#2277f7] leading-tight">
            Register Your Clinic on Yo Doctor
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor Information */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 border-b pb-1">
              Doctor Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="doctorName"
                  value={formValues.doctorName}
                  onChange={handleChange}
                  placeholder="Enter doctor's full name"
                  className={`w-full border rounded-lg px-3 py-2 text-sm  outline-none focus:border-2 focus:border-[#2277f7] ${
                    errors.doctorName ? "border-red-500" : "border-gray-300 "
                  }`}
                />
                {errors.doctorName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.doctorName}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Degree
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formValues.degree}
                  onChange={handleChange}
                  placeholder="e.g., MBBS, MD"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 outline-none focus:border-[#2277f7] ${
                    errors.degree
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#2277f7]"
                  }`}
                />
                {errors.degree && (
                  <p className="text-red-500 text-xs mt-1">{errors.degree}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formValues.licenseNumber}
                  onChange={handleChange}
                  placeholder="Enter license number"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 outline-none focus:border-[#2277f7] ${
                    errors.licenseNumber
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#2277f7]"
                  }`}
                />
                {errors.licenseNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.licenseNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formValues.specialization}
                  onChange={handleChange}
                  placeholder="e.g., Cardiologist"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:border-2 focus:border-[#2277f7] outline-none"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 focus:border-[#2277f7] outline-none ${
                    errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* phone */}
              <div className="relative">
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Phone
                </label>
                <input
                  type="number"
                  name="phone"
                  value={formValues.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 focus:border-[#2277f7] outline-none ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formValues.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 outline-none focus:border-[#2277f7] ${
                      errors.password
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-[#2277f7]"
                    }`}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formValues.confirmPassword} // ✅ correct
                    onChange={handleChange}
                    placeholder="Enter confirm password"
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 outline-none focus:border-[#2277f7] ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-[#2277f7]"
                    }`}
                  />

                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Clinic Information */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 border-b pb-1">
              Clinic Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Clinic Name
                </label>
                <input
                  type="text"
                  name="clinicName"
                  value={formValues.clinicName}
                  onChange={handleChange}
                  placeholder="Enter clinic name"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 outline-none focus:border-[#2277f7] ${
                    errors.clinicName
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#2277f7]"
                  }`}
                />
                {errors.clinicName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.clinicName}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formValues.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 outline-none focus:border-[#2277f7] ${
                    errors.city
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#2277f7]"
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 outline-none focus:border-[#2277f7] ${
                    errors.address
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#2277f7]"
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>
          {/* Consultation Details */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 border-b pb-1">
              Consultation Details
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Consultation Fee (₹)
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formValues.consultationFee}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 outline-none focus:border-[#2277f7] ${
                    errors.consultationFee
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#2277f7]"
                  }`}
                />
                {errors.consultationFee && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.consultationFee}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-gray-600 text-sm font-medium">
                  Timings
                </label>
                <input
                  type="text"
                  name="timings"
                  value={formValues.timings}
                  onChange={handleChange}
                  placeholder="e.g., 10 AM - 5 PM"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-2 outline-none focus:border-[#2277f7] ${
                    errors.timings
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#2277f7]"
                  }`}
                />
                {errors.timings && (
                  <p className="text-red-500 text-xs mt-1">{errors.timings}</p>
                )}
              </div>
            </div>
            {/* Available Days */}
            <div className="mt-4">
              <label className="block mb-1 text-gray-600 text-sm font-medium">
                Available Days
              </label>

              <div className="flex flex-wrap gap-4 text-sm">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={formValues.availableDays.includes(day)}
                        onChange={() => handleCheckboxChange(day)}
                        className="accent-teal-500"
                      />
                      {day}
                    </label>
                  )
                )}
              </div>

              {errors.availableDays && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.availableDays}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-linear-to-br from-[#2277f7] to-[#52abd4] font-bold text-white py-2.5 rounded-lg text-sm md:text-base  cursor-pointer"
            >
              Submit Registration
            </button>

            <p className="text-xs text-gray-500 mt-3">
              Admin will verify and approve within 24 hours.
            </p>

            <p className="mt-4 text-gray-500 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/DoctorloginPage")}
                className="text-blue-500 font-medium hover:underline cursor-pointer"
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistrationPage;
