// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import {
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaCalendarAlt,
//   FaEdit,
//   FaTrash,
// } from "react-icons/fa";
// import { MdWc } from "react-icons/md";

// import {
//   uploadProfileImageApi,
//   getProfileImageApi,
//   updateProfileImageApi,
//   deleteProfileImageApi,
// } from "../../../services/PatientProfileImageApi";
// import { PatientGetProfileApi } from "../../../services/patient/profile/PatientGetProfileApi";
// import { PatientUpdateProfileApi } from "../../../services/patient/profile/PatientUpdateProfileApi";

// /* ================= CONSTANTS ================= */
// const DEFAULT_AVATAR = "/images/default-avatar.png";

// /* ================= HELPERS ================= */
// const buildImageUrl = (path) => {
//   if (!path) return DEFAULT_AVATAR;
//   if (path.startsWith("http")) return path;

//   const base = import.meta.env.VITE_API_URL.replace(/\/$/, "");
//   const cleanPath = path.replace(/^\//, "");

//   return `${base}/${cleanPath}`;
// };

// /* ================= CONFIRM MODAL ================= */
// const ConfirmModal = ({ text, onNo, onYes }) => (
//   <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
//     <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
//       <h3 className="text-lg font-semibold mb-4">{text}</h3>
//       <div className="flex justify-center gap-4">
//         <button onClick={onNo} className="bg-gray-300 px-4 py-2 rounded-lg">
//           No
//         </button>
//         <button
//           onClick={onYes}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//         >
//           Yes
//         </button>
//       </div>
//     </div>
//   </div>
// );

// /* ================= INPUT ================= */
// const Input = ({ icon, ...props }) => (
//   <div className="relative">
//     <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
//     <input
//       {...props}
//       className="w-full pl-10 border rounded-lg p-2 outline-none focus:ring focus:ring-blue-200"
//     />
//   </div>
// );

// /* ================= MAIN COMPONENT ================= */
// const ProfileSection = () => {
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState({
//     id: "",
//     name: "",
//     email: "",
//     phone: "",
//     gender: "",
//     dob: "",
//   });

//   const [profileImage, setProfileImage] = useState(
//     localStorage.getItem("profileImage") || DEFAULT_AVATAR
//   );

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);

//   /* ================= DATE FORMAT ================= */
//   const formatDateForInput = (iso) =>
//     iso ? new Date(iso).toISOString().split("T")[0] : "";

//   /* ================= LOAD PROFILE + IMAGE ================= */
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const data = await PatientGetProfileApi();

//         setProfile({
//           id: data.id,
//           name: data.fullName || "",
//           email: data.email || "",
//           phone: data.phone || "",
//           gender: data.gender || "",
//           dob: formatDateForInput(data.dob),
//         });

//         const imgRes = await getProfileImageApi();
//         const imageUrl = buildImageUrl(imgRes?.data?.imageUrl);

//         setProfileImage(imageUrl);
//         localStorage.setItem("profileImage", imageUrl);
//       } catch (err) {
//         console.error(err);
//         setProfileImage(DEFAULT_AVATAR);
//       }
//     };

//     loadData();
//   }, []);

//   /* ================= IMAGE UPLOAD ================= */
//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       const hasCustomImage = !profileImage.includes("default-avatar");

//       const res = hasCustomImage
//         ? await updateProfileImageApi(file)
//         : await uploadProfileImageApi(file);

//       const fullUrl = `${buildImageUrl(res.data.imageUrl)}?t=${Date.now()}`;

//       setProfileImage(fullUrl);
//       localStorage.setItem("profileImage", fullUrl);

//       toast.success("Profile image updated");
//     } catch (err) {
//       console.error(err);
//       toast.error("Image update failed");
//     }
//   };

//   /* ================= IMAGE DELETE ================= */
//   const handleRemoveImage = async () => {
//     try {
//       await deleteProfileImageApi();

//       setProfileImage(DEFAULT_AVATAR);
//       localStorage.removeItem("profileImage");

//       setShowDeleteModal(false);
//       toast.success("Profile image removed");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete image");
//     }
//   };

//   /* ================= INPUT CHANGE ================= */
//   const handleChange = (e) =>
//     setProfile({ ...profile, [e.target.name]: e.target.value });

//   /* ================= UPDATE PROFILE ================= */
//   const confirmUpdateProfile = async () => {
//     try {
//       await PatientUpdateProfileApi({
//         fullName: profile.name,
//         phone: profile.phone,
//         gender: profile.gender,
//         dob: profile.dob,
//       });

//       toast.success("Profile updated");
//       setShowUpdateModal(false);

//       localStorage.setItem(
//         "loggedInUser",
//         JSON.stringify({
//           role: "PATIENT",
//           name: profile.name,
//           phone: profile.phone,
//         })
//       );
//     } catch (err) {
//       console.error(err);
//       toast.error("Profile update failed");
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen flex justify-center items-center bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] py-10 px-4">
//       <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl">
//         <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
//           My Profile
//         </h2>

