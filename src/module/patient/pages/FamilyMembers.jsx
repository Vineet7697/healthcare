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
    <div className="bg-slate-100 min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Family Members</h1>
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
        <h2 className="font-semibold text-slate-800">Existing Members</h2>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-blue-600 font-semibold mb-4">
          Loading family members...
        </p>
      )}

      {/* TABLE */}

      <div className="bg-white rounded-2xl border shadow-2xl border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* ===== TABLE HEADER ===== */}
            <thead className="hidden md:table-header-group bg-white">
              <tr className="text-sm font-semibold text-slate-400 border-b">
                <th className="px-6 py-4">MEMBER NAME</th>
                <th className="px-6 py-4">RELATION</th>
                <th className="px-6 py-4">GENDER</th>
                <th className="px-6 py-4">AGE</th>
                <th className="px-6 py-4">BLOOD GROUP</th>
                <th className="px-6 py-4">ACTIONS</th>
              </tr>
            </thead>

            {/* ===== TABLE BODY ===== */}
            <tbody>
              {members.map((member) => (
                <React.Fragment key={member.id}>
                  {/* DESKTOP ROW */}
                  <tr className="hidden md:table-row border-b last:border-none">
                    {/* MEMBER NAME */}
                    <td className="px-6 py-4">
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
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full w-fit">
                        {member.relation}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {member.gender}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {member.age} yrs
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-red-500 font-semibold">
                        {member.bloodGroup}
                      </span>
                    </td>

                    <td className="px-6 py-4">
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
                    </td>
                  </tr>

                  {/* MOBILE CARD ROW */}
                  <tr className="md:hidden border-b last:border-none">
                    <td colSpan="6" className="px-4 py-4">
                      <div className="space-y-3">
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

                        <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                          <div>
                            <p className="text-xs text-slate-400">Relation</p>
                            <p className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full w-fit mt-1">
                              {member.relation}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">Gender</p>
                            <p>{member.gender}</p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">Age</p>
                            <p>{member.age} yrs</p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Blood Group
                            </p>
                            <p className="text-red-500 font-semibold">
                              {member.bloodGroup}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-2 text-slate-400">
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
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
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
