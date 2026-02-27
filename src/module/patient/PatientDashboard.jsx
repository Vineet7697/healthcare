import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getPatientDashboard,
  getTokenStatus,
} from "../../services/patientService";
import { Plus, Users } from "lucide-react";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:4000";

  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState("Patient");
  const [todayToken, setTodayToken] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    getPatientDashboard()
      .then((res) => {
        const data = res.data;

        setPatientName(data.patientName || "Patient");
        setTodayToken(data.todayToken || null);

        if (data.appointments) {
          const formatted = data.appointments.map((appt, index) => ({
            id: index,
            doctor: appt.doctorName,
            specialization: appt.specialization,
            date: appt.appointment_date,
            slot: appt.appointment_slot,
            token: appt.token_number,
            status: appt.status,
            familyName: appt.familyName,
            relation: appt.relation,
            isFamily: !!appt.family_member_id,
            img: appt.profile_image
              ? `${BASE_URL}${appt.profile_image}`
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }));

          setAppointments(formatted);
        }
      })
      .catch(() => toast.error("Dashboard load failed"))
      .finally(() => setLoading(false));
  }, []);

  const fetchTokenStatus = async (appointmentId) => {
    try {
      const res = await getTokenStatus(appointmentId);
      setTokenStatus(res.data);
    } catch (err) {
      console.error("Token status error:", err);
    }
  };

  useEffect(() => {
    if (todayToken?.appointmentId) {
      fetchTokenStatus(todayToken.appointmentId);

      const interval = setInterval(() => {
        fetchTokenStatus(todayToken.appointmentId);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [todayToken]);

  const upcomingCount = useMemo(() => appointments.length, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (activeTab === "today") {
      const today = new Date().toDateString();
      return appointments.filter(
        (appt) => new Date(appt.date).toDateString() === today,
      );
    }

    if (activeTab === "next7") {
      const today = new Date();
      const next7 = new Date();
      next7.setDate(today.getDate() + 7);

      return appointments.filter((appt) => {
        const apptDate = new Date(appt.date);
        return apptDate >= today && apptDate <= next7;
      });
    }

    return appointments;
  }, [appointments, activeTab]);

  const statusStyle = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-24">
        {/* HEADER */}
        <div className="flex justify-between items-center pt-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Hello, {patientName}
          </h2>
        </div>

        {/* TOP CARDS */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {/* UPCOMING */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 rounded-3xl shadow-lg text-white">
            <p className="text-sm sm:text-lg opacity-90">Upcoming Visits</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">
              {upcomingCount} Appointments
            </h2>
          </div>

          {/* TOKEN */}
          {todayToken && (
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-cyan-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Upcoming Token Visit
              </h3>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-cyan-600">
                  Token #{tokenStatus?.yourToken || todayToken.token}
                </h2>

                <span className="bg-cyan-100 text-cyan-600 px-4 py-1 rounded-full text-xs sm:text-sm font-medium w-fit">
                  {tokenStatus?.yourToken === tokenStatus?.nowServing
                    ? "ACTIVE NOW"
                    : tokenStatus?.nowServing
                      ? `Now Serving: #${tokenStatus.nowServing}`
                      : "Waiting..."}
                </span>

                {tokenStatus &&
                  tokenStatus.yourToken !== tokenStatus.nowServing && (
                    <p className="text-gray-500 mt-2 text-sm">
                      Approx Wait: {tokenStatus.estimatedWaitMinutes} mins
                    </p>
                  )}
              </div>

              <p className="text-gray-500 mt-2 text-sm">
                {todayToken.type} Visit
              </p>
            </div>
          )}

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-cyan-200">
            <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-4">
              <Action
                icon={<Plus />}
                label="BOOK NOW"
                onClick={() => navigate("/client/book-appointment")}
              />
              <Action
                icon={<Users />}
                label="FAMILY"
                onClick={() => navigate("/client/family")}
              />
            </div>
          </div>
        </div>

        {/* UPCOMING LIST HEADER */}
        <div className="flex justify-between items-center mt-10">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">
            Upcoming List
          </h3>

          <button
            onClick={() => navigate("/client/myappointment")}
            className="text-cyan-600 font-medium text-sm sm:text-base"
          >
            View All
          </button>
        </div>

        {/* TABS */}
        <div className="mt-4 overflow-x-auto">
          <div className="bg-gray-100 rounded-full flex p-1 w-max">
            {["all", "today", "next7"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-cyan-500 text-white shadow"
                    : "text-gray-600"
                }`}
              >
                {tab === "all"
                  ? "All"
                  : tab === "today"
                    ? "Today"
                    : "Next 7 Days"}
              </button>
            ))}
          </div>
        </div>

        {/* APPOINTMENT LIST */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <div key={appt.id} className="bg-white rounded-3xl shadow-md p-5">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <img
                      src={appt.img}
                      className="w-12 h-12 rounded-full object-cover"
                      alt="doctor"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        Dr. {appt.doctor}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {appt.specialization}
                      </p>

                      {appt.isFamily ? (
                        <p className="text-xs text-purple-600 mt-1 font-medium">
                          👨‍👩‍👦 {appt.familyName}
                        </p>
                      ) : (
                        <p className="text-xs text-green-600 mt-1 font-medium">
                          👤 Self
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusStyle(
                      appt.status,
                    )}`}
                  >
                    {appt.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between mt-5 bg-gray-100 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-600 gap-2 sm:gap-0">
                  <p>{new Date(appt.date).toDateString()}</p>
                  <p>{appt.slot}</p>
                  <p className="font-semibold text-cyan-600">
                    TOKEN #{appt.token}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No upcoming appointments</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Action({ icon, label, onClick }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
      onClick={onClick}
    >
      <div className="text-blue-600">{icon}</div>
      <p className="text-xs sm:text-sm font-semibold text-gray-700">{label}</p>
    </div>
  );
}
