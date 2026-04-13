import { useState, useMemo } from "react";

// ─── Static data ─────────────────────────────────────────────────────────────

const requests = [
  { id: "REQ-2025-0342", name: "Rahul Kumar",  initials: "RK", bg: "#E0F2FE", color: "#0369A1", type: "Second Opinion",        date: "Mar 17, 2025", status: "warning",  statusText: "Pending" },
  { id: "REQ-2025-0341", name: "Priti Desai",  initials: "PD", bg: "#EDE9FE", color: "#7C3AED", type: "Medical Fitness",        date: "Mar 17, 2025", status: "pending",  statusText: "Pending"     },
  { id: "REQ-2025-0339", name: "Sanjay Mehta", initials: "SM", bg: "#D1FAE5", color: "#059669", type: "Discharge Summary",      date: "Mar 16, 2025", status: "pending",  statusText: "Pending"     },
  { id: "REQ-2025-0337", name: "Neha Gupta",   initials: "NG", bg: "#FEE2E2", color: "#DC2626", type: "Disability Certificate", date: "Mar 15, 2025", status: "approved", statusText: "Approved"    },
  { id: "REQ-2025-0335", name: "Arjun Joshi",  initials: "AJ", bg: "#DBEAFE", color: "#2563EB", type: "Medical Fitness",        date: "Mar 14, 2025", status: "rejected", statusText: "Rejected"    },
];

const issuedCerts = [
  { id: "MC-2025-10234", patient: "Rahul Kumar", type: "Medical Fitness",        issued: "Mar 10, 2025", expires: "Mar 10, 2026" },
  { id: "MC-2025-10198", patient: "Neha Gupta",  type: "Disability Certificate", issued: "Mar 15, 2025", expires: "Mar 15, 2027" },
];

const STATUS_OPTIONS = ["All Status", "Pending", "Approved", "Rejected"];
const TYPE_OPTIONS   = ["All Types", "Second Opinion", "Medical Fitness", "Discharge Summary", "Disability Certificate"];
const FITNESS_OPTIONS = ["Select fitness status", "Fit — No Restrictions", "Fit with Restrictions", "Temporarily Unfit", "Unfit"];
const VALIDITY_OPTIONS = ["1 month", "3 months", "6 months", "1 year"];

// ─── Reusable components ──────────────────────────────────────────────────────

function Avatar({ initials, bg, color, size = "sm" }) {
  const sz = size === "lg" ? "w-12 h-12 text-base" : "w-7 h-7 text-xs";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}
      style={{ background: bg || "#E0F2FE", color: color || "#0369A1" }}
    >
      {initials}
    </div>
  );
}

const badgeStyles = {
  pending:  "bg-yellow-100 text-yellow-800",
  warning:  "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  valid:    "bg-emerald-100 text-emerald-800",
};

