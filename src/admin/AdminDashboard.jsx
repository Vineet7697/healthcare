import React from "react";
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fc] via-white to-[#eef3ff]">
      <main className="p-8 max-w-[1400px] mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              📊 Admin Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Monitor appointments performance & trends
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-md border">
              <FiSearch className="text-gray-400" />
              <input
                placeholder="Search analytics..."
                className="ml-2 outline-none text-sm bg-transparent"
              />
            </div>
            <button className="p-2 rounded-xl bg-white shadow hover:scale-105 transition">
              <FiBell className="text-gray-600" size={18} />
            </button>
            <button className="p-2 rounded-xl bg-white shadow hover:scale-105 transition">
              <FiSettings className="text-gray-600" size={18} />
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white/70 backdrop-blur rounded-3xl p-6 shadow-lg mb-10 flex flex-wrap gap-6 items-end border">
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs font-medium text-gray-500">FROM</label>
            <input
              type="date"
              className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs font-medium text-gray-500">TO</label>
            <input
              type="date"
              className="w-full border rounded-xl px-4 py-2 mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition">
            Apply Filter
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Appointments"
            value="1,240"
            icon={<FiTrendingUp />}
            color="from-blue-500 to-indigo-500"
          />
          <StatCard
            title="Completed"
            value="850"
            icon={<FiCheckCircle />}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            title="Cancelled"
            value="120"
            icon={<FiXCircle />}
            color="from-red-500 to-rose-500"
          />
          <StatCard
            title="Pending"
            value="270"
            icon={<FiClock />}
            color="from-yellow-400 to-orange-400"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg h-72 border">
            <h3 className="font-semibold text-gray-700 mb-1">
              Daily Appointment Trend
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Activity volume over the last 7 days
            </p>
            <div className="h-full flex items-center justify-center text-gray-400">
              📈 Line Chart Placeholder
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg h-72 border">
            <h3 className="font-semibold text-gray-700 mb-4">
              Status Distribution
            </h3>
            <div className="h-full flex items-center justify-center text-gray-400">
              🍩 Donut Chart Placeholder
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#1f2933] text-white rounded-3xl p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-2xl">
          <Insight title="Busiest Day" value="Thursday" />
          <Insight title="Completion Rate" value="92%" />
          <Insight title="Peak Hour" value="10:00 AM" />
          <Insight title="Growth Trend" value="+8%" />
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="relative bg-white rounded-3xl p-5 shadow-lg hover:-translate-y-1 transition border overflow-hidden">
    <div
      className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`}
    ></div>
    <div className="flex items-center justify-between mb-3">
      <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
        +8%
      </span>
    </div>
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
  </div>
);

const Insight = ({ title, value }) => (
  <div className="rounded-2xl p-4 bg-white/5 backdrop-blur border border-white/10">
    <p className="text-xs uppercase tracking-wider text-gray-300">{title}</p>
    <h3 className="text-2xl font-semibold mt-1">{value}</h3>
  </div>
);

export default AdminDashboard;