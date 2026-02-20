// import React, { useEffect, useState } from "react";
// import { AiOutlinePlus } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";
// import FamilyService from "../../../services/FamilyService";
// import { toast } from "react-toastify";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const FamilyMembers = () => {
//   const [familyMembers, setFamilyMembers] = useState([]);
//   const [deleteMemberId, setDeleteMemberId] = useState(null);
//   const navigate = useNavigate();

//   /* ================= FETCH FAMILY MEMBERS ================= */
//   const loadMembers = async () => {
//     try {
//       const members = await FamilyService.getAll();
//       setFamilyMembers(members);

//       // 🔑 localStorage sync (for BookAppointmentPage)
//       const mapped = members.map((m) => ({
//         id: m.id,
//         name: m.fullName,
//         age: m.age,
//       }));
//       localStorage.setItem("familyMembers", JSON.stringify(mapped));
//     } catch {
//       toast.error("Failed to load family members");
//     }
//   };

//   useEffect(() => {
//     loadMembers();
//   }, []);

//   /* ================= DELETE MEMBER ================= */
//   const handleDelete = async () => {
//     try {
//       await FamilyService.remove(deleteMemberId);

//       const updatedUI = familyMembers.filter((m) => m.id !== deleteMemberId);
//       setFamilyMembers(updatedUI);

//       const updatedStorage = updatedUI.map((m) => ({
//         id: m.id,
//         name: m.fullName,
//         age: m.age,
//       }));
//       localStorage.setItem("familyMembers", JSON.stringify(updatedStorage));

//       toast.success("Family member deleted");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Delete failed");
//     } finally {
//       setDeleteMemberId(null);
//     }
//   };

//   /* ================= CONFIRM MODAL ================= */
//   const ConfirmModal = ({ text, onYes, onNo }) => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/40" onClick={onNo} />
//       <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6 z-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">
//           Confirm Action
//         </h3>

//         <p className="text-gray-600 mb-6">{text}</p>

//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onNo}
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onYes}
//             className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <section className="bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] min-h-screen py-10 px-4">
//       <div className="bg-white rounded-2xl shadow-md p-6 mt-20">
//         {/* ================= HEADER ================= */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <h3 className="text-2xl font-semibold text-gray-700">
//             👨‍👩‍👧‍👦 Family Members
//           </h3>

//           <button
//             className="w-full sm:w-auto flex items-center justify-center gap-2
//               bg-linear-to-br from-[#2277f7] to-[#52abd4]
//               text-white px-4 py-2 rounded-xl font-semibold
//               cursor-pointer hover:opacity-90"
//             onClick={() => navigate(`/client/addfamilypage`)}
//           >
//             <AiOutlinePlus size={18} />
//             Add
//           </button>
//         </div>

//         {/* ================= EMPTY STATE ================= */}
//         {familyMembers.length === 0 && (
//           <p className="text-gray-500 text-center py-6">
//             No family members added yet.
//           </p>
//         )}

//         {/* ================= TABLE (DESKTOP + TABLET) ================= */}
//         {familyMembers.length > 0 && (
//           <div className="hidden sm:block overflow-x-auto">
//             <table className="min-w-225 w-full border">
//               <thead className="bg-blue-100">
//                 <tr>
//                   <th className="border p-2">S.No.</th>
//                   <th className="border p-2">Full Name</th>
//                   <th className="border p-2">Gender</th>
//                   <th className="border p-2">Height</th>
//                   <th className="border p-2">Weight</th>
//                   <th className="border p-2">DOB</th>
//                   <th className="border p-2">Age</th>
//                   <th className="border p-2">Blood Group</th>
//                   <th className="border p-2">Relation</th>
//                   <th className="border p-2">Edit</th>
//                   <th className="border p-2">Delete</th>
//                 </tr>
//               </thead>