function Badge({ status, text }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeStyles[status] || badgeStyles.pending}`}>
      {text}
    </span>
  );
}

function FieldError({ msg }) {
  return msg ? <p className="text-xs text-red-500 mt-1">{msg}</p> : null;
}

// ─── Certificate Modal ────────────────────────────────────────────────────────

function CertificateModal({ cert, onClose }) {
  if (!cert) return null;

  // Removed: Date of Birth, Registration No. fields
  const fields = [
    { label: "Certificate ID", value: cert.id,          mono: true },
    { label: "Status",         value: "Valid",           badge: "valid" },
    { label: "Patient Name",   value: cert.patient },
    { label: "Issued By",      value: "Dr. Priya Sharma" },
    { label: "Issue Date",     value: cert.issued },
    { label: "Expiry Date",    value: cert.expires },
    { label: "Purpose",        value: "Employment" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.25)", maxHeight: "92vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <span className="text-sm font-semibold text-gray-700">Medical Certificate</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-base font-bold"
          >×</button>
        </div>

        <div className="p-4 sm:p-5">
          {/* Header banner */}
          <div className="bg-teal-600 rounded-xl px-4 py-3 mb-4 text-center">
            <div className="text-white text-base sm:text-lg font-bold tracking-wide">MediCert System</div>
            <div className="text-teal-100 text-xs mt-0.5">Digital Medical Certificate Authority — India</div>
          </div>

          <div className="text-center mb-4">
            <span className="text-base font-semibold text-gray-800">{cert.type} Certificate</span>
          </div>

          {/* Fields grid — responsive 1→2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4">
            {fields.map(({ label, value, mono, badge }) => (
              <div key={label}>
                <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                {badge
                  ? <Badge status={badge} text={value} />
                  : <div className={`text-sm font-medium text-gray-700 ${mono ? "font-mono" : ""}`}>{value}</div>
                }
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-xs text-gray-500 mb-4">
            <span className="font-semibold text-gray-600">Disclaimer: </span>
            This certificate is digitally signed and tamper-proof. Verify at{" "}
            <span className="text-teal-600 font-medium">medicert.in/verify</span>.
          </div>

          {/* Footer strip */}
          <div className="flex items-center justify-between bg-teal-700 rounded-xl px-4 py-3 mb-4">
            <svg viewBox="0 0 48 48" width="48" height="48" fill="white" className="flex-shrink-0">
              <rect x="4"  y="4"  width="16" height="16" rx="1"/>
              <rect x="6"  y="6"  width="12" height="12" rx="1" fill="#0F766E"/>
              <rect x="28" y="4"  width="16" height="16" rx="1"/>
              <rect x="30" y="6"  width="12" height="12" rx="1" fill="#0F766E"/>
              <rect x="4"  y="28" width="16" height="16" rx="1"/>
              <rect x="6"  y="30" width="12" height="12" rx="1" fill="#0F766E"/>
              <rect x="28" y="28" width="4" height="4" fill="white"/>
              <rect x="34" y="28" width="4" height="4" fill="white"/>
              <rect x="40" y="28" width="4" height="4" fill="white"/>
              <rect x="28" y="34" width="4" height="4" fill="white"/>
              <rect x="34" y="40" width="4" height="4" fill="white"/>
              <rect x="40" y="34" width="4" height="10" fill="white"/>
            </svg>
            <div className="flex-1 mx-3 min-w-0">
              <div className="text-teal-100 text-xs font-mono truncate">ID: {cert.id}</div>
              <div className="text-teal-100 text-xs font-mono">Hash: 3f8a9b2c…e4d1</div>
              <div className="text-teal-200 text-xs mt-1">✓ Digitally verified · Issued {cert.issued}</div>
            </div>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#6EE7B7">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <div className="text-teal-100 text-xs text-center leading-tight">Verified<br/>Authentic</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors">
              Download Verified Copy
            </button>
            <button className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: All Requests (with live search + filter) ────────────────────────────

function AllRequests({ onReview }) {
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("All Status");
  const [typeFilter, setType]     = useState("All Types");

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All Status" || r.statusText === statusFilter;
      const matchType   = typeFilter   === "All Types"  || r.type       === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const pendingCount = requests.filter(r => r.status === "pending" || r.status === "warning").length;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Certificate Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and manage patient certificate requests</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2">
            <div className="text-xs text-gray-500 mb-0.5">Pending</div>
            <div className="text-lg font-bold text-yellow-600">{pendingCount}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2">
            <div className="text-xs text-gray-500 mb-0.5">Total</div>
            <div className="text-lg font-bold text-gray-700">{requests.length}</div>
          </div>
        </div>
      </div>

      {/* Live filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4">
        <div className="relative w-full sm:w-56">
          <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
          </svg>
          <input
            placeholder="Search by name or ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatus(e.target.value)}
          className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          {STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={e => setType(e.target.value)}
          className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          {TYPE_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
        {(search || statusFilter !== "All Status" || typeFilter !== "All Types") && (
          <button
            onClick={() => { setSearch(""); setStatus("All Status"); setType("All Types"); }}
            className="text-xs text-teal-600 hover:text-teal-800 underline self-center"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table — scrollable on mobile */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                {["Request ID","Patient","Type","Submitted","Status","Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">
                    No requests match your filters.
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><span className="font-mono text-xs text-gray-600">{r.id}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={r.initials} bg={r.bg} color={r.color}/>
                      <span className="font-medium text-gray-700 whitespace-nowrap">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{r.type}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-4 py-3"><Badge status={r.status} text={r.statusText}/></td>
                  <td className="px-4 py-3">
                    {r.status === "pending" || r.status === "warning" ? (
                      <button onClick={onReview} className="px-3 py-1.5 bg-teal-600 text-white text-xs rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                        Review →
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50 transition-colors">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Review Patient (with form validation + fitness status) ──────────────

function ReviewPatient({ onBack }) {
  const [form, setForm] = useState({
    validity: "1 month",
    notes: "",
    fitnessStatus: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.notes.trim())                                e.notes         = "Clinical notes are required before approving.";
    if (!form.fitnessStatus || form.fitnessStatus === "Select fitness status")
                                                           e.fitnessStatus = "Please select a fitness status.";
    return e;
  };

  const handleApprove = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
  };

  const handleReject = () => {
    if (!form.notes.trim()) {
      setErrors({ notes: "Please add a reason for rejection." });
      return;
    }
    alert("Request rejected.");
  };

  if (submitted) {
    return (
      <div className="p-4 sm:p-6 flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div className="text-center">
          <div className="text-base font-semibold text-gray-800 mb-1">Certificate Approved!</div>
          <div className="text-sm text-gray-500">The certificate has been digitally signed and issued.</div>
        </div>
        <button onClick={onBack} className="mt-2 px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors">
          Back to Requests
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
      
        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Review Request</h1>
          <p className="text-sm text-gray-500">REQ-2025-0342 · Second Opinion Certificate</p>
        </div>
      </div>

      {/* Responsive grid: stacked on mobile, 2-col on desktop */}
      <div className="flex flex-col lg:grid lg:gap-4" style={{ gridTemplateColumns: "1fr 1.4fr" }}>

        {/* ── Left: Patient Info ── */}
        <div className="flex flex-col gap-4 mb-4 lg:mb-0">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Patient Information</div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar initials="RK" bg="#E0F2FE" color="#0369A1" size="lg"/>
              <div>
                <div className="font-semibold text-gray-800">Rahul Kumar</div>
                <div className="text-xs text-gray-500">DOB: 15 Aug 1990 · Male · 34 yrs</div>
                <div className="text-xs text-gray-500">MRN: PAT-00129847</div>
              </div>
            </div>
            <hr className="border-gray-100 mb-3"/>
            {/* Removed: Weight & BMI fields — kept Blood Group & Height only */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[["Blood Group","A+"],["Height","172 cm"]].map(([l,v]) => (
                <div key={l}>
                  <div className="text-xs text-gray-400 mb-0.5">{l}</div>
                  <div className="text-sm font-semibold text-gray-700">{v}</div>
                </div>
              ))}
            </div>
            <hr className="border-gray-100 mb-3"/>
            {/* Removed: Current Medications field */}
            <div>
              <div className="text-xs text-gray-400 mb-1">Known Conditions</div>
              <div className="text-sm text-gray-600">Mild hypertension (controlled)</div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Uploaded Documents</div>
            {[
              ["📄","Prescription_March2025.pdf","2.3 MB · Mar 17"],
              ["🖼️","XRay_Chest_2025.jpg","1.8 MB · Mar 17"],
            ].map(([icon,name,meta]) => (
              <div key={name} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg mb-2">
                <span className="text-base">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700 truncate">{name}</div>
                  <div className="text-xs text-gray-400">{meta}</div>
                </div>
                <button className="px-2.5 py-1 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-white transition-colors flex-shrink-0">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Review Form ── */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Certificate Details</div>

            {/* Removed: Purpose field */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Certificate Type</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                value="Second Opinion Certificate"
                readOnly
              />
            </div>

            {/* Patient's Notes (read-only) */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Patient's Request Notes</label>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600">
                Experiencing chest discomfort since 2 weeks. Need a second opinion on X-ray findings.
              </div>
            </div>

            {/* Validity */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Validity Period</label>
              <select
                value={form.validity}
                onChange={e => set("validity", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                {VALIDITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Fitness Status — NEW */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">
                Fitness Status <span className="text-red-400">*</span>
              </label>
              <select
                value={form.fitnessStatus}
                onChange={e => set("fitnessStatus", e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  errors.fitnessStatus ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              >
                {FITNESS_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
              <FieldError msg={errors.fitnessStatus}/>
            </div>

            {/* Clinical Notes — required */}
            <div className="mb-1">
              <label className="text-xs text-gray-500 mb-1 block">
                Doctor's Clinical Notes <span className="text-red-400">*</span>
              </label>
              <textarea
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none ${
                  errors.notes ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
                placeholder="Add your clinical findings, observations and recommendations…"
                rows={4}
                value={form.notes}
                onChange={e => set("notes", e.target.value)}
              />
              <FieldError msg={errors.notes}/>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">Take Action</div>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <button
                onClick={handleApprove}
                className="flex-1 px-3 py-2.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                ✓ Approve & Generate Certificate
              </button>
              <button
                onClick={handleReject}
                className="sm:w-auto px-4 py-2.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                ✕ Reject
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Fields marked <span className="text-red-400">*</span> are required. Approval digitally signs the certificate with registration number MCI-78234.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Issued Certificates ─────────────────────────────────────────────────

function IssuedCerts({ onViewPdf }) {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Issued Certificates</h1>
        <p className="text-sm text-gray-500 mt-0.5">Certificates you have approved and generated</p>
      </div>

      {/* Stats — responsive 2×2 on mobile, 4-col on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[["Total Issued","47"],["This Month","12"],["Fitness Certs","28"],["Other Types","19"]].map(([label,value]) => (
          <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-xl font-bold text-gray-800">{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Recent Issuances</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                {/* Removed: "Expires" column */}
                {["Cert ID","Patient","Type","Issued On","Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issuedCerts.map(c => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><span className="font-mono text-xs text-gray-600">{c.id}</span></td>
                  <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">{c.patient}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{c.type}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.issued}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewPdf(c)}
                      className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-colors whitespace-nowrap"
                    >
                      View PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

const tabs = [
  { id: "requests", label: "All Requests" },
  { id: "issued",   label: "Issued Certs"  },
];

export default function Certificaterequest() {
  const [activeTab, setActiveTab] = useState("requests");
  const [modalCert, setModalCert] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab nav */}
     
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`py-3.5 px-4 sm:px-5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === t.id
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-slate-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
      </div>

      {activeTab === "requests" && <AllRequests onReview={() => setActiveTab("review")} />}
      {activeTab === "review"   && <ReviewPatient onBack={() => setActiveTab("requests")} />}
      {activeTab === "issued"   && <IssuedCerts onViewPdf={cert => setModalCert(cert)} />}

      <CertificateModal cert={modalCert} onClose={() => setModalCert(null)} />
    </div>
  );
}