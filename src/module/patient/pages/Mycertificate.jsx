import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const certificates = [
  {
    type: "Medical Fitness",
    name: "Medical Fitness Certificate",
    doctor: "Dr. Priya Sharma",
    date: "Mar 10, 2025",
    expiry: "Expires Mar 10, 2026",
    daysLeft: "356 days left",
    status: "Approved",
    progress: 94,
    accent: "#16a34a",
    accentBg: "#f0fdf4",
    icon: "🩺",
  },
  {
    type: "Vaccination",
    name: "COVID-19 Vaccination Certificate",
    doctor: "City Health Clinic",
    date: "Jan 22, 2025",
    expiry: "No expiry set",
    daysLeft: "",
    status: "Approved",
    progress: 75,
    accent: "#0d9488",
    accentBg: "#f0fdfa",
    icon: "💉",
  },
  {
    type: "Second Opinion",
    name: "Second Opinion Certificate",
    doctor: "Dr. Anand Mehta",
    date: "Mar 17, 2025",
    expiry: "Awaiting doctor approval",
    daysLeft: "",
    status: "Pending",
    progress: 0,
    accent: "#d97706",
    accentBg: "#fffbeb",
    icon: "📋",
  },
  {
    type: "Medical Fitness",
    name: "Medical Fitness Certificate",
    doctor: "Dr. Kavita Patel",
    date: "Mar 5, 2024",
    expiry: "Expired Mar 5, 2025",
    daysLeft: "",
    status: "Expired",
    progress: 100,
    accent: "#dc2626",
    accentBg: "#fef2f2",
    icon: "🩺",
  },
];

const timelineSteps = [
  { label: "Request submitted", date: "Mar 17, 2025 · 10:32 AM", state: "done" },
  { label: "Under review", date: "Mar 17, 2025 · 2:15 PM", state: "done" },
  {
    label: "Additional info requested",
    date: "Mar 18, 2025 · 9:00 AM",
    state: "active",
    note: "Dr. Anand Mehta has requested your recent lab reports to proceed.",
  },
  { label: "Awaiting your response", date: "Pending", state: "waiting" },
];

const statusConfig = {
  Approved: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  Expired: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
      {status}
    </span>
  );
}

// ── Certificate Card ─────────────────────────────────────────────────────────
function CertCard({ cert }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`bg-white border border-[#ece9e1] rounded-2xl p-[18px] flex flex-col gap-3.5 transition-all duration-200 cursor-default ${hovered ? "shadow-lg -translate-y-0.5" : "shadow-none"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: cert.accentBg }}
        >
          {cert.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold text-[#aaa] uppercase tracking-[.08em] mb-0.5">
            {cert.type}
          </div>
          <div className="text-[13px] font-semibold text-[#111] leading-[1.35]">
            {cert.name}
          </div>
          <div className="text-[12px] text-[#999] mt-0.5">
            {cert.doctor} · {cert.date}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-1 rounded-full bg-[#f0ede6] overflow-hidden mt-0.5">
          <div
            className="h-full rounded-full transition-all duration-[600ms] ease-in-out"
            style={{ background: cert.accent, width: `${cert.progress}%` }}
          />
        </div>
        <div className="text-[11px] text-[#aaa] mt-1.5 tabular-nums">
          {cert.expiry}{cert.daysLeft ? ` · ${cert.daysLeft}` : ""}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <StatusBadge status={cert.status} />
        <div className="flex gap-1.5">
          <button className="text-[12px] px-3 py-1.5 rounded-lg border border-[#e2e0d8] bg-transparent text-[#555] cursor-pointer hover:bg-gray-50 transition-colors">
            Share
          </button>
          <button className="text-[12px] px-3 py-1.5 rounded-lg border-none bg-[#111] text-white cursor-pointer hover:bg-[#333] transition-colors">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Wallet Tab ───────────────────────────────────────────────────────────────
function WalletTab({ showSuccess }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const visible = (cert) => {
    const q = search.toLowerCase();
    const matchQ = !q || cert.name.toLowerCase().includes(q) || cert.doctor.toLowerCase().includes(q);
    const matchT = !typeFilter || cert.type === typeFilter;
    const matchS = !statusFilter || cert.status === statusFilter;
    return matchQ && matchT && matchS;
  };

  const inputCls = "border border-[#e2e0d8] rounded-[10px] px-3.5 py-2 text-[13px] text-[#111] bg-white outline-none";

  return (
    <div>
      {/* Success banner */}
      {showSuccess && (
        <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3.5 mb-4">
          <span className="text-lg">✅</span>
          <span className="text-[13px] text-green-700 font-medium">
            Certificate request submitted successfully!
          </span>
        </div>
      )}

      {/* Title */}
      <div className="mb-5">
        <div className="text-[20px] font-semibold text-[#111] mb-1">Certificate wallet</div>
        <div className="text-[13px] text-[#888]">All your digital medical certificates in one place</div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          className={`${inputCls} w-[220px]`}
          type="text"
          placeholder="Search certificates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={`${inputCls} cursor-pointer text-[#555]`}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          <option>Medical Fitness</option>
          <option>Vaccination</option>
          <option>Second Opinion</option>
        </select>
        <select
          className={`${inputCls} cursor-pointer text-[#555]`}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All status</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Expired</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {certificates.filter(visible).map((cert, i) => (
          <CertCard key={i} cert={cert} />
        ))}
      </div>
    </div>
  );
}

