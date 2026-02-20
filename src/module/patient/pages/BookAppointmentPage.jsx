import React, { useState, useEffect } from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { bookVisitAppointment } from "../../../services/patientService";

/* ✅ LOCAL DATE HELPER (IST SAFE) */
const getLocalDate = (offsetDays = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(0, 0, 0, 0);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* ================= STATE ================= */
  const [doctor, setDoctor] = useState(null);

  const [patientType, setPatientType] = useState("SELF");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyId, setSelectedFamilyId] = useState("");

  const [selectedDateType, setSelectedDateType] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [selectedSession, setSelectedSession] = useState("");

  /* ================= FAMILY MEMBERS SYNC ================= */
  const loadFamilyMembers = () => {
    const stored = JSON.parse(localStorage.getItem("familyMembers")) || [];
    setFamilyMembers(stored);

    // ❌ agar selected member delete ho gaya ho
    if (
      selectedFamilyId &&
      !stored.some((m) => String(m.id) === String(selectedFamilyId))
    ) {
      setSelectedFamilyId("");
      setPatientType("SELF");
    }
  };

  useEffect(() => {
    // initial load
    loadFamilyMembers();

    // 🔁 different tab / window
    const handleStorageChange = (e) => {
      if (e.key === "familyMembers") {
        loadFamilyMembers();
      }
    };

    // 🔁 same tab (Add/Delete page se wapas aane par)
    const handleFocus = () => {
      loadFamilyMembers();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [selectedFamilyId]);

  /* ================= FETCH DOCTOR ================= */
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get("/patient/visit/doctors");

        const foundDoctor = res.data.doctors?.find(
          (doc) => String(doc.doctorId) === String(id),
        );

        if (!foundDoctor) {
          toast.error("Doctor not found");
          navigate(-1);
          return;
        }

        setDoctor(foundDoctor);
      } catch {
        toast.error("Failed to load doctor");
      }
    };

    if (id) fetchDoctor();
  }, [id, navigate]);

  /* ================= RESET SESSION ================= */
  useEffect(() => {
    setSelectedSession("");
  }, [selectedDateType]);

  /* ================= CONFIRM APPOINTMENT ================= */
  const handleConfirm = async () => {
    if (!doctor) return;

    if (patientType === "OTHER" && !selectedFamilyId) {
      toast.error("Please select a family member");
      return;
    }

    if (selectedDateType !== "today" && !selectedSession) {
      toast.error("Please select Morning or Evening");
      return;
    }

    const appointmentDate =
      selectedDateType === "today"
        ? getLocalDate(0)
        : selectedDateType === "tomorrow"
          ? getLocalDate(1)
          : customDate;

    const payload = {
      doctorId: doctor.doctorId,
      appointmentType: doctor.placeType, // CLINIC | HOSPITAL
      bookingFor: patientType, // ✅ SELF | OTHER

      // ✅ ONLY send when OTHER
      ...(patientType === "OTHER" && {
        familyMemberId: selectedFamilyId,
      }),

      appointmentDate,
      slot: selectedDateType === "today" ? "MORNING" : selectedSession,
    };

    try {
      const res = await bookVisitAppointment(payload);

      toast.success("Appointment booked successfully");

      navigate("/client/patientqueuepage", {
        state: {
          appointmentId: res.data.appointmentId, // ✅ REQUIRED
          token: res.data.token,
          slot: res.data.slot,
          bookingFor: patientType, // SELF | OTHER
          patientName:
            patientType === "SELF"
              ? "You"
              : familyMembers.find(
                  (f) => String(f.id) === String(selectedFamilyId),
                )?.name || "Family Member",
        },
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    }
  };

  /* ================= LOADING ================= */
  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading doctor details...</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-300 px-3 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-4 sm:p-8">
        <h3 className="text-2xl font-semibold text-center mb-6">
          Book Appointment for {doctor.doctorName}
        </h3>

        {/* 🧍 Patient Type */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-6">
          <button
            onClick={() => {
              setPatientType("SELF");
              setSelectedFamilyId("");
            }}
            className={`w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
              patientType === "SELF"
                ? "bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white"
                : "border border-gray-300"
            }`}
          >
            <FaUser /> Self
          </button>

          <select
            disabled={familyMembers.length === 0}
            value={patientType === "OTHER" ? selectedFamilyId : ""}
            onChange={(e) => {
              setPatientType("OTHER");
              setSelectedFamilyId(e.target.value);
            }}
            className="w-full sm:w-44 px-4 py-3 rounded-lg border cursor-pointer"
          >
            <option value="">Select Family</option>

            {familyMembers.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {m.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => navigate("/client/addfamilypage")}
            className="w-full sm:w-auto  flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer hover:bg-gray-100"
          >
            <FaUsers /> Add Family
          </button>
        </div>

        {/* 📅 Date */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {["today", "tomorrow"].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDateType(d)}
              className={`px-4 py-2 rounded-lg border ${
                selectedDateType === d
                  ? "bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white cursor-pointer"
                  : "border-gray-300 cursor-pointer"
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}

          <input
            type="date"
            min={getLocalDate(0)}
            value={customDate}
            onChange={(e) => {
              setSelectedDateType("custom");
              setCustomDate(e.target.value);
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border"
          />
        </div>

        {/* 🌅 Session */}
        {selectedDateType !== "today" && (
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-6">
            {["MORNING", "EVENING"].map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSession(slot)}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl border font-semibold ${
                  selectedSession === slot
                    ? "bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white cursor-pointer"
                    : "border-gray-300 cursor-pointer"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleConfirm}
          className="w-full py-3 rounded-xl bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white font-bold text-lg cursor-pointer hover:opacity-90"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
};

export default BookAppointmentPage;




