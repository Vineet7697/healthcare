import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f4f6f8] px-6 py-6 text-slate-900">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="flex items-center gap-3 bg-white px-4 h-11 rounded-xl shadow border w-full sm:w-[320px]">
          <span className="material-symbols-outlined text-slate-400 shrink-0">
            search
          </span>
          <input
            placeholder="Search doctors, patients..."
            className="flex-1 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Doctors"
          value="124"
          icon="stethoscope"
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Pending Doctors"
          value="8"
          icon="hourglass_top"
          gradient="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Patients"
          value="1,240"
          icon="groups"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Today Appointments"
          value="45"
          icon="calendar_month"
          gradient="from-purple-500 to-purple-600"
        />
      </section>

      {/* WEEKLY APPOINTMENTS */}
      <section className="bg-white rounded-2xl p-6 shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Weekly Appointments</h2>
          <span className="text-xs text-slate-400">Last 7 days</span>
        </div>

        <svg
          className="w-full h-40"
          viewBox="0 0 400 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0 90 Q 40 70, 80 80 T 160 40 T 240 70 T 320 30 T 400 25"
            fill="none"
            stroke="#308ce8"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="bg-white rounded-2xl p-6 shadow">
        <h2 className="font-bold mb-4">Recent Activity</h2>

        <ul className="space-y-4">
          <ActivityItem
            icon="person_add"
            label="New patient registered"
            time="2 min ago"
          />
          <ActivityItem
            icon="verified"
            label="Doctor approved"
            time="15 min ago"
          />
          <ActivityItem
            icon="event"
            label="Appointment scheduled"
            time="1 hour ago"
          />
        </ul>
      </section>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, icon, gradient }) => (
  <div
    className={`rounded-2xl p-5 text-white shadow-md
                bg-gradient-to-r ${gradient}
                hover:scale-[1.02] transition`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>

      <span className="material-symbols-outlined text-4xl opacity-30 shrink-0">
        {icon}
      </span>
    </div>
  </div>
);

const ActivityItem = ({ icon, label, time }) => (
  <li className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
        <span className="material-symbols-outlined text-sm">{icon}</span>
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>

    <span className="text-xs text-slate-400">{time}</span>
  </li>
);

export default AdminDashboard;