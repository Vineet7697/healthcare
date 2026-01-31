import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminDashboard = () => {
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
            d.user_id === doctor.user_id
              ? { ...d, status: "APPROVED" }
              : d
          )
        );

        toast.success("Doctor approved successfully");
      }

      if (type === "REJECT") {
        await api.put(`/admin/doctor/reject/${doctor.user_id}`);

        setDoctors((prev) =>
          prev.map((d) =>
            d.user_id === doctor.user_id
              ? { ...d, status: "REJECTED" }
              : d
          )
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
    d.status !== "REJECTED" && (
      d.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      d.city?.toLowerCase().includes(search.toLowerCase())
    )
);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Pending Doctors" value={stats.pending} color="yellow" />
        <StatCard title="Approved Doctors" value={stats.approved} color="green" />
        <StatCard title="Rejected Doctors" value={stats.rejected} color="red" />
      </div>

      {/* SEARCH */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Doctors List
        </h2>

        <input
          type="text"
          placeholder="Search by name or city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {filteredDoctors.length === 0 ? (
          <p className="p-6 text-gray-500">No doctors found</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Doctor</th>
                <th className="px-4 py-3 text-left">Specialization</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((d) => (
                <tr key={d.user_id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{d.doctorName}</td>
                  <td className="px-4 py-3">{d.specialization}</td>
                  <td className="px-4 py-3">{d.city}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        d.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : d.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center space-x-2">
                    {d.status === "PENDING" && (
                      <>
                        <button
                          disabled={processing}
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              type: "APPROVE",
                              doctor: d,
                            })
                          }
                          className="px-3 py-1 rounded bg-green-600 text-white"
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
                          className="px-3 py-1 rounded bg-red-600 text-white"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
          Are you sure you want to{" "}
          <b>{isApprove ? "approve" : "reject"}</b>{" "}
          <span className="font-medium">{doctor.doctorName}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            No
          </button>
          <button
            disabled={processing}
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white ${
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
const StatCard = ({ title, value, color }) => {
  const colors = {
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className={`rounded-xl p-6 shadow ${colors[color]}`}>
      <p className="text-sm">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default AdminDashboard;