//         <form onSubmit={(e) => e.preventDefault()}>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Avatar */}
//             <div className="flex flex-col items-center">
//               <img
//                 src={profileImage}
//                 className="w-32 h-32 rounded-full object-cover border"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = DEFAULT_AVATAR;
//                 }}
//               />

//               <div className="flex gap-4 mt-3">
//                 <label className="cursor-pointer text-blue-600">
//                   <FaEdit />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={handleImageChange}
//                   />
//                 </label>

//                 <button
//                   type="button"
//                   onClick={() => setShowDeleteModal(true)}
//                   className="text-red-500"
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             </div>

//             {/* Details */}
//             <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Input
//                 icon={<FaUser />}
//                 name="name"
//                 value={profile.name}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//               />
//               <Input
//                 icon={<FaEnvelope />}
//                 name="email"
//                 value={profile.email}
//                 readOnly
//               />

//               <div className="relative">
//                 <span className="absolute left-3 top-3 text-xl text-gray-400">
//                   <MdWc />
//                 </span>
//                 <select
//                   name="gender"
//                   value={profile.gender}
//                   onChange={handleChange}
//                   className="w-full pl-10 border rounded-lg p-2"
//                 >
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <Input
//                 icon={<FaCalendarAlt />}
//                 type="date"
//                 name="dob"
//                 value={profile.dob}
//                 onChange={handleChange}
//               />
//               <Input
//                 icon={<FaPhone />}
//                 name="phone"
//                 value={profile.phone}
//                 readOnly
//               />
//             </div>
//           </div>

//           <div className="flex justify-end mt-6 gap-3">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="bg-red-600 text-white px-6 py-2 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={() => setShowUpdateModal(true)}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg"
//             >
//               Update Profile
//             </button>
//           </div>
//         </form>
//       </div>

//       {showDeleteModal && (
//         <ConfirmModal
//           text="Delete profile image?"
//           onNo={() => setShowDeleteModal(false)}
//           onYes={handleRemoveImage}
//         />
//       )}

//       {showUpdateModal && (
//         <ConfirmModal
//           text="Update profile details?"
//           onNo={() => setShowUpdateModal(false)}
//           onYes={confirmUpdateProfile}
//         />
//       )}
//     </div>
//   );
// };

// export default ProfileSection;



import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  uploadProfileImageApi,
  getProfileImageApi,
  updateProfileImageApi,
  deleteProfileImageApi,
} from "../../../services/PatientProfileImageApi";
import { PatientGetProfileApi } from "../../../services/patient/profile/PatientGetProfileApi";
import { PatientUpdateProfileApi } from "../../../services/patient/profile/PatientUpdateProfileApi";
import { FaEdit,FaTrash } from "react-icons/fa";

const DEFAULT_AVATAR = "/images/default-avatar.png";

