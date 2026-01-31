import React, { useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaNotesMedical,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../../../services/api";

/* ================= STATUS MAP ================= */
const mapStatus = (status) => {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "REJECTED":
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
};

const statusStyle = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-700 ring-green-200";
    case "Cancelled":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-gray-100 text-gray-600 ring-gray-200";
  }
};

/* ================= COMPONENT ================= */
const AppointmentsPage = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [view, setView] = useState("list"); // list | calendar
  const [loading, setLoading] = useState(false);

  /* ================= LOAD HISTORY ================= */
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const res = await api.get("/doctor/appointments/history");

      const normalized = (res.data.appointments || []).map((a) => ({
        id: a.id,
        patientName:
          a.familyMemberName || a.patientEmail || "Walk-in Patient",
        token: a.token_number,
        slot: a.appointment_slot,
        date: a.appointment_date,
        rawStatus: a.status,
        status: mapStatus(a.status),
      }));

      setAppointments(normalized);
    } catch (err) {
      console.error("Failed to load appointment history", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) =>
        a.patientName.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((a) =>
        filterStatus === "All" ? true : a.status === filterStatus,
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [appointments, search, filterStatus]);

  /* ================= EXPORT ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    filteredAppointments.forEach((a, i) => {
      doc.text(
        `${i + 1}. ${a.patientName} | Token ${a.token} | ${a.status}`,
        10,
        10 + i * 8,
      );
    });
    doc.save("appointment-history.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAppointments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "History");
    XLSX.writeFile(wb, "appointment-history.xlsx");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Appointment History
            </h2>
            <p className="text-sm text-gray-500">
              Completed, cancelled and rejected appointments
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              <FaFilePdf /> PDF
            </button>
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              <FaFileExcel /> Excel
            </button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
            <FaSearch className="text-gray-400" />
            <input
              className="outline-none text-sm"
              placeholder="Search patient"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border rounded-lg px-3 py-2 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setView("list")}
              className={`px-4 py-2 rounded-lg ${
                view === "list" ? "bg-teal-500 text-white" : "border"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-4 py-2 rounded-lg ${
                view === "calendar" ? "bg-teal-500 text-white" : "border"
              }`}
            >
              Calendar
            </button>
          </div>
        </div>

        {/* CALENDAR */}
        {view === "calendar" && (
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <Calendar className="mx-auto" />
          </div>
        )}

        {/* LIST */}
        {view === "list" &&
          (loading ? (
            <p className="text-gray-500">Loading history...</p>
          ) : filteredAppointments.length === 0 ? (
            <p className="text-gray-400">No appointment history found</p>
          ) : (
            filteredAppointments.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl shadow p-4 mb-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {a.patientName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Token #{a.token} • {a.slot}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(a.date).toDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ring-1 ${statusStyle(
                      a.status,
                    )}`}
                  >
                    {a.status}
                  </span>
                </div>

                {a.rawStatus === "COMPLETED" && (
                  <div className="mt-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/doctordashboard/visit-summary/${a.id}`,
                        )
                      }
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg flex items-center gap-2 cursor-pointer hover:bg-purple-600"
                    >
                      <FaNotesMedical />
                      View Visit Summary
                    </button>
                  </div>
                )}
              </div>
            ))
          ))}
      </div>
    </div>
  );
};

export default AppointmentsPage;