// ── Track Tab ────────────────────────────────────────────────────────────────
function TrackTab() {
  const [hoverUpload, setHoverUpload] = useState(false);

  const tlDotCls = (state) => {
    if (state === "done") return "border-green-500 bg-green-500";
    if (state === "active") return "border-amber-500 bg-transparent";
    return "border-[#ddd] bg-transparent";
  };

  const tlLabelCls = (state) =>
    state === "waiting" ? "text-[#bbb]" : "text-[#111]";

  return (
    <div className="max-w-2xl">
      {/* Title */}
      <div className="mb-5">
        <div className="text-[20px] font-semibold text-[#111] mb-1">Track request status</div>
        <div className="text-[13px] text-[#888]">Monitor the progress of your certificate requests</div>
      </div>

      {/* Request card */}
      <div className="bg-white border border-[#ece9e1] rounded-2xl p-5 mb-4">
        {/* Card header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="text-[15px] font-semibold text-[#111]">Second Opinion Certificate</div>
            <div className="text-[12px] text-[#aaa] mt-0.5 font-mono">
              REQ-2025-0342 · Submitted Mar 17, 2025
            </div>
          </div>
          <StatusBadge status="Pending" />
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {timelineSteps.map((step, i) => (
            <div key={i} className="flex gap-3.5 relative">
              {/* Connector line */}
              {i < timelineSteps.length - 1 && (
                <div className="absolute left-[7px] top-5 bottom-[-4px] w-px bg-[#ece9e1]" />
              )}
              {/* Dot */}
              <div
                className={`w-[15px] h-[15px] rounded-full flex-shrink-0 mt-0.5 border-2 ${tlDotCls(step.state)}`}
              />
              {/* Body */}
              <div className="pb-5">
                <div className={`text-[13px] font-semibold ${tlLabelCls(step.state)}`}>
                  {step.label}
                </div>
                <div className="text-[11px] text-[#bbb] font-mono mt-0.5">{step.date}</div>
                {step.note && (
                  <div className="text-[12px] text-[#555] mt-2 px-3 py-2 bg-amber-50 rounded-lg border-l-[3px] border-amber-500 leading-[1.55]">
                    {step.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <div
          className={`border-[1.5px] border-dashed rounded-xl p-5 text-center mt-5 cursor-pointer transition-all duration-150 ${hoverUpload ? "bg-[#fafaf8] border-[#bbb]" : "bg-transparent border-[#ddd]"}`}
          onMouseEnter={() => setHoverUpload(true)}
          onMouseLeave={() => setHoverUpload(false)}
        >
          <div className="text-[22px] mb-1.5">📎</div>
          <div className="text-[13px] font-semibold text-[#333] mb-0.5">Upload lab reports</div>
          <div className="text-[11px] text-[#aaa] font-mono">PDF, JPG, PNG · up to 10 MB</div>
        </div>

        {/* Action row */}
        <div className="flex gap-2.5 mt-3.5">
          <button className="text-[13px] px-4 py-2 rounded-[10px] border-none bg-[#111] text-white font-medium cursor-pointer hover:bg-[#333] transition-colors">
            Submit documents
          </button>
          <button className="text-[13px] px-4 py-2 rounded-[10px] border border-[#ddd] bg-transparent text-[#555] font-medium cursor-pointer hover:bg-gray-50 transition-colors">
            Message doctor
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Root Component ───────────────────────────────────────────────────────────
const MyCertificate = () => {
  const [activeTab, setActiveTab] = useState("wallet");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const tabCls = (active) =>
    active
      ? "px-5 py-2 rounded-full border-none bg-[#111] text-white text-[13px] font-medium cursor-pointer tracking-[.01em] transition-all duration-[180ms]"
      : "px-5 py-2 rounded-full border border-[#e2e0d8] bg-white text-[#666] text-[13px] font-medium cursor-pointer tracking-[.01em] transition-all duration-[180ms] hover:bg-gray-50";

  return (
    <div className="min-h-screen bg-[#f0f4f8] pt-7 px-5 pb-12">
      <div className="max-w-7xl mx-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div className="flex gap-1.5">
            {["wallet", "track"].map((tab) => (
              <button
                key={tab}
                className={tabCls(activeTab === tab)}
                onClick={() => { setActiveTab(tab); setShowSuccess(false); }}
              >
                {tab === "wallet" ? "Wallet" : "Track status"}
              </button>
            ))}
          </div>

          <button
            className="flex items-center gap-[7px] px-[18px] py-[9px] rounded-[10px] border-none bg-[#0072BC] text-white text-[13px] font-semibold cursor-pointer shadow-[0_2px_8px_rgba(37,99,235,0.18)] transition-all duration-150 hover:bg-[#005fa3] hover:-translate-y-px"
            onClick={() => navigate("/client/apply-certificate")}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="6.5" stroke="white" strokeWidth="1.3" />
              <path d="M7.5 4.5v6M4.5 7.5h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Apply for Certificate
          </button>
        </div>

        {activeTab === "wallet"
          ? <WalletTab showSuccess={showSuccess} />
          : <TrackTab />
        }
      </div>
    </div>
  );
};

export default MyCertificate;