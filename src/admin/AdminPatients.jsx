import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";

const BASE_URL = "http://localhost:4000";
const PAGE_SIZE = 9;

const getPatientName = (p) => p.patientName || p.fullName || p.name || "Unknown";

const getPatientImageUrl = (profile_image) => {
  if (!profile_image) return null;
  if (profile_image.startsWith("http")) return profile_image;
  return `${BASE_URL}${profile_image}`;
};

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [imageError, setImageError] = useState({});
  const [processingId, setProcessingId] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    patient: null,
  });

  const loadData = async () => {
    try {
      const res = await api.get("/admin/patients");
      setPatients(res.data?.patients || []);
    } catch {
      toast.error("Failed to load patients");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleBlock = async (patient) => {
    if (!patient?.id) return toast.error("Invalid patient");

    try {
      setProcessingId(patient.id);

      const endpoint = patient.is_active
        ? `/admin/users/${patient.id}/block`
        : `/admin/users/${patient.id}/unblock`;

      await api.put(endpoint);

      toast.success(
        patient.is_active ? "Patient blocked" : "Patient unblocked"
      );

      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setProcessingId(null);
      setConfirmModal({ open: false, patient: null });
    }
  };

  const filteredPatients = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter((p) => {
      const matchesSearch =
        (getPatientName(p) || "").toLowerCase().includes(q) ||
        (p?.email || "").toLowerCase().includes(q) ||
        (p?.mobile || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "ACTIVE"
          ? p.is_active
          : !p.is_active;

      return matchesSearch && matchesStatus;
    });
  }, [patients, search, statusFilter]);

  const visiblePatients = filteredPatients.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Patients Management
        </h1>

        <span className="text-base font-semibold text-gray-600">
          Total ({filteredPatients.length})
        </span>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center bg-white rounded-xl shadow px-3 h-11 w-full sm:max-w-sm border">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search patient name, email or mobile"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full px-2 py-3 text-sm bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["ALL", "ACTIVE", "BLOCKED"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`px-4 h-10 rounded-full border text-sm font-semibold transition ${
                statusFilter === s
                  ? s === "ACTIVE"
                    ? "bg-green-600 text-white border-green-600"
                    : s === "BLOCKED"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* PATIENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {visiblePatients.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center">
                {p.profile_image && !imageError[p.id] ? (
                  <img
                    src={getPatientImageUrl(p.profile_image)}
                    alt={getPatientName(p)}
                    className="h-full w-full object-cover"
                    onError={() =>
                      setImageError((prev) => ({ ...prev, [p.id]: true }))
                    }
                  />
                ) : (
                  <span className="font-bold text-lg text-gray-700">
                    {getPatientName(p)?.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">
                    {getPatientName(p)}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.is_active ? "ACTIVE" : "BLOCKED"}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {p.email || "-"} • {p.mobile || "-"}
                </p>
              </div>
            </div>

            {/* ✅ Only Block / Unblock button now */}
            <button
              disabled={processingId === p.id}
              onClick={() => setConfirmModal({ open: true, patient: p })}
              className={`w-full h-10 rounded-lg font-semibold transition ${
                p.is_active
                  ? "border border-red-500 text-red-600 hover:bg-red-50"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {processingId === p.id
                ? "Please wait..."
                : p.is_active
                ? "Block"
                : "Unblock"}
            </button>
          </div>
        ))}
      </div>

      {visibleCount < filteredPatients.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-6 h-10 rounded-lg border bg-white font-semibold text-gray-700 hover:bg-gray-50"
          >
            Load More
          </button>
        </div>
      )}

      {confirmModal.open && (
        <ConfirmModal
          patient={confirmModal.patient}
          onCancel={() => setConfirmModal({ open: false, patient: null })}
          onConfirm={() => toggleBlock(confirmModal.patient)}
          processing={processingId === confirmModal.patient?.id}
        />
      )}
    </div>
  );
};

export default AdminPatients;

/* ================= CONFIRM MODAL ================= */

const ConfirmModal = ({ patient, onCancel, onConfirm, processing }) => {
  const isActive = patient?.is_active;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-3">
          {isActive ? "Block Patient" : "Unblock Patient"}
        </h3>

        <p className="mb-6 text-gray-600">
          Are you sure you want to {isActive ? "block" : "unblock"}{" "}
          <b>{patient?.patientName || patient?.fullName || patient?.name}</b>?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-1.5 border rounded-md">
            Cancel
          </button>
          <button
            disabled={processing}
            onClick={onConfirm}
            className={`px-4 py-1.5 rounded-md text-white ${
              isActive ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {processing ? "Processing..." : isActive ? "Block" : "Unblock"}
          </button>
        </div>
      </div>
    </div>
  );
};