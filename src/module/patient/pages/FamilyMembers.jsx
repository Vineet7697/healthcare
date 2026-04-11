import React, { useEffect, useState } from "react";
import { Users, UserPlus, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../utils/notify";
import FamilyService from "../../../services/FamilyService";

const getInitials = (name = "") =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const avatarColors = [
  ["#0086C3", "#00b4d8"],
  ["#2ecc71", "#1aab5a"],
  ["#f59e0b", "#d97706"],
  ["#8b5cf6", "#7c3aed"],
  ["#ef4444", "#dc2626"],
];

const ConfirmModal = ({ text, onYes, onNo }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onNo} />
    <div
      className="relative bg-white rounded-2xl w-full max-w-sm p-6 z-10 animate-[scaleIn_0.25s_cubic-bezier(0.34,1.56,0.64,1)_both]"
      style={{ boxShadow: "0 20px 60px rgba(12,30,58,0.2)", border: "1px solid rgba(12,30,58,0.08)" }}
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(239,68,68,0.1)" }}>
        <Trash2 size={22} color="#ef4444" />
      </div>
      <h3 className="font-[family-name:var(--font-playfair)] text-[17px] font-bold text-[#0c1e3a] mb-1">Delete Member?</h3>
      <p className="font-[family-name:var(--font-dm)] text-[14px] text-[#64748b] mb-6">{text}</p>
      <div className="flex gap-3">
        <button
          onClick={onNo}
          className="flex-1 font-[family-name:var(--font-dm)] font-semibold text-[13px] py-2.5 rounded-xl cursor-pointer transition-all duration-200"
          style={{ color: "#64748b", background: "#f8fafc", border: "1px solid rgba(12,30,58,0.1)" }}
        >Cancel</button>
        <button
          onClick={onYes}
          className="flex-1 font-[family-name:var(--font-dm)] font-bold text-[13px] py-2.5 rounded-xl text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#ef4444,#dc2626)", boxShadow: "0 4px 12px rgba(239,68,68,0.35)" }}
        >Delete</button>
      </div>
    </div>
  </div>
);

