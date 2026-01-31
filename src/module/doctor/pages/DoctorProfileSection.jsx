import React, { useState } from "react";
import {
  FaUser,
  FaHospital,
  FaBook,
  FaStethoscope,
  FaMapMarkerAlt,
  FaCity,
  FaRupeeSign,
  FaClock,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import useDoctorProfile from "../../../hooks/doctorHooks/useDoctorProfile";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const DoctorProfileSection = () => {
  const {
    profile,
    profileImage,
    loading,
    handleImageChange,
    removeProfileImage,
    handleChange,
    saveProfile,
  } = useDoctorProfile();

  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-4xl">
        <h2 className="text-2xl text-center mb-8 font-semibold text-gray-700">
          Doctor Profile
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowConfirm(true);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ================= PROFILE IMAGE ================= */}
            <div className="flex flex-col items-center">
              <img
                src={profileImage || DEFAULT_AVATAR}
                className="w-32 h-32 rounded-full object-cover border"
              />

              <div className="flex gap-4 mt-3">
                <label className="cursor-pointer text-blue-600 flex items-center gap-1">
                  <FaEdit />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>

                {profileImage !== DEFAULT_AVATAR && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            {/* ================= PROFILE FIELDS ================= */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                icon={<FaUser />}
                name="doctorName"
                value={profile.doctorName}
                onChange={handleChange}
              />
              <Input
                icon={<FaHospital />}
                name="clinicName"
                value={profile.clinicName}
                readOnly
              />
              <Input
                icon={<FaBook />}
                name="degree"
                value={profile.degree}
                onChange={handleChange}
              />
              <Input
                icon={<FaStethoscope />}
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
              />
              <Input
                icon={<FaEnvelope />}
                name="email"
                value={profile.email}
                onChange={handleChange}
                readOnly
              />
              <Input
                icon={<FaPhone />}
                name="mobile"
                value={profile.mobile}
                onChange={handleChange}
                readOnly
              />

              <Input
                icon={<FaCity />}
                name="city"
                value={profile.city}
                onChange={handleChange}
              />
              <Textarea
                icon={<FaMapMarkerAlt />}
                name="address"
                value={profile.address}
                onChange={handleChange}
              />
              <Input
                icon={<FaRupeeSign />}
                name="consultationFee"
                value={profile.consultationFee}
                onChange={handleChange}
              />
              <Input
                icon={<FaClock />}
                name="timings"
                value={profile.timings}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:opacity-90">
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Update profile?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            const ok = await saveProfile();
            if (ok) setShowConfirm(false);
          }}
        />
      )}
    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const Input = ({ icon, readOnly, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
    <input
      {...props}
      readOnly={readOnly}
      className={`w-full pl-10 p-2 border rounded-lg ${
        readOnly ? "bg-gray-100" : ""
      }`}
    />
  </div>
);

const Textarea = ({ icon, ...props }) => (
  <div className="relative md:col-span-2">
    <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
    <textarea
      {...props}
      rows="2"
      className="w-full pl-10 p-2 border rounded-lg"
    />
  </div>
);

const ConfirmModal = ({ title, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-80 text-center">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex justify-center gap-4 mt-4">
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded cursor-pointer hover:bg-gray-400">
          No
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
);

export default DoctorProfileSection;
