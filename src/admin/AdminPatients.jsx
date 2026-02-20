import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

const PAGE_SIZE = 50;
const BASE_URL = "http://localhost:4000";

/* ================= SAFE NAME HELPER ================= */
const getPatientName = (p) =>
  p.patientName || p.fullName || p.name || "Unknown";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /* ================= LOAD PATIENTS ================= */
  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/patients");
      setPatients(res.data?.patients || []);
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
    return patients.filter((p) => {
      const text = `
        ${getPatientName(p)}
        ${p.email || ""}
        ${p.mobile || ""}
      `.toLowerCase();

      const matchesQuery = text.includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? p.is_active
          : !p.is_active;

      return matchesQuery && matchesStatus;
    });
  }, [patients, query, statusFilter]);

  const visiblePatients = filteredPatients.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-md shadow-md rounded-2xl p-6 mb-8 border border-slate-200">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Patients Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage all registered patients
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm shadow">
            Total: {filteredPatients.length}
          </span>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <FaSearch className="absolute top-4 left-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search by name, email or phone"
              className="w-full pl-12 pr-4 h-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            {["ALL", "ACTIVE", "BLOCKED"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`px-5 h-11 rounded-full text-sm font-semibold transition ${
                  statusFilter === status
                    ? status === "ACTIVE"
                      ? "bg-green-600 text-white shadow"
                      : status === "BLOCKED"
                      ? "bg-red-600 text-white shadow"
                      : "bg-slate-800 text-white shadow"
                    : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PATIENT CARDS */}
      <div className="grid gap-6">
        {!loading && visiblePatients.length === 0 && (
          <div className="text-center text-slate-400 py-16">
            No patients found
          </div>
        )}

        {visiblePatients.map((p) => {
          const patientName = getPatientName(p);

          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-slate-200 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <Avatar patient={p} name={patientName} />

                  <div>
                    <p className="font-semibold text-lg text-slate-800">
                      {patientName}
                    </p>
                    <p className="text-sm text-slate-500">{p.email}</p>
                    <p className="text-xs text-slate-400">
                      📞 {p.mobile || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
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
          );
        })}
      </div>

      {/* LOAD MORE */}
      {visibleCount < filteredPatients.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-10 text-slate-500">Loading...</div>
      )}
    </div>
  );
};

/* ================= AVATAR ================= */
const Avatar = ({ patient, name }) => {
  const imageUrl = patient.profile_image
    ? patient.profile_image.startsWith("http")
      ? patient.profile_image
      : `${BASE_URL}${patient.profile_image}`
    : null;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt="avatar"
        className="h-14 w-14 rounded-full object-cover border-2 border-blue-500 shadow"
        onError={(e) => (e.target.style.display = "none")}
      />
    );
  }

  return (
    <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow">
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};

/* ================= TOGGLE ================= */
const ToggleSwitch = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    className={`w-14 h-7 flex items-center rounded-full cursor-pointer transition-all ${
      checked ? "bg-green-500" : "bg-red-400"
    }`}
  >
    <div
      className={`h-6 w-6 bg-white rounded-full shadow transform transition-all ${
        checked ? "translate-x-7" : "translate-x-1"
      }`}
    />
  </div>
);

export default AdminPatients;
