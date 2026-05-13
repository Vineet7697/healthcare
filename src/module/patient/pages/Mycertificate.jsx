import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CertificateModal from "../../../components/common/CertificateModal";
import {
  getMyRequests,
  getRequestById,
  downloadCertificate,
} from "../../../services/certificateService";

// ─────────────────────────────────────────────────────────────────────────────
// Config & Helpers
// ─────────────────────────────────────────────────────────────────────────────
const statusConfig = {
  Pending: {
    bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500"
  },

 verification: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },

  payment_verified: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },


  Approved: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },

  Rejected: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

// Normalize status string → "Approved" / "Pending" / etc.
const normalizeStatus = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "Pending";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "N/A");

// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge
// ─────────────────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = statusConfig[status] ?? {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CertCard  — receives raw DB row, does its own mapping internally
// ─────────────────────────────────────────────────────────────────────────────
function CertCard({ rawCert, onView, onDownload, onTrack }) {
  const [hovered, setHovered] = useState(false);

  // Derive display values from raw DB row
  const status = normalizeStatus(rawCert.status);
  const certType = rawCert.certificate_type || "Certificate";
  const doctorName = rawCert.doctor_name || "Assigned Doctor";
  const createdAt = fmtDate(rawCert.created_at);

  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-2xl p-[18px] flex flex-col gap-3.5 transition-all duration-200 cursor-default ${
        hovered ? "shadow-[0_8px_24px_rgba(37,99,235,0.10)] -translate-y-0.5" : "shadow-none"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: "#f0fdf4" }}
        >
          📄
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold text-[#aaa] uppercase tracking-[.08em] mb-0.5">
            {certType}
          </div>
          <div className="text-[13px] font-semibold text-[#111] leading-[1.35]">
            {certType} Certificate
          </div>
          <div className="text-[12px] text-[#999] mt-0.5">
            {doctorName} · {createdAt}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <StatusBadge status={status} />
        <div className="flex gap-1.5">
          {/* View → opens modal with full cert details */}

          {/* Track → switches to Track tab and loads this request's timeline */}
          <button
            className="text-[12px] px-3 py-1.5 rounded-lg border border-[#e2e0d8] bg-transparent text-[#555] hover:bg-gray-50 transition-colors"
            onClick={() => onTrack(rawCert.id)}
          >
            Track
          </button>
          {/* Download → only enabled when Approved */}
          <button
            className={`text-[12px] px-3 py-1.5 rounded-lg border-none text-white transition-colors ${
             status.toLowerCase() === "approved"
                ? "bg-[#2563EB] cursor-pointer hover:bg-[#333]"
                : "bg-[#ccc] cursor-not-allowed"
            }`}
            onClick={() => status.toLowerCase() === "approved" && onDownload(rawCert)}
            disabled={status.toLowerCase() !== "approved"}
            title={
              status !== "approved" ? "Download available after approval" : ""
            }
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WalletTab
// ─────────────────────────────────────────────────────────────────────────────
function WalletTab({ certificates, showSuccess, onView, onDownload, onTrack }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filter against raw DB fields
  const visible = (cert) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      cert.certificate_type?.toLowerCase().includes(q) ||
      cert.doctor_name?.toLowerCase().includes(q);
    const matchT =
      !typeFilter ||
      cert.certificate_type?.toLowerCase() === typeFilter.toLowerCase();
    const matchS =
      !statusFilter || normalizeStatus(cert.status) === statusFilter;
    return matchQ && matchT && matchS;
  };

  const inputCls =
    "border border-[#e2e0d8] rounded-[10px] px-3.5 py-2 text-[13px] text-[#111] bg-white outline-none";

  const filtered = certificates.filter(visible);

  return (
    <div>
      {/* Title */}
      <div className="mb-5">
        <div className="text-[20px] font-semibold text-[#111] mb-1">
          Certificate wallet
        </div>
        <div className="text-[13px] text-[#888]">
          All your digital medical certificates in one place
        </div>
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
          <option value="medical">Medical</option>
          <option value="vaccination">Vaccination</option>
          <option value="second opinion">Second Opinion</option>
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
          <option>Rejected</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#bbb] text-[14px]">
          No certificates found.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filtered.map((cert) => (
            <CertCard
              key={cert.id}
              rawCert={cert} // ← raw DB row, no pre-mapping
              onView={onView}
              onDownload={onDownload}
              onTrack={onTrack}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TrackTab
// ─────────────────────────────────────────────────────────────────────────────
function TrackTab({ requestId }) {
  const [hoverUpload, setHoverUpload] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildTimeline = (status) => {
const steps = [
  "Pending",
  "verification",
  "payment_verified",
  "approved",
];

const labels = {
  Pending: "Request Submitted",
  verification: "Under Verification",
  payment_verified: "Payment Verified",
  approved: "Approved",
};

    // REJECTED CASE
    if (status === "rejected") {
      return [
        {
          label: "Request Submitted",
          state: "done",
        },

        {
          label: "Under Verification",
          state: "done",
        },

        {
          label: "Rejected",
          state: "done",
          note: "Your certificate request has been rejected.",
        },
      ];
    }

    const currentIndex = steps.indexOf(status);

    return steps.map((step, index) => ({
      label: labels[step],

      state:
        index < currentIndex
          ? "done"
          : index === currentIndex
            ? "active"
            : "waiting",

      created_at: new Date(),
    }));
  };

  useEffect(() => {
    if (!requestId) return;

    const fetchRequestDetails = async () => {
      setLoading(true);
      setError(null);
      setSelectedRequest(null);
      setTimeline([]);
      try {
        const res = await getRequestById(requestId);
        // Backend returns: { request: {...}, timeline: [...] }
        setSelectedRequest(res.data.request);
        setTimeline(buildTimeline(res.data.request.status));
      } catch (err) {
        console.error("Error fetching request details:", err);
        setError("Failed to load request details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

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
        <div className="text-[20px] font-semibold text-[#111] mb-1">
          Track request status
        </div>
        <div className="text-[13px] text-[#888]">
          Monitor the progress of your certificate requests
        </div>
      </div>

      {/* No request selected */}
      {!requestId && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center">
          <div className="text-3xl mb-3">🗂️</div>
          <div className="text-[14px] font-semibold text-[#333] mb-1">
            No request selected
          </div>
          <div className="text-[13px] text-[#aaa]">
            Go to <strong>Wallet</strong>, click the <strong>Track</strong>{" "}
            button on any certificate to monitor its progress.
          </div>
        </div>
      )}

      {/* Loading */}
      {requestId && loading && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center text-[#aaa] text-[13px]">
          Loading request details…
        </div>
      )}

      {/* Error */}
      {requestId && !loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-[13px] text-red-600">
          {error}
        </div>
      )}

      {/* Request card */}
      {requestId && !loading && !error && selectedRequest && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 mb-4">
          {/* Card header */}
          <div className="flex flex-wrap justify-between items-start gap-2 mb-5">
            <div className="text-[15px] font-semibold text-[#111]">
              {selectedRequest.certificate_type || "Certificate"}
            </div>
            <div className="text-[12px] text-[#aaa] font-mono">
              #{selectedRequest.id} · Submitted{" "}
              {fmtDate(selectedRequest.created_at)}
            </div>
            <StatusBadge status={normalizeStatus(selectedRequest.status)} />
          </div>

          {/* Timeline */}
          {timeline.length > 0 ? (
            <div className="flex flex-col">
              {timeline.map((step, i) => (
                <div key={step.id ?? i} className="flex gap-3.5 relative">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[7px] top-5 bottom-[-4px] w-px bg-[#E2E8F0]" />
                  )}
                  <div
                    className={`w-[15px] h-[15px] rounded-full flex-shrink-0 mt-0.5 border-2 ${tlDotCls(step.state)}`}
                  />
                  <div className="pb-5">
                    <div
                      className={`text-[13px] font-semibold ${tlLabelCls(step.state)}`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[11px] text-[#bbb] font-mono mt-0.5">
                      {step.date ?? fmtDate(step.created_at)}
                    </div>
                    {step.note && (
                      <div className="text-[12px] text-[#555] mt-2 px-3 py-2 bg-amber-50 rounded-lg border-l-[3px] border-amber-500 leading-[1.55]">
                        {step.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[12px] text-[#bbb] py-3 text-center">
              No timeline events yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root Component — MyCertificate
// ─────────────────────────────────────────────────────────────────────────────
const MyCertificate = () => {
  const [activeTab, setActiveTab] = useState("wallet");
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalCert, setModalCert] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);

      // Remove state after showing message
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ── Fetch certificate list on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await getMyRequests();
        console.log("📦 API Response:", res.data);
        setCertificates(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("❌ Error fetching certificates:", error);
        setCertificates([]);
      } finally {
        setLoadingList(false);
      }
    };

    fetchCertificates();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Switches to Track tab and sets the requestId to load
  const handleTrack = (id) => {
    setSelectedRequestId(id);
    setActiveTab("track");
  };

  const handleConfirmDownload = async (id) => {
    try {
      const res = await downloadCertificate(id);

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      setModalCert(null); // Close modal after download
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to open certificate PDF");
    }
  };

  // Downloads PDF
  const handleDownload = (rawCert) => {
    setModalCert({
      id: rawCert.id,
      certificate_id: rawCert.certificate_id,
      type: rawCert.certificate_type,
      status: normalizeStatus(rawCert.status),
      patient: rawCert.full_name || "N/A",
      doctor: rawCert.doctor_name || "Assigned Doctor",
      issued: fmtDate(rawCert.issued_at),
      expires: fmtDate(rawCert.expiry_date),
      purpose: rawCert.purpose || "General Medical Use",
      onDownload: handleConfirmDownload,
    });
  };

  const tabCls = (active) =>
    active
      ? "px-5 py-2 rounded-full border-none bg-[#2563EB] text-white text-[13px] font-medium cursor-pointer tracking-[.01em] transition-all duration-[180ms]"
      : "px-5 py-2 rounded-full border border-[#e2e0d8] bg-white text-[#64748B] text-[13px] font-medium cursor-pointer tracking-[.01em] transition-all duration-[180ms] hover:bg-gray-50";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-7 px-5 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div className="flex gap-1.5">
            {["wallet", "track"].map((tab) => (
              <button
                key={tab}
                className={tabCls(activeTab === tab)}
                onClick={() => {
                  setActiveTab(tab);
                  setShowSuccess(false);
                }}
              >
                {tab === "wallet" ? "Wallet" : "Track status"}
              </button>
            ))}
          </div>

          <button
            className="flex items-center gap-[7px] px-[18px] py-[9px] rounded-[10px] border-none bg-[#2563EB] text-white text-[13px] font-semibold cursor-pointer shadow-[0_2px_8px_rgba(37,99,235,0.18)] transition-all duration-150 hover:bg-[#1D4ED8] hover:-translate-y-px"
            onClick={() => navigate("/client/apply-certificate")}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle
                cx="7.5"
                cy="7.5"
                r="6.5"
                stroke="white"
                strokeWidth="1.3"
              />
              <path
                d="M7.5 4.5v6M4.5 7.5h6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Apply for Certificate
          </button>
        </div>

        {/* Body */}
        {loadingList ? (
          <div className="text-center py-24 text-[#aaa] text-[14px]">
            Loading your certificates…
          </div>
        ) : activeTab === "wallet" ? (
          <WalletTab
            certificates={certificates}
            showSuccess={showSuccess}
            onDownload={handleDownload}
            onTrack={handleTrack}
          />
        ) : (
          <TrackTab requestId={selectedRequestId} />
        )}
      </div>

      {/* Modal */}
      {modalCert && (
        <CertificateModal
          cert={modalCert}
          onClose={() => setModalCert(null)}
          role="patient"
        />
      )}
    </div>
  );
};

export default MyCertificate;
