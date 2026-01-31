import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    try {
      const res = await api.get("/admin/appointments");
      setAppointments(res.data.appointments || []);
    } catch {
      toast.error("Failed to load appointments");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await api.put(`/admin/appointments/${id}/cancel`);
      toast.success("Appointment cancelled");
      loadAppointments();
    } catch {
      toast.error("Cancel failed");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Patient</th>
              <th className="px-4 py-3 text-left">Doctor</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-t">
                {/* ✅ Patient (email only, backend reality) */}
                <td className="px-4 py-3">
                  {a.patientEmail || a.patientName || "—"}
                </td>

                {/* ✅ Doctor name */}
                <td className="px-4 py-3">
                  {a.doctorName || "—"}
                </td>

                {/* ✅ Date formatted */}
                <td className="px-4 py-3">
                  {formatDate(a.appointment_date)}
                </td>

                {/* ✅ Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      a.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : a.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>

                {/* ✅ Action */}
                <td className="px-4 py-3 text-center">
                  {a.status !== "CANCELLED" &&
                    a.status !== "COMPLETED" && (
                      <button
                        onClick={() => cancelAppointment(a.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Cancel
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {appointments.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No appointments found
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
