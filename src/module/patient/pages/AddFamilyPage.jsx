// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import FamilyService from "../../../services/FamilyService";

// const AddFamilyPage = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEdit = Boolean(id);

//   const [familyMember, setFamilyMember] = useState({
//     fullName: "",
//     gender: "",
//     dob: "",
//     heightCm: "",
//     weightKg: "",
//     bloodGroup: "",
//     relation: "",
//   });

//   const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
//   const [errors, setErrors] = useState({});

//   const submitUpdate = async () => {
//     try {
//       await FamilyService.update(id, familyMember);

//       toast.success("Family member updated successfully!");
//       navigate(-1);
//     } catch {
//       toast.error("Action failed");
//     } finally {
//       setShowUpdateConfirm(false);
//     }
//   };

//   /* ================= FETCH MEMBER (ONLY EDIT) ================= */
//   useEffect(() => {
//     if (!isEdit) return;

//     FamilyService.getById(id)
//       .then(setFamilyMember)
//       .catch(() => toast.error("Failed to load family member"));
//   }, [id]);

//   /* ================= AGE CALC ================= */
//   const calculateAge = (dob) => {
//     if (!dob) return "";
//     const birthDate = new Date(dob);
//     const diff = Date.now() - birthDate.getTime();
//     return Math.abs(new Date(diff).getUTCFullYear() - 1970);
//   };

//   /* ================= CHANGE ================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const updated = { ...familyMember, [name]: value };
//     if (name === "dob") updated.age = calculateAge(value);
//     setFamilyMember(updated);
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};

//     if (!familyMember.fullName) newErrors.fullName = "Required";
//     if (!familyMember.gender) newErrors.gender = "Required";
//     if (!familyMember.dob) newErrors.dob = "Required";
//     if (!familyMember.relation) newErrors.relation = "Required";
//     if (!familyMember.bloodGroup) newErrors.bloodGroup = "Required";

//     if (!familyMember.heightCm || familyMember.heightCm <= 0)
//       newErrors.heightCm = "Valid height required";

//     if (!familyMember.weightKg || familyMember.weightKg <= 0)
//       newErrors.weightKg = "Valid weight required";
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length) return;

//     // 🔴 EDIT MODE → CONFIRM FIRST
//     if (isEdit) {
//       setShowUpdateConfirm(true);
//       return;
//     }

//     // 🟢 ADD MODE → DIRECT SAVE
//   try {
//   await FamilyService.create(familyMember);

//   const existing =
//     JSON.parse(localStorage.getItem("familyMembers")) || [];

//   const newMember = {
//     id: Date.now(), // ⚠ temporary fake id
//     name: familyMember.fullName,
//   };

//   localStorage.setItem(
//     "familyMembers",
//     JSON.stringify([...existing, newMember])
//   );

//   toast.success("Family member added successfully!");
//   navigate(-1);
// } catch (err) {
//   console.error(err);
//   toast.error("Action failed");
// }

//   };

//   const ConfirmModal = ({ text, onYes, onNo }) => {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center">
//         {/* backdrop */}
//         <div className="absolute inset-0 bg-black/40" onClick={onNo} />

//         {/* modal */}
//         <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6 z-10">
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">
//             Confirm Action
//           </h3>

//           <p className="text-gray-600 mb-6">{text}</p>

//           <div className="flex justify-end gap-3">
//             <button
//               onClick={onNo}
//               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
//             >
//               No
//             </button>

//             <button
//               onClick={onYes}
//               className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
//             >
//               Yes
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     /* ===== PAGE WRAPPER ===== */
//     <div className="min-h-screen flex items-start justify-center py-10 bg-linear-to-br from-blue-100 to-blue-300 px-4">
//       {/* ===== FORM CARD ===== */}
//       <div className="bg-white shadow-xl rounded-2xl p-8 pb-16 w-full max-w-xl min-h-[80vh]">
//         <h2 className="text-2xl font-semibold text-center mb-8 text-gray-700">
//           Add Family Member
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Full Name & Gender */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Full Name<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="fullName"
//                 value={familyMember.fullName}
//                 onChange={handleChange}
//                 className="w-full h-11 pl-3 pr-4 border  rounded-lg bg-white  focus:border-[#2277f7] focus:border-2"
//               />
//               {errors.fullName && (
//                 <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Gender<span className="text-red-500">*</span>
//               </label>