const buildImageUrl = (path) => {
  if (!path) return DEFAULT_AVATAR;
  if (path.startsWith("http")) return path;
  const base = import.meta.env.VITE_API_URL.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${base}/${cleanPath}`;
};

export default function ProfileSection() {
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const formatDateForInput = (iso) =>
    iso ? new Date(iso).toISOString().split("T")[0] : "";

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await PatientGetProfileApi();

        setFormData({
          id: data.id,
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          dob: formatDateForInput(data.dob),
        });

        const imgRes = await getProfileImageApi();
        setProfileImage(buildImageUrl(imgRes?.data?.imageUrl));
      } catch (err) {
        console.error(err);
        setProfileImage(DEFAULT_AVATAR);
      }
    };
    loadData();
  }, []);

  /* ================= IMAGE HANDLERS ================= */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const hasCustomImage = !profileImage.includes("default-avatar");

      const res = hasCustomImage
        ? await updateProfileImageApi(file)
        : await uploadProfileImageApi(file);

      const fullUrl = `${buildImageUrl(res.data.imageUrl)}?t=${Date.now()}`;
      setProfileImage(fullUrl);
      localStorage.setItem("profileImage", fullUrl);

      toast.success("Profile image updated");
    } catch {
      toast.error("Image update failed");
    }
  };

  const handleRemoveImage = async () => {
    try {
      await deleteProfileImageApi();
      setProfileImage(DEFAULT_AVATAR);
      localStorage.removeItem("profileImage");
      setShowDeleteModal(false);
      toast.success("Profile image removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const confirmUpdateProfile = async () => {
    try {
      await PatientUpdateProfileApi({
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
      });

      toast.success("Profile updated");
      setShowUpdateModal(false);
    } catch {
      toast.error("Update failed");
    }
  };

 return (
  <div className="min-h-screen bg-gray-100 font-sans flex justify-center items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-sm p-5 sm:p-8">

      {/* ================= Header ================= */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 text-center sm:text-left">

        <div className="relative">
          <img
            src={profileImage}
            onError={(e) => (e.target.src = DEFAULT_AVATAR)}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-gray-200 object-cover mx-auto sm:mx-0"
            alt=""
          />
          <input
            type="file"
            accept="image/*"
            hidden
            id="uploadImage"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {formData.fullName}
          </h2>
          <p className="text-gray-500">
            Patient ID: #{formData.id}
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
            <label
              htmlFor="uploadImage"
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl font-medium hover:bg-blue-200 cursor-pointer text-sm"
            >
              <FaEdit className="inline mr-2" />
              Edit Photo
            </label>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 text-sm"
            >
              <FaTrash className="inline mr-2" />
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* ================= Form ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

        <Input
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />

        <Input
          label="Email Address"
          name="email"
          value={formData.email}
          readOnly
        />

        <Input
          label="Mobile Number"
          name="phone"
          value={formData.phone}
          readOnly
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          />

          <Input
            label="Date of Birth"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>

      </div>

      {/* ================= Buttons ================= */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 items-center">
        <button
          onClick={() => window.location.reload()}
          className="text-gray-600 hover:text-gray-800 text-sm"
        >
          Cancel
        </button>

        <button
          onClick={() => setShowUpdateModal(true)}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 text-sm"
        >
          Update Profile
        </button>
      </div>

    </div>

    {/* ================= Modals ================= */}
    {showDeleteModal && (
      <ConfirmModal
        text="Delete profile image?"
        onNo={() => setShowDeleteModal(false)}
        onYes={handleRemoveImage}
      />
    )}

    {showUpdateModal && (
      <ConfirmModal
        text="Update profile details?"
        onNo={() => setShowUpdateModal(false)}
        onYes={confirmUpdateProfile}
      />
    )}
  </div>
);
}

/* ================= Reusable Components ================= */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">
        {label}
      </label>
      <select
        {...props}
        className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
}

function ConfirmModal({ text, onNo, onYes }) {
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
}