//               <tbody className="text-center">
//                 {familyMembers.map((member, index) => (
//                   <tr key={member.id}>
//                     <td className="border p-2">{index + 1}</td>
//                     <td className="border p-2">{member.fullName}</td>
//                     <td className="border p-2">{member.gender}</td>
//                     <td className="border p-2">{member.heightCm}</td>
//                     <td className="border p-2">{member.weightKg}</td>
//                     <td className="border p-2">{member.dob}</td>
//                     <td className="border p-2">{member.age}</td>
//                     <td className="border p-2">{member.bloodGroup}</td>
//                     <td className="border p-2">{member.relation}</td>

//                     <td className="border p-2">
//                       <button
//                         onClick={() =>
//                           navigate(`/client/edit-family/${member.id}`)
//                         }
//                         className="text-blue-600 hover:text-blue-700"
//                       >
//                         <FaEdit size={14} />
//                       </button>
//                     </td>

//                     <td className="border p-2">
//                       <button
//                         onClick={() => setDeleteMemberId(member.id)}
//                         className="text-red-600 hover:text-red-700"
//                       >
//                         <FaTrash size={14} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* ================= MOBILE TABLE FORM ================= */}
//         <div className="sm:hidden space-y-4">
//           {familyMembers.map((member, index) => (
//             <div
//               key={member.id}
//               className="border rounded-xl overflow-hidden bg-white shadow-sm"
//             >
//               {/* Header */}
//               <div className="flex justify-between items-center px-4 py-3 bg-blue-50">
//                 <span className="font-semibold text-gray-800">
//                   {index + 1}. {member.fullName}
//                 </span>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => navigate(`/client/edit-family/${member.id}`)}
//                     className="text-blue-600"
//                   >
//                     <FaEdit size={16} />
//                   </button>

//                   <button
//                     onClick={() => setDeleteMemberId(member.id)}
//                     className="text-red-600"
//                   >
//                     <FaTrash size={16} />
//                   </button>
//                 </div>
//               </div>

//               {/* Table Body */}
//               <table className="w-full text-sm">
//                 <tbody>
//                   <tr className="border-t">
//                     <td className="px-4 py-2 font-medium">Gender</td>
//                     <td className="px-4 py-2">{member.gender}</td>
//                   </tr>

//                   <tr className="border-t">
//                     <td className="px-4 py-2 font-medium">Age</td>
//                     <td className="px-4 py-2">{member.age}</td>
//                   </tr>

//                   <tr className="border-t">
//                     <td className="px-4 py-2 font-medium">DOB</td>
//                     <td className="px-4 py-2">{member.dob}</td>
//                   </tr>

//                   <tr className="border-t">
//                     <td className="px-4 py-2 font-medium">Height</td>
//                     <td className="px-4 py-2">{member.heightCm} cm</td>
//                   </tr>

//                   <tr className="border-t">
//                     <td className="px-4 py-2 font-medium">Weight</td>
//                     <td className="px-4 py-2">{member.weightKg} kg</td>
//                   </tr>

//                   <tr className="border-t">
//                     <td className="px-4 py-2 font-medium">Blood Group</td>
//                     <td className="px-4 py-2">{member.bloodGroup}</td>
//                   </tr>

//                   <tr className="border-t">
//                     <td className="px-4 py-2 font-medium">Relation</td>
//                     <td className="px-4 py-2">{member.relation}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           ))}
//         </div>

//         {/* ================= CONFIRM DELETE ================= */}
//         {deleteMemberId && (
//           <ConfirmModal
//             text="Are you sure you want to delete this family member?"
//             onNo={() => setDeleteMemberId(null)}
//             onYes={handleDelete}
//           />
//         )}
//       </div>
//     </section>
//   );
// };

// export default FamilyMembers;


import React, { useEffect, useState } from "react";
import { Users, UserPlus, Filter, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FamilyService from "../../../services/FamilyService";

/* ================= INITIALS HELPER ================= */
const getInitials = (name = "") =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default function FamilyMembers() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const loadMembers = async () => {
    setLoading(true);

    try {
      const data = await FamilyService.getAll();

      setMembers(data);

      // localStorage sync (for booking flows etc.)
      const mapped = data.map((m) => ({
        id: m.id,
        name: m.fullName,
        age: m.age,
      }));

      localStorage.setItem("familyMembers", JSON.stringify(mapped));
    } catch {
      toast.error("Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await FamilyService.remove(deleteMemberId);

      const updated = members.filter((m) => m.id !== deleteMemberId);
      setMembers(updated);

      const updatedStorage = updated.map((m) => ({
        id: m.id,
        name: m.fullName,
        age: m.age,
      }));

      localStorage.setItem("familyMembers", JSON.stringify(updatedStorage));

      toast.success("Family member deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteMemberId(null);
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
            Cancel
          </button>

          <button
            onClick={onYes}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-100 min-h-screen p-8">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Family Members
          </h1>
          <p className="text-slate-500 mt-1">
            Add and manage profiles for everyone in your household.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-semibold">
          <Users size={18} />
          {members.length} Members Active
        </div>
      </div>

 

          <div className="flex items-end justify-end ">
            <button
              onClick={() => navigate(`/client/addfamilypage`)}
              className="px-4  bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow"
            >
              <UserPlus size={18} />
              Add Member
            </button>
          </div>


      {/* EXISTING MEMBERS */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-slate-800">
          Existing Members
        </h2>

        
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-blue-600 font-semibold mb-4">
          Loading family members...
        </p>
      )}

      {/* TABLE */}
<div className="bg-white rounded-2xl border shadow-2xl border-slate-200 overflow-hidden">
  
  {/* HEADER */}
  <div className="grid grid-cols-6 px-6 py-4 text-sm font-semibold text-slate-400 border-b">
    <p>MEMBER NAME</p>
    <p>RELATION</p>
    <p>GENDER</p>
    <p>AGE</p>
    <p>BLOOD GROUP</p>
    <p>ACTIONS</p>
  </div>

  {members.map((member) => (
    <div
      key={member.id}
      className="grid grid-cols-6 items-center px-6 py-4 border-b last:border-none"
    >
      {/* MEMBER NAME */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600">
          {getInitials(member.fullName)}
        </div>

        <div>
          <p className="font-semibold text-slate-800">
            {member.fullName}
          </p>
          <p className="text-xs text-slate-400">
            Last visit: {member.lastVisit || "N/A"}
          </p>
        </div>
      </div>

      {/* RELATION */}
      <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full w-fit">
        {member.relation}
      </span>

      {/* GENDER */}
      <p className="text-slate-700">
        {member.gender}
      </p>

      {/* AGE */}
      <p className="text-slate-700">
        {member.age} yrs
      </p>

      {/* BLOOD GROUP */}
      <span className="text-red-500 font-semibold">
        {member.bloodGroup}
      </span>

      {/* ACTIONS */}
      <div className="flex gap-4 text-slate-400">
        <Pencil
          size={18}
          onClick={() =>
            navigate(`/client/edit-family/${member.id}`)
          }
          className="cursor-pointer hover:text-blue-600 transition"
        />

        <Trash2
          size={18}
          onClick={() => setDeleteMemberId(member.id)}
          className="cursor-pointer hover:text-red-500 transition"
        />
      </div>
    </div>
  ))}

  {/* FOOTER */}
  <div className="flex justify-between items-center px-6 py-4 text-sm text-slate-400">
    Showing {members.length} of {members.length} members

    <div className="flex gap-2">
      <button className="px-3 py-1 border rounded-lg bg-slate-50 hover:bg-slate-100 transition">
        Previous
      </button>
      <button className="px-3 py-1 border rounded-lg bg-slate-50 hover:bg-slate-100 transition">
        Next
      </button>
    </div>
  </div>
</div>


      {/* DELETE MODAL */}
      {deleteMemberId && (
        <ConfirmModal
          text="Are you sure you want to delete this family member?"
          onNo={() => setDeleteMemberId(null)}
          onYes={handleDelete}
        />
      )}
    </div>
  );
}