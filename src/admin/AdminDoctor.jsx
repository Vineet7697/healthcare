import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // 🔔 Confirm Modal
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "",
    doctor: null,
  });

  /* ================= LOAD DASHBOARD DATA ================= */
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
        pending: pending.data.doctors.length,
        approved: approved.data.doctors.length,
        rejected: rejected.data.doctors.length,
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

      if (type === "APPROVE") {
        await api.put(`/admin/doctor/approve/${doctor.user_id}`);

        // ✅ status update in UI
        setDoctors((prev) =>
          prev.map((d) =>
            d.user_id === doctor.user_id ? { ...d, status: "APPROVED" } : d,
          ),
        );

        toast.success("Doctor approved successfully");
      }

      if (type === "REJECT") {
        await api.put(`/admin/doctor/reject/${doctor.user_id}`);

        setDoctors((prev) =>
          prev.map((d) =>
            d.user_id === doctor.user_id ? { ...d, status: "REJECTED" } : d,
          ),
        );

        toast.success("Doctor rejected successfully");
      }

      setConfirmModal({ open: false, type: "", doctor: null });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setProcessing(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredDoctors = doctors.filter(
    (d) =>
      d.status !== "REJECTED" &&
      (d.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        d.city?.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-background-light p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Doctors Management
        </h1>

        <span className="text-base font-semibold text-gray-600">
          Pending ({stats.pending})
        </span>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <div className="flex items-center bg-white rounded-lg shadow px-3 h-11 w-full">
          <span className="material-symbols-outlined px-3 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search doctor name or city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 py-3 text-sm bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <MiniStat
          label="Pending"
          value={stats.pending}
          icon="hourglass_top"
          accent="border-orange-500"
          text="text-orange-600"
        />
        <MiniStat
          label="Approved"
          value={stats.approved}
          icon="verified"
          accent="border-green-500"
          text="text-green-600"
        />
        <MiniStat
          label="Rejected"
          value={stats.rejected}
          icon="cancel"
          accent="border-red-500"
          text="text-red-600"
        />
      </div>

      {/* DOCTOR CARDS */}
      <div className="space-y-4">
        {filteredDoctors.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No doctors found matching your search
          </p>
        )}

        {filteredDoctors.map((d) => (
          <div
            key={d.user_id}
            className={`rounded-xl p-4 sm:p-5 mb-4 shadow-sm transition
    hover:shadow-md
    ${
      d.status === "PENDING"
        ? "bg-orange-50 border-l-4 border-orange-400"
        : d.status === "APPROVED"
          ? "bg-green-50 border-l-4 border-green-400"
          : "bg-red-50 border-l-4 border-red-400"
    }`}
          >
            {/* TOP */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full
  bg-gray-200 flex items-center justify-center font-bold
  text-base sm:text-lg"
              >
                {d.doctorName.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="font-bold text-sm sm:text-base truncate">
                    {d.doctorName}
                  </p>

                  <StatusBadge status={d.status} />
                </div>

                <p className="text-sm text-gray-500">
                  {d.specialization} • {d.city}
                </p>

                {d.rating && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <span className="material-symbols-outlined text-yellow-500 text-sm">
                      star
                    </span>
                    {d.rating}/5 Rating
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            {d.status === "PENDING" && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  disabled={processing}
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      type: "APPROVE",
                      doctor: d,
                    })
                  }
                  className="w-full sm:flex-1 h-9 rounded-md bg-green-600 text-white
                  text-sm font-semibold hover:bg-green-700 transition"
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
                  className="w-full sm:flex-1 h-9 rounded-md border border-red-500
  text-red-600 text-sm font-semibold hover:bg-red-50 transition"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

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
          Are you sure you want to <b>{isApprove ? "approve" : "reject"}</b>{" "}
          <span className="font-medium">{doctor.doctorName}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 border rounded-md text-sm font-medium
             hover:bg-gray-50 transition"
          >
            No
          </button>

          <button
            disabled={processing}
            onClick={onConfirm}
            className={`px-4 py-1.5 rounded-md text-white text-sm font-semibold
            hover:opacity-90 transition ${
              isApprove ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {processing
              ? "Processing..."
              : `Yes, ${isApprove ? "Approve" : "Reject"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatusBadge = ({ status }) => {
  const map = {
    PENDING: "bg-orange-100 text-orange-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}
    >
      {status}
    </span>
  );
};

const MiniStat = ({ label, value, icon, accent, text }) => {
  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${accent}hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className={`text-2xl font-bold mt-1 ${text}`}>{value}</p>
        </div>

        <div
          className={`h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ${text}`}
        >
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctor;