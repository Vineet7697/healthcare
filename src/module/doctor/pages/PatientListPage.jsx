import React, { useState, useEffect, useMemo } from "react";
import api from "../../../services/api";

const PatientListPage = () => {
  const doctor = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD PATIENTS ================= */
  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      try {
        /**
         * ✅ backend real API
         * Patient list = today's appointments
         */
        const res = await api.get(
          "/doctor/appointments/history",
          { params: { filter: "today" } }
        );

        const normalized = (res.data.appointments || []).map(
          (a) => ({
            id: a.id,
            name:
              a.familyMemberName ||
              a.patientEmail ||
              "Unknown",
            status: a.status,
          })
        );

        setPatients(normalized);
      } catch (error) {
        console.error("Failed to load patients", error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  /* ================= STATUS BADGE ================= */
  const getStatusClasses = (status) => {
    switch (status) {
      case "PENDING":
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /* ================= FILTER ================= */
  const filteredPatients = useMemo(() => {
    return patients.filter(
      (p) =>
        p.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        (filterStatus === "All" ||
          p.status === filterStatus)
    );
  }, [patients, searchQuery, filterStatus]);

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-linear-to-br from-white to-blue-50 flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col w-full">
        <main className="p-4 sm:p-6 flex-1 overflow-x-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 mt-2 text-center sm:text-left">
            Today's Patients
          </h2>

          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search patients..."
                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-400"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
              />
              <select
                className="mt-2 sm:mt-0 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full sm:w-auto"
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value)
                }
              >
                <option>All</option>
                <option>PENDING</option>
                <option>ACCEPTED</option>
                <option>IN_PROGRESS</option>
                <option>COMPLETED</option>
                <option>CANCELLED</option>
                <option>REJECTED</option>
              </select>
            </div>
          </div>

          {/* Patient Table */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-4 sm:px-6 font-semibold">
                    Patient Name
                  </th>
                  <th className="py-3 px-4 sm:px-6 font-semibold">
                    Status
                  </th>
                  <th className="py-3 px-4 sm:px-6 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 sm:px-6">
                      {p.name}
                    </td>
                    <td className="py-3 px-4 sm:px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusClasses(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:px-6">
                      <button className="text-blue-600 hover:underline text-sm sm:text-base">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading &&
              filteredPatients.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm sm:text-base">
                  No patients found.
                </div>
              )}

            {loading && (
              <div className="text-center py-6 text-gray-500">
                Loading patients…
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientListPage;
