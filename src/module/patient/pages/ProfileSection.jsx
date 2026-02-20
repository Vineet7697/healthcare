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


import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Heart, 
  Activity, Droplets, Calendar, Edit3, 
  FileText, ShieldCheck, ChevronRight 
} from 'lucide-react';

const PatientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Main Header Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-24 bg-[#B8BBD9]/30"></div> {/* Using your preferred brand accent color */}
          
          <div className="px-8 pb-8">
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-6 gap-4">
              <div className="w-24 h-24 rounded-3xl border-4 border-white bg-slate-100 shadow-md overflow-hidden">
                <img 
                  src="/api/placeholder/100/100" 
                  alt="Patient" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
              >
                <Edit3 size={16} />
                {isEditing ? 'Save Profile' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Arjun Sharma</h1>
                  <p className="text-slate-500 text-sm">Patient ID: #YO-99210</p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Mail size={16} className="text-[#28328c]" />
                    <span>arjun.s@email.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Phone size={16} className="text-[#28328c]" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <MapPin size={16} className="text-[#28328c]" />
                    <span>Bhopal, MP, India</span>
                  </div>
                </div>
              </div>

              {/* Vitals Summary */}
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <Heart size={16} />
                    <span className="text-xs font-bold uppercase">Blood Type</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">O Positive</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <Activity size={16} />
                    <span className="text-xs font-bold uppercase">Weight</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">72.5 kg</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600 mb-2">
                    <Droplets size={16} />
                    <span className="text-xs font-bold uppercase">Glucose</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">98 mg/dL</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Medical History Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-slate-400" />
                Medical Records
              </h3>
              <button className="text-xs font-bold text-[#28328c] hover:underline">View All</button>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Annual Checkup', date: 'Feb 10, 2026', type: 'PDF' },
                { label: 'Blood Lab Report', date: 'Jan 15, 2026', type: 'DOC' }
              ].map((record, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{record.label}</p>
                      <p className="text-xs text-slate-400">{record.date}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          {/* Insurance / Security Card */}
          <div className="bg-[#28328c] p-6 rounded-3xl shadow-lg text-white">
            <div className="flex items-center gap-2 mb-6 opacity-80">
              <ShieldCheck size={20} />
              <h3 className="font-bold uppercase text-xs tracking-widest">Insurance Policy</h3>
            </div>
            <div className="space-y-1 mb-8">
              <p className="text-2xl font-bold">Star Health Silver</p>
              <p className="text-blue-200 text-sm">Policy No: #SH-4491-002</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase font-bold opacity-60">Coverage Up To</p>
                <p className="text-lg font-bold">₹ 5,00,000</p>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm text-xs font-bold">
                Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;