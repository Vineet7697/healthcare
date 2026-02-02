import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const PAGE_SIZE = 50;

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ACTIVE");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /* ================= LOAD PATIENTS ================= */
  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/patients");
      setPatients(res.data.patients || []);
    } catch {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  /* ================= BLOCK / UNBLOCK ================= */
  const toggleBlock = async (patient) => {
    try {
      const url = patient.is_active
        ? `/admin/users/${patient.id}/block`
        : `/admin/users/${patient.id}/unblock`;

      await api.put(url);
      toast.success(patient.is_active ? "User blocked" : "User unblocked");
      loadPatients();
    } catch {
      toast.error("Action failed");
    }
  };

  /* ================= FILTER ================= */
  const filteredPatients = useMemo(() => {
    return patients.filter((p) =>
      filter === "ACTIVE" ? p.is_active : !p.is_active,
    );
  }, [patients, filter]);

  const visiblePatients = filteredPatients.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#f4f6f8] p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Patients Management
        </h1>
        <span className="text-sm sm:text-base font-semibold text-gray-600">
          Total: {filteredPatients.length}
        </span>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
        <FilterTab
          type="ACTIVE"
          active={filter === "ACTIVE"}
          onClick={() => {
            setFilter("ACTIVE");
            setVisibleCount(PAGE_SIZE);
          }}
        >
          Active
        </FilterTab>

        <FilterTab
          type="BLOCKED"
          active={filter === "BLOCKED"}
          onClick={() => {
            setFilter("BLOCKED");
            setVisibleCount(PAGE_SIZE);
          }}
        >
          Blocked
        </FilterTab>
      </div>

      {/* CARDS */}
      <div className="grid gap-4">
        {!loading && visiblePatients.length === 0 && (
          <p className="text-center text-gray-500 py-10">No patients found</p>
        )}

        {visiblePatients.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5
              hover:bg-blue-50 hover:border-blue-400 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <Avatar patient={p} />

                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {p.email?.split("@")[0] || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{p.email}</p>
                  <p className="text-xs text-gray-400">
                    Phone: {p.mobile || "-"}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span
                  className={`text-xs sm:text-sm font-bold ${
                    p.is_active ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.is_active ? "ACTIVE" : "BLOCKED"}
                </span>

                <ToggleSwitch
                  checked={p.is_active}
                  onChange={() => toggleBlock(p)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MORE */}
      {visibleCount < filteredPatients.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="w-full sm:w-auto px-6 h-11 rounded-lg border bg-white
              font-semibold text-gray-700 hover:bg-gray-50"
          >
            View More Patients
          </button>
        </div>
      )}

      {loading && <p className="text-center text-gray-500 py-6">Loading...</p>}
    </div>
  );
};

/* ================= COMPONENTS ================= */

const FilterTab = ({ children, active, onClick, type }) => {
  const styles = {
    ACTIVE: active
      ? "bg-blue-600 text-white border-blue-600"
      : "bg-white text-gray-600 border-gray-300 hover:border-blue-500",
    BLOCKED: active
      ? "bg-red-600 text-white border-red-600"
      : "bg-white text-gray-600 border-gray-300 hover:border-red-500",
  };

  return (
    <button
      onClick={onClick}
      className={`px-5 h-10 rounded-full font-semibold border text-sm whitespace-nowrap
        transition ${styles[type]}`}
    >
      {children}
    </button>
  );
};

const ToggleSwitch = ({ checked, onChange }) => (
  <label
    onClick={onChange}
    className={`relative flex h-6 w-12 cursor-pointer items-center rounded-full px-1
      transition ${checked ? "bg-green-500" : "bg-red-400"}`}
  >
    <span
      className={`h-4 w-4 rounded-full bg-white shadow transform transition
        ${checked ? "translate-x-6" : "translate-x-0"}`}
    />
  </label>
);

const Avatar = ({ patient }) => {
  if (patient.avatar) {
    return (
      <img
        src={patient.avatar}
        alt="avatar"
        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-100
      flex items-center justify-center font-semibold text-gray-500"
    >
      {(patient.email || "U").charAt(0).toUpperCase()}
    </div>
  );
};

export default AdminPatients;