export default function FamilyMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await FamilyService.getAll();
      setMembers(data);
      localStorage.setItem("familyMembers", JSON.stringify(data.map((m) => ({ id: m.id, name: m.fullName, age: m.age }))));
    } catch {
      notify.error("Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  const handleDelete = async () => {
    try {
      await FamilyService.remove(deleteMemberId);
      const updated = members.filter((m) => m.id !== deleteMemberId);
      setMembers(updated);
      localStorage.setItem("familyMembers", JSON.stringify(updated.map((m) => ({ id: m.id, name: m.fullName, age: m.age }))));
      notify.success("Family member deleted");
    } catch (err) {
      notify.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteMemberId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8" style={{ background: "#f0f4f8" }}>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-[24px] font-extrabold text-[#0c1e3a]">
            Family Members
          </h1>
          <p className="font-[family-name:var(--font-dm)] text-[14px] mt-0.5" style={{ color: "#64748b" }}>
            Add and manage profiles for everyone in your household
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-[family-name:var(--font-dm)] text-[13px] font-semibold"
            style={{ color: "#2ecc71", background: "rgba(46,204,113,0.1)" }}
          >
            <Users size={15} />
            {members.length} Members Active
          </div>

          <button
            onClick={() => navigate("/client/addfamilypage")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-[family-name:var(--font-dm)] font-bold text-[13px] text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#0086C3,#00b4d8)", boxShadow: "0 4px 14px rgba(0,134,195,0.35)" }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,134,195,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,134,195,0.35)")}
          >
            <UserPlus size={15} /> Add Member
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-[#0086C3] border-t-transparent rounded-full animate-spin" />
            <p className="font-[family-name:var(--font-dm)] text-[13px]" style={{ color: "#94a3b8" }}>Loading family members...</p>
          </div>
        </div>
      )}

      {!loading && members.length === 0 && (
        <div
          className="bg-white rounded-2xl py-16 flex flex-col items-center gap-3 animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ boxShadow: "0 2px 20px rgba(12,30,58,0.07)", border: "1px solid rgba(12,30,58,0.06)" }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1" style={{ background: "rgba(0,134,195,0.08)" }}>
            <Users size={32} color="#0086C3" />
          </div>
          <p className="font-[family-name:var(--font-playfair)] text-[17px] font-bold text-[#0c1e3a]">No family members yet</p>
          <p className="font-[family-name:var(--font-dm)] text-[13px]" style={{ color: "#94a3b8" }}>Add family members to book appointments for them</p>
          <button
            onClick={() => navigate("/client/addfamilypage")}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-[family-name:var(--font-dm)] font-bold text-[13px] text-white cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg,#0086C3,#00b4d8)", boxShadow: "0 4px 14px rgba(0,134,195,0.35)" }}
          >
            <UserPlus size={14} /> Add First Member
          </button>
        </div>
      )}

      {!loading && members.length > 0 && (
        <div
          className="bg-white rounded-2xl overflow-hidden animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ boxShadow: "0 2px 20px rgba(12,30,58,0.08)", border: "1px solid rgba(12,30,58,0.06)" }}
        >
          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(12,30,58,0.06)" }}>
            <h2 className="font-[family-name:var(--font-playfair)] text-[15px] font-bold text-[#0c1e3a]">
              Existing Members
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">

              <thead className="hidden md:table-header-group">
                <tr style={{ borderBottom: "1px solid rgba(12,30,58,0.06)" }}>
                  {["Member Name", "Relation", "Gender", "Age", "Blood Group", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 font-[family-name:var(--font-dm)] text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: "#94a3b8" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {members.map((member, idx) => {
                  const [c1, c2] = avatarColors[idx % avatarColors.length];
                  return (
                    <React.Fragment key={member.id}>

                      <tr
                        className="hidden md:table-row transition-all duration-200 hover:bg-[#f8fafc]"
                        style={{ borderBottom: "1px solid rgba(12,30,58,0.05)" }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-[family-name:var(--font-playfair)] text-[13px] font-bold text-white flex-shrink-0"
                              style={{ background: `linear-gradient(135deg,${c1},${c2})` }}
                            >
                              {getInitials(member.fullName)}
                            </div>
                            <div>
                              <p className="font-[family-name:var(--font-dm)] text-[14px] font-semibold text-[#0c1e3a]">
                                {member.fullName}
                              </p>
                              <p className="font-[family-name:var(--font-dm)] text-[11px]" style={{ color: "#94a3b8" }}>
                                Last visit: {member.lastVisit || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className="font-[family-name:var(--font-dm)] text-[12px] font-semibold px-3 py-1 rounded-full"
                            style={{ color: c1, background: `${c1}18` }}
                          >
                            {member.relation}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-[family-name:var(--font-dm)] text-[13px]" style={{ color: "#4b5e7a" }}>
                          {member.gender?.charAt(0) + member.gender?.slice(1).toLowerCase()}
                        </td>

                        <td className="px-6 py-4 font-[family-name:var(--font-dm)] text-[13px] font-semibold text-[#0c1e3a]">
                          {member.age} yrs
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className="font-[family-name:var(--font-dm)] text-[13px] font-bold px-3 py-1 rounded-full"
                            style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)" }}
                          >
                            {member.bloodGroup}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(`/client/edit-family/${member.id}`)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgba(0,134,195,0.1)]"
                              title="Edit"
                            >
                              <Pencil size={15} color="#0086C3" />
                            </button>
                            <button
                              onClick={() => setDeleteMemberId(member.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgba(239,68,68,0.1)]"
                              title="Delete"
                            >
                              <Trash2 size={15} color="#ef4444" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      <tr
                        className="md:hidden"
                        style={{ borderBottom: "1px solid rgba(12,30,58,0.05)" }}
                      >
                        <td colSpan="6" className="px-4 py-4">
                          <div className="flex items-start gap-3">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center font-[family-name:var(--font-playfair)] text-[13px] font-bold text-white flex-shrink-0"
                              style={{ background: `linear-gradient(135deg,${c1},${c2})` }}
                            >
                              {getInitials(member.fullName)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-[family-name:var(--font-dm)] text-[14px] font-semibold text-[#0c1e3a]">
                                    {member.fullName}
                                  </p>
                                  <span
                                    className="font-[family-name:var(--font-dm)] text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block"
                                    style={{ color: c1, background: `${c1}18` }}
                                  >
                                    {member.relation}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => navigate(`/client/edit-family/${member.id}`)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                                    style={{ background: "rgba(0,134,195,0.08)" }}
                                  >
                                    <Pencil size={14} color="#0086C3" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteMemberId(member.id)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                                    style={{ background: "rgba(239,68,68,0.08)" }}
                                  >
                                    <Trash2 size={14} color="#ef4444" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 mt-3">
                                {[
                                  { label: "Gender", value: member.gender?.charAt(0) + member.gender?.slice(1).toLowerCase() },
                                  { label: "Age", value: `${member.age} yrs` },
                                  { label: "Blood", value: member.bloodGroup, red: true },
                                ].map((item) => (
                                  <div key={item.label}>
                                    <p className="font-[family-name:var(--font-dm)] text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#94a3b8" }}>
                                      {item.label}
                                    </p>
                                    <p className="font-[family-name:var(--font-dm)] text-[13px] font-bold mt-0.5" style={{ color: item.red ? "#ef4444" : "#0c1e3a" }}>
                                      {item.value || "N/A"}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>

                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteMemberId && (
        <ConfirmModal
          text="This action cannot be undone. The family member will be permanently removed."
          onNo={() => setDeleteMemberId(null)}
          onYes={handleDelete}
        />
      )}
    </div>
  );
}