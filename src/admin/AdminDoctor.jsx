import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

/* ================= IMAGE HELPER ================= */
const BASE_URL = "http://localhost:4000";
const PAGE_SIZE = 10;

const getDoctorImageUrl = (profile_image) => {
  if (!profile_image) return null;
  if (profile_image.startsWith("http")) return profile_image;
  return `${BASE_URL}${profile_image}`;
};

const AdminDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);
  const [imageError, setImageError] = useState({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "",
    doctor: null,
  });

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      const [pending, approved, rejected] = await Promise.all([
        api.get("/admin/doctors?status=PENDING"),
        api.get("/admin/doctors?status=APPROVED"),
        api.get("/admin/doctors?status=REJECTED"),
      ]);

      const allDoctors = [
        ...(pending.data.doctors || []),
        ...(approved.data.doctors || []),
        ...(rejected.data.doctors || []),
      ];

      setDoctors(allDoctors);

      setStats({
        pending: pending.data.doctors?.length || 0,
        approved: approved.data.doctors?.length || 0,
        rejected: rejected.data.doctors?.length || 0,
      });
    } catch (err) {
      toast.error("Failed to load admin dashboard");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ================= APPROVE / REJECT ================= */
  const handleConfirmAction = async () => {
    const { type, doctor } = confirmModal;

    if (!doctor?.user_id) {
      toast.error("Invalid doctor");
      return;
    }

    try {
      setProcessing(true);

      const endpoint =
        type === "APPROVE"
          ? `/admin/doctor/approve/${doctor.user_id}`
          : `/admin/doctor/reject/${doctor.user_id}`;

      await api.put(endpoint);

      toast.success(
        type === "APPROVE"
          ? "Doctor approved successfully"
          : "Doctor rejected successfully"
      );

      setConfirmModal({ open: false, type: "", doctor: null });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredDoctors = useMemo(() => {
    return doctors.filter((d) => {
      const matchesSearch =
        d?.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
        d?.city?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ? true : d.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [doctors, search, statusFilter]);

  const visibleDoctors = filteredDoctors.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Doctors Management
        </h1>

        <span className="text-base font-semibold text-gray-600">
          Pending ({stats.pending})
        </span>
      </div>

      {/* SEARCH + STATUS FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center bg-white rounded-xl shadow px-3 h-11 w-full sm:max-w-sm">
          <span className="material-symbols-outlined px-2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search doctor name or city"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="w-full px-2 py-3 text-sm bg-transparent focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`px-4 h-10 rounded-full border text-sm font-semibold transition ${
                statusFilter === s
                  ? s === "PENDING"
                    ? "bg-orange-600 text-white border-orange-600"
                    : s === "APPROVED"
                    ? "bg-green-600 text-white border-green-600"
                    : s === "REJECTED"
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

      {/* DOCTOR CARDS */}
      <div className="space-y-4">
        {visibleDoctors.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No doctors found
          </p>
        )}

        {visibleDoctors.map((d) => (
          <div
            key={d.user_id}
            className={`rounded-xl p-5 shadow-sm transition hover:shadow-md ${
              d.status === "PENDING"
                ? "bg-orange-50 border-l-4 border-orange-400"
                : d.status === "APPROVED"
                ? "bg-green-50 border-l-4 border-green-400"
                : "bg-red-50 border-l-4 border-red-400"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* PROFILE IMAGE */}
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                {d.profile_image && !imageError[d.user_id] ? (
                  <img
                    src={getDoctorImageUrl(d.profile_image)}
                    alt={d.doctorName}
                    className="h-full w-full object-cover"
                    onError={() =>
                      setImageError((prev) => ({
                        ...prev,
                        [d.user_id]: true,
                      }))
                    }
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-lg">
                    {d.doctorName?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-base">
                    {d.doctorName}
                  </p>
                  <StatusBadge status={d.status} />
                </div>
                <p className="text-sm text-gray-500">
                  {d.specialization} • {d.city}
                </p>
              </div>
            </div>

            {d.status === "PENDING" && (
              <div className="flex gap-3 mt-4">
                <button
                  disabled={processing}
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      type: "APPROVE",
                      doctor: d,
                    })
                  }
                  className="flex-1 h-9 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  disabled={processing}
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      type: "REJECT",
                      doctor: d,
                    })
                  }
                  className="flex-1 h-9 rounded-md border border-red-500 text-red-600 text-sm font-semibold hover:bg-red-50"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* LOAD MORE */}
      {visibleCount < filteredDoctors.length && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-6 h-10 rounded-lg border bg-white font-semibold text-gray-700 hover:bg-gray-50"
          >
            Load More
          </button>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.open && (
        <ConfirmModal
          type={confirmModal.type}
          doctor={confirmModal.doctor}
          processing={processing}
          onCancel={() =>
            setConfirmModal({ open: false, type: "", doctor: null })
          }
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
};

/* ================= BADGE ================= */
const StatusBadge = ({ status }) => {
  const map = {
    PENDING: "bg-orange-100 text-orange-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
};

/* ================= CONFIRM MODAL ================= */
const ConfirmModal = ({ type, doctor, onCancel, onConfirm, processing }) => {
  const isApprove = type === "APPROVE";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-3">
          {isApprove ? "Approve Doctor" : "Reject Doctor"}
        </h3>

        <p className="mb-6 text-gray-600">
          Are you sure you want to{" "}
          <b>{isApprove ? "approve" : "reject"}</b>{" "}
          <span className="font-medium">{doctor?.doctorName}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 border rounded-md text-sm hover:bg-gray-50"
          >
            No
          </button>

          <button
            disabled={processing}
            onClick={onConfirm}
            className={`px-4 py-1.5 rounded-md text-white text-sm font-semibold ${
              isApprove ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {processing ? "Processing..." : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctor;
