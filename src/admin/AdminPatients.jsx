import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD PATIENTS ================= */
  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/patients");
      // 🔥 backend returns { patients: [...] }
      setPatients(res.data.patients || []);
    } catch (err) {
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
      toast.success(
        patient.is_active ? "User blocked" : "User unblocked",
      );
      loadPatients();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {!loading && patients.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No patients found
                </td>
              </tr>
            )}

            {patients.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">{p.email || "-"}</td>
                <td className="px-4 py-3">{p.mobile || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      p.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.is_active ? "ACTIVE" : "BLOCKED"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleBlock(p)}
                    className={`px-3 py-1 rounded text-white text-xs ${
                      p.is_active ? "bg-red-600" : "bg-green-600"
                    }`}
                  >
                    {p.is_active ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <p className="p-4 text-center text-gray-500">
            Loading...
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminPatients;
