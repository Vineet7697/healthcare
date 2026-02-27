import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

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
    } catch {
      toast.error("Failed to load admin dashboard");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ================= APPROVE / REJECT ================= */
  const handleConfirmAction = async () => {
    const { type, doctor } = confirmModal;
    if (!doctor?.user_id) return toast.error("Invalid doctor");

    try {
      setProcessing(true);
      const endpoint =
        type === "APPROVE"
          ? `/admin/doctor/approve/${doctor.user_id}`
          : `/admin/doctor/reject/${doctor.user_id}`;

      await api.put(endpoint);
      toast.success(type === "APPROVE" ? "Doctor approved" : "Doctor rejected");
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Doctors Management</h1>
        <span className="text-base font-semibold text-gray-600">
          Pending ({stats.pending})
        </span>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <input
          placeholder="Search by doctor name or city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-xl border px-4 py-2 shadow-sm focus:outline-none"
        />

        <div className="flex gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                statusFilter === s
                  ? s === "PENDING"
                    ? "bg-orange-600 text-white"
                    : s === "APPROVED"
                      ? "bg-green-600 text-white"
                      : s === "REJECTED"
                        ? "bg-red-600 text-white"
                        : "bg-gray-900 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* DOCTOR CARDS (LIKE IMAGE UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleDoctors.map((d) => (
          <div
            key={d.user_id}
            className="bg-white rounded-2xl shadow p-5 relative"
          >
            {/* STATUS */}
            <span className="absolute top-3 right-3 bg-orange-100 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold">
              {d.status}
            </span>

            <div className="flex gap-4">
              {/* IMAGE */}
              <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-200">
                {d.profile_image && !imageError[d.user_id] ? (
                  <img
                    src={getDoctorImageUrl(d.profile_image)}
                    alt={d.doctorName}
                    className="h-full w-full object-cover"
                    onError={() =>
                      setImageError((prev) => ({ ...prev, [d.user_id]: true }))
                    }
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center font-bold text-lg">
                    {d.doctorName?.charAt(0)}
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <p className="text-lg font-bold">{d.doctorName}</p>
                <p className="text-blue-600 font-medium">{d.specialization}</p>
                <p className="text-sm text-gray-500 mt-1">
                  📍 {d.city} • 🧳 {d.experience || "5"}y Exp.
                </p>
                <p className="text-sm text-blue-500 mt-1">
                  ⭐ {d.rating || "4.9"} ({d.reviews || "120"})
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => navigate("/admin/doctorsdetails")}
                className="flex-1 bg-blue-500  text-white py-2 rounded-xl font-semibold hover:bg-blue-600"
              >
                View Details
              </button>

              {/* 3 DOT MENU */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === d.user_id ? null : d.user_id);
                  }}
                  className="w-12 py-2 rounded-xl border flex items-center justify-center text-gray-500 hover:bg-gray-100"
                >
                  ⋯
                </button>

                {activeMenu === d.user_id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-50"
                  >
                    <button
                      onClick={() => {
                        setConfirmModal({
                          open: true,
                          type: "APPROVE",
                          doctor: d,
                        });
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 hover:rounded-t-xl"
                    >
                      Approve Application
                    </button>

                    <button
                      onClick={() => {
                        setConfirmModal({
                          open: true,
                          type: "REJECT",
                          doctor: d,
                        });
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:rounded-b-xl"
                    >
                      Reject Application
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* APPROVE / REJECT */}
            {d.status === "PENDING" && (
              <div className="flex gap-2 mt-4">
                <button
                  disabled={processing}
                  onClick={() =>
                    setConfirmModal({ open: true, type: "APPROVE", doctor: d })
                  }
                  className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold"
                >
                  Approve
                </button>
                <button
                  disabled={processing}
                  onClick={() =>
                    setConfirmModal({ open: true, type: "REJECT", doctor: d })
                  }
                  className="flex-1 py-2 rounded-lg border border-red-500 text-red-600 text-sm font-semibold"
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
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
            className="px-6 py-2 rounded-lg border bg-white font-semibold"
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

/* ================= MODAL ================= */
const ConfirmModal = ({ type, doctor, onCancel, onConfirm, processing }) => {
  const isApprove = type === "APPROVE";
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-3">
          {isApprove ? "Approve Doctor" : "Reject Doctor"}
        </h3>
        <p className="mb-6 text-gray-600">
          Are you sure you want to {isApprove ? "approve" : "reject"}{" "}
          <b>{doctor?.doctorName}</b>?
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-1.5 border rounded-md">
            No
          </button>
          <button
            disabled={processing}
            onClick={onConfirm}
            className={`px-4 py-1.5 rounded-md text-white ${
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
