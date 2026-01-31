import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import api from "../../../utils/api";

/* ================= HELPERS ================= */

const iconMap = {
  Appointment: "🩺",
  Consultation: "💬",
  "Medical Record": "📄",
  Prescription: "💊",
};

const typeColor = {
  Appointment: "bg-green-100 text-green-700",
  Consultation: "bg-purple-100 text-purple-700",
  "Medical Record": "bg-blue-100 text-blue-700",
  Prescription: "bg-orange-100 text-orange-700",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const generateAISummary = (timeline) => {
  if (!timeline.length) return "No health activity available.";

  const counts = timeline.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {});

  return `Patient consulted ${
    counts.Consultation || 0
  } times, had ${counts.Appointment || 0} appointments,
uploaded ${counts["Medical Record"] || 0} medical records
and received ${counts.Prescription || 0} prescriptions.`;
};

const exportTimelinePDF = (timeline) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Health Timeline Report", 20, 20);

  let y = 35;
  doc.setFontSize(12);

  timeline.forEach((item) => {
    doc.text(`${item.type} - ${item.title} (${item.date})`, 20, y);
    y += 8;

    if (item.description) {
      doc.setFontSize(10);
      doc.text(item.description, 24, y);
      y += 8;
      doc.setFontSize(12);
    }

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("Health_Timeline_Report.pdf");
};

/* ================= COMPONENT ================= */

const HealthTimeline = ({ role = "patient" }) => {
  const [timeline, setTimeline] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  /* ================= LOAD FROM JSON ================= */
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.get("/healthTimeline");
        setTimeline(
          res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchTimeline();
  }, []);

  const filtered = timeline.filter((item) => {
    const matchType = filter === "All" || item.type === filter;
    const matchSearch = (item.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <>
     <section className="min-h-screen bg-gray-50 py-10 px-4  bg-linear-to-b from-[#cfeeff] to-[#e9f8ff]">
    <div className="bg-white p-6 rounded-2xl shadow max-w-5xl mx-auto mt-20 ">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Health Timeline</h2>

        <div className="flex gap-8 flex-wrap">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" bg-gray-200 px-3 py-2 rounded-lg outline-none"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="outline-none shadow px-2 py-1 rounded-lg bg-gray-200"
          >
            <option value="All">All</option>
            {Object.keys(iconMap).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <button
            onClick={() => exportTimelinePDF(filtered)}
            className="bg-green-600 text-white px-3 py-1 rounded-lg"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* AI SUMMARY */}
      <div className=" mb-6 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
        <h4 className="font-semibold mb-1">AI Health Summary</h4>
        <p className="text-sm text-gray-700 ">
          {generateAISummary(filtered)}
        </p>
      </div>

      {/* TIMELINE */}
      <div className="relative border-l-2 border-blue-200 pl-6 space-y-6">
        {filtered.map((item) => (
          <div key={item.id} className="relative">
            <span className="absolute -left-2.25 top-2 w-4 h-4 bg-blue-600 rounded-full" />

            <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex gap-3">
                <span className="w-9 h-9 flex items-center justify-center bg-blue-100 rounded-full">
                  {iconMap[item.type]}
                </span>

                <div className="flex-1">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-xs text-gray-500">
                    {formatDate(item.date)}
                  </p>

                  {expanded === item.id && item.description && (
                    <p className="text-sm mt-2 text-gray-600">
                      {item.description}
                    </p>
                  )}

                  {item.description && (
                    <button
                      onClick={() =>
                        setExpanded(expanded === item.id ? null : item.id)
                      }
                      className="text-xs text-blue-600 mt-1"
                    >
                      {expanded === item.id ? "Show less" : "View details"}
                    </button>
                  )}

                  <span
                    className={`inline-block mt-3 text-xs px-3 py-1 rounded-full ${typeColor[item.type]}`}
                  >
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
    </>
  );
};

export default HealthTimeline;