//               <select
//                 name="gender"
//                 value={familyMember.gender}
//                 onChange={handleChange}
//                 className="w-full h-11 pl-3 pr-4 border  rounded-lg bg-white  focus:border-[#2277f7] focus:border-2"
//               >
//                 <option value="">Select Gender</option>
//                 <option value="MALE">MALE</option>
//                 <option value="FEMALE">FEMALE</option>
//                 <option value="OTHER">OTHER</option>
//               </select>

//               {errors.gender && (
//                 <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
//               )}
//             </div>
//           </div>

//           {/* Blood Group & Relation */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Blood Group<span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="bloodGroup"
//                 value={familyMember.bloodGroup}
//                 onChange={handleChange}
//                 className="w-full h-11 pl-3 pr-4 border  rounded-lg bg-white  focus:border-[#2277f7] focus:border-2"
//               >
//                 <option value="">Select Blood Group</option>
//                 <option value="A+">A+</option>
//                 <option value="A-">A-</option>
//                 <option value="B+">B+</option>
//                 <option value="B-">B-</option>
//                 <option value="O+">O+</option>
//                 <option value="O-">O-</option>
//                 <option value="AB+">AB+</option>
//                 <option value="AB-">AB-</option>
//               </select>
//               {errors.bloodGroup && (
//                 <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Relation<span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="relation"
//                 value={familyMember.relation}
//                 onChange={handleChange}
//                 className="w-full h-11 pl-3 pr-4 border  rounded-lg bg-white  focus:border-[#2277f7] focus:border-2"
//               >
//                 <option value="">Select Relation</option>
//                 <option value="FATHER">Father</option>
//                 <option value="MOTHER">Mother</option>
//                 <option value="SPOUSE">Spouse</option>
//                 <option value="SON">Son</option>
//                 <option value="DAUGHTER">Daughter</option>
//                 <option value="BROTHER">Brother</option>
//                 <option value="SISTER">Sister</option>
//                 <option value="OTHER">Other</option>
//               </select>
//               {errors.relation && (
//                 <p className="text-red-500 text-sm mt-1">{errors.relation}</p>
//               )}
//             </div>
//           </div>

//           {/* Height & Weight */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Height<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 name="heightCm"
//                 value={familyMember.heightCm}
//                 onChange={handleChange}
//                 className="w-full h-11 pl-3 pr-4 border  rounded-lg bg-white  focus:border-[#2277f7] focus:border-2"
//               />
//               {errors.heightCm && (
//                 <p className="text-red-500 text-sm mt-1">{errors.heightCm}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Weight<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="number"
//                 name="weightKg"
//                 value={familyMember.weightKg}
//                 onChange={handleChange}
//                 className="w-full h-11 pl-3 pr-4 border  rounded-lg bg-white  focus:border-[#2277f7] focus:border-2"
//               />
//               {errors.weightKg && (
//                 <p className="text-red-500 text-sm mt-1">{errors.weightKg}</p>
//               )}
//             </div>
//           </div>

//           {/* DOB & Age */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Date of Birth<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="dob"
//                 value={familyMember.dob}
//                 onChange={handleChange}
//                 className="w-full h-11 pl-3 pr-4 border  rounded-lg bg-white  focus:border-[#2277f7] focus:border-2"
//               />
//               {errors.dob && (
//                 <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
//               )}
//             </div>

//             {/* <div>
//               <label className="block text-gray-700 font-medium mb-1">
//                 Age
//               </label>
//               <input
//                 type="text"
//                 name="age"
//                 value={familyMember.age}
//                 readOnly
//                 className="w-full h-[44px] pl-3 pr-4 border  rounded-lg bg-white  focus:border-[#2277f7] focus:border-2"
//               />
//             </div> */}
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 mt-10">
// <button
//   type="button"
//   onClick={() => navigate(-1)}
//   className="bg-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
// >
//   Cancel
// </button>

//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
//             >
//               {isEdit ? "Update Member" : "Save Member"}
//             </button>
//           </div>
//         </form>
//       </div>
//       {showUpdateConfirm && (
//         <ConfirmModal
//           text="Are you sure you want to update this family member?"
//           onNo={() => setShowUpdateConfirm(false)}
//           onYes={submitUpdate}
//         />
//       )}
//     </div>
//   );
// };

// export default AddFamilyPage;



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import FamilyService from "../../../services/FamilyService";

const AddFamilyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [familyMember, setFamilyMember] = useState({
    fullName: "",
    gender: "",
    dob: "",
    heightCm: "",
    weightKg: "",
    bloodGroup: "",
    relation: "",
  });

  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= FETCH (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEdit) return;

    const fetchMember = async () => {
      try {
        const data = await FamilyService.getById(id);
        setFamilyMember(data);
      } catch {
        toast.error("Failed to load family member");
      }
    };

    fetchMember();
  }, [id, isEdit]);

  /* ================= CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFamilyMember((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= UPDATE ================= */
  const submitUpdate = async () => {
    try {
      setLoading(true);
      await FamilyService.update(id, familyMember);
      toast.success("Family member updated successfully!");
      navigate(-1);
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
      setShowUpdateConfirm(false);
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors = {};

    if (!familyMember.fullName.trim()) newErrors.fullName = "Required";
    if (!familyMember.gender) newErrors.gender = "Required";
    if (!familyMember.dob) newErrors.dob = "Required";
    if (!familyMember.relation) newErrors.relation = "Required";
    if (!familyMember.bloodGroup) newErrors.bloodGroup = "Required";

    if (!familyMember.heightCm || Number(familyMember.heightCm) <= 0)
      newErrors.heightCm = "Valid height required";

    if (!familyMember.weightKg || Number(familyMember.weightKg) <= 0)
      newErrors.weightKg = "Valid weight required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEdit) {
      setShowUpdateConfirm(true);
      return;
    }

    try {
      setLoading(true);
      await FamilyService.create(familyMember);
      toast.success("Family member added successfully!");
      navigate(-1);
    } catch {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CONFIRM MODAL ================= */
  const ConfirmModal = ({ text, onYes, onNo }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onNo} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6 z-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Confirm Action
        </h3>
        <p className="text-gray-600 mb-6">{text}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onNo}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            No
          </button>
          <button
            onClick={onYes}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-8">
          {/* HEADER */}
          <div className="flex items-center justify-center  gap-2 px-6 py-4 border-b">
            <UserPlus className="text-blue-600" size={18} />
            <h2 className="font-bold text-slate-800">
              {isEdit ? "Update Member" : "Add New Member"}
            </h2>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-6 grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className=" font-semibold text-slate-600">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={familyMember.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className=" font-semibold text-slate-600">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={familyMember.gender}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200  focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className=" font-semibold text-slate-600">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={familyMember.dob}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.dob && (
                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
              )}
            </div>

            {/* Blood Group */}
            <div>
              <label className=" font-semibold text-slate-600">
                Blood Group <span className="text-red-500">*</span>
              </label>
              <select
                name="bloodGroup"
                value={familyMember.bloodGroup}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
              {errors.bloodGroup && (
                <p className="text-red-500 text-xs mt-1">{errors.bloodGroup}</p>
              )}
            </div>

            {/* Relation */}
            <div>
              <label className=" font-semibold text-slate-600">
                Relation <span className="text-red-500">*</span>
              </label>
              <select
                name="relation"
                value={familyMember.relation}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Relation</option>
                <option>FATHER</option>
                <option>MOTHER</option>
                <option>SPOUSE</option>
                <option>SON</option>
                <option>DAUGHTER</option>
                <option>BROTHER</option>
                <option>SISTER</option>
                <option>OTHER</option>
              </select>
              {errors.relation && (
                <p className="text-red-500 text-xs mt-1">{errors.relation}</p>
              )}
            </div>

            {/* Height */}
            <div>
              <label className=" font-semibold text-slate-600">
                Height (cm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="heightCm"
                value={familyMember.heightCm}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.heightCm && (
                <p className="text-red-500 text-xs mt-1">{errors.heightCm}</p>
              )}
            </div>

            {/* Weight */}
            <div>
              <label className=" font-semibold text-slate-600">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weightKg"
                value={familyMember.weightKg}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.weightKg && (
                <p className="text-red-500 text-xs mt-1">{errors.weightKg}</p>
              )}
            </div>
            <div></div>
            <div></div>
           

            {/* BUTTON */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow"
              >
                {isEdit ? "Update Member" : "Save Member"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showUpdateConfirm && (
        <ConfirmModal
          text="Are you sure you want to update this family member?"
          onNo={() => setShowUpdateConfirm(false)}
          onYes={submitUpdate}
        />
      )}
    </div>
  );
};

export default AddFamilyPage;
