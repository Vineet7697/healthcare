import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { MdWc } from "react-icons/md";
import {
  uploadProfileImageApi,
  getProfileImageApi,
  updateProfileImageApi,
  deleteProfileImageApi,
} from "../../../services/PatientProfileImageApi";
import { PatientGetProfileApi } from "../../../services/patient/profile/PatientGetProfileApi";
import { PatientUpdateProfileApi } from "../../../services/patient/profile/PatientUpdateProfileApi";
const ConfirmModal = ({ text, onNo, onYes }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
        <h3 className="text-lg font-semibold mb-4">{text}</h3>

        <div className="flex justify-center gap-4">
          <button onClick={onNo} className="bg-gray-300 px-4 py-2 rounded-lg">
            No
          </button>

          <button
            onClick={onYes}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE UI COMPONENTS ================= */

const Input = ({ icon, ...props }) => (
  <div className="relative">
    <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
    <input
      {...props}
      className="w-full pl-10 border rounded-lg p-2 outline-none focus:ring focus:ring-blue-200"
    />
  </div>
);

const confirmUpdateProfile = async () => {
  try {
    const payload = {
      fullName: profile.name,
      phone: profile.phone,
      gender: profile.gender,
      dob: profile.dob,
    };

    await PatientUpdateProfileApi(payload);

    toast.success("Profile updated successfully!");
    setShowUpdateModal(false);

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        role: "PATIENT",
        name: profile.name,
        phone: profile.phone,
      }),
    );
  } catch (error) {
    console.error(error);
    toast.error("Failed to update profile");
  }
};
/* ================= MAIN COMPONENT ================= */

const ProfileSection = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const DEFAULT_AVATAR = "/images/default-avatar.png";
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    avatar: "/images/default-avatar.png",
  });

 const [profileImage, setProfileImage] = useState(
  localStorage.getItem("profileImage") || "/images/default-avatar.png"
);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const navigate = useNavigate();
  /* ================= DOB FORMAT FIX ================= */
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  /* ================= LOAD PROFILE ================= */
useEffect(() => {
  const fetchProfileAndImage = async () => {
    try {
      // 1️⃣ Profile data
      const data = await PatientGetProfileApi();

      setProfile((prev) => ({
        ...prev,
        id: data.id,
        name: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "",
        dob: formatDateForInput(data.dob),
      }));

      // 2️⃣ Image data (MOST IMPORTANT)
      const imgRes = await getProfileImageApi();

      if (imgRes.data?.imageUrl) {
        const fullUrl = `${import.meta.env.VITE_API_URL}/${imgRes.data.imageUrl}`;

        setProfileImage(fullUrl);
        localStorage.setItem("profileImage", fullUrl);
      } else {
        setProfileImage("/images/default-avatar.png");
      }
    } catch (err) {
      console.error(err);
      setProfileImage("/images/default-avatar.png");
    }
  };

  fetchProfileAndImage();
}, []);


  /* ================= IMAGE UPLOAD (UI ONLY) ================= */
const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    let res;

    const hasCustomImage =
      profileImage &&
      !profileImage.includes("default-avatar");

    // 🔥 decide upload vs update
    if (hasCustomImage) {
      res = await updateProfileImageApi(file);
    } else {
      res = await uploadProfileImageApi(file);
    }

    // 🔥 MOST IMPORTANT LINE
    const fullUrl = `${import.meta.env.VITE_API_URL}/${res.data.imageUrl}?t=${Date.now()}`;

    // 🔥 FORCE React to re-render with NEW src
    setProfileImage(""); // reset first (important)
    setTimeout(() => {
      setProfileImage(fullUrl);
    }, 0);

    localStorage.setItem("profileImage", fullUrl);

    toast.success("Profile image updated");
  } catch (err) {
    console.error(err);
    toast.error("Image update failed");
  }
};


  /* ================= REMOVE IMAGE ================= */
 const handleRemoveImage = async () => {
  try {
    await deleteProfileImageApi(); // 🔥 BACKEND CALL

    const defaultImage = "/images/default-avatar.png";

    setProfileImage(defaultImage);
    localStorage.removeItem("profileImage");

    setShowDeleteModal(false);
    toast.success("Profile image removed");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete profile image");
  }
}
  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* ================= OPEN CONFIRM ================= */
  const handleUpdateClick = (e) => {
    e.preventDefault();
    setShowUpdateModal(true);
  };

  /* ================= CONFIRM UPDATE ================= */
  const confirmUpdateProfile = async () => {
    try {
      const payload = {
        fullName: profile.name,
        phone: profile.phone,
        gender: profile.gender,
        dob: profile.dob,
      };

      await PatientUpdateProfileApi(payload);

      toast.success("Profile updated successfully!");
      setShowUpdateModal(false);

      // 🔹 localStorage minimal update (optional)
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          role: "PATIENT",
          name: profile.name,
          phone: profile.phone,
        }),
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  /* ================= UI (UNCHANGED) ================= */
  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] py-10 px-4 relative">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          My Profile
        </h2>

        <form onSubmit={handleUpdateClick}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col items-center">
              <img
                src={profileImage || DEFAULT_AVATAR}
                className="w-32 h-32 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  e.target.onerror = null; // 🔴 VERY IMPORTANT
                  // e.target.src = DEFAULT_AVATAR;
                }}
              />

              <div className="flex gap-4 mt-3">
                <label className="cursor-pointer text-blue-600">
                  <FaEdit size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="text-red-500 cursor-pointer"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                icon={<FaUser />}
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Full Name"
              />
              <Input
                icon={<FaEnvelope />}
                name="email"
                value={profile.email}
                readOnly
              />
              <div className="relative">
                <span className="absolute left-3 top-3 text-2xl text-gray-400">
                  <MdWc/>
                </span>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full pl-10 border rounded-lg p-2 outline-none focus:ring focus:ring-blue-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input
                icon={<FaCalendarAlt />}
                type="date"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
              />
              <Input
                icon={<FaPhone />}
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Mobile No."
                readOnly
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
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <ConfirmModal
          text="Are you sure you want to delete your profile image?"
          onNo={() => setShowDeleteModal(false)}
          onYes={handleRemoveImage}
        />
      )}

      {showUpdateModal && (
        <ConfirmModal
          text="Are you sure you want to update your profile?"
          onNo={() => setShowUpdateModal(false)}
          onYes={confirmUpdateProfile}
        />
      )}
    </div>
  );
};

export default ProfileSection;
