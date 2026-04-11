import React, { useState, useEffect } from "react";

const certificates = [
  {
    type: "Medical Fitness",
    name: "Medical Fitness Certificate",
    doctor: "Dr. Priya Sharma",
    date: "Mar 10, 2025",
    expiry: "Expires Mar 10, 2026",
    daysLeft: "356 days left",
    status: "Active",
    progress: 94,
    accent: "#16a34a",
    accentBg: "#f0fdf4",
    accentText: "#15803d",
    icon: "🩺",
  },
  {
    type: "Vaccination",
    name: "COVID-19 Vaccination Certificate",
    doctor: "City Health Clinic",
    date: "Jan 22, 2025",
    expiry: "No expiry set",
    daysLeft: "",
    status: "Active",
    progress: 75,
    accent: "#0d9488",
    accentBg: "#f0fdfa",
    accentText: "#0f766e",
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
    accentText: "#b45309",
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
    accentText: "#b91c1c",
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

const statusStyle = {
  Active: { bg: "#f0fdf4", color: "#15803d", dot: "#16a34a" },
  Pending: { bg: "#fffbeb", color: "#b45309", dot: "#d97706" },
  Expired: { bg: "#fef2f2", color: "#b91c1c", dot: "#dc2626" },
};

const styles = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "#f8f7f4",
    padding: "28px 20px 48px",
  },
  inner: { maxWidth: 960, margin: "0 auto" },

  // Tabs
  tabRow: { display: "flex", gap: 6, marginBottom: 28 },
  tab: (active) => ({
    padding: "8px 20px",
    borderRadius: 100,
    border: active ? "none" : "1px solid #e2e0d8",
    background: active ? "#111" : "#fff",
    color: active ? "#fff" : "#666",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all .18s",
    letterSpacing: ".01em",
  }),

  // Section head
  sectionHead: { marginBottom: 20 },
  h1: { fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 4 },
  sub: { fontSize: 13, color: "#888" },

  // Filters
  filterRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  input: {
    border: "1px solid #e2e0d8",
    borderRadius: 10,
    padding: "8px 14px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#111",
    background: "#fff",
    outline: "none",
    width: 220,
    transition: "border .15s",
  },
  select: {
    border: "1px solid #e2e0d8",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#555",
    background: "#fff",
    outline: "none",
    cursor: "pointer",
  },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  },

  // Card
  card: {
    background: "#fff",
    border: "1px solid #ece9e1",
    borderRadius: 16,
    padding: "18px 18px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    transition: "box-shadow .18s, transform .18s",
    cursor: "default",
  },

  // Card top
  cardIcon: (bg) => ({
    width: 38,
    height: 38,
    borderRadius: 10,
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  }),
  certType: {
    fontSize: 10,
    fontWeight: 600,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: ".08em",
    marginBottom: 2,
  },
  certName: { fontSize: 13, fontWeight: 600, color: "#111", lineHeight: 1.35 },
  certDoc: { fontSize: 12, color: "#999", marginTop: 2 },

  // Progress
  barTrack: {
    height: 4,
    borderRadius: 4,
    background: "#f0ede6",
    overflow: "hidden",
    marginTop: 2,
  },
  barLabel: { fontSize: 11, color: "#aaa", marginTop: 5, fontVariantNumeric: "tabular-nums" },

  // Footer
  cardFooter: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  badge: (status) => ({
    fontSize: 11,
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: 100,
    background: statusStyle[status].bg,
    color: statusStyle[status].color,
    display: "flex",
    alignItems: "center",
    gap: 5,
  }),
  dot: (status) => ({
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: statusStyle[status].dot,
    flexShrink: 0,
  }),
  btnGroup: { display: "flex", gap: 6 },
  btnOutline: {
    fontSize: 12,
    padding: "5px 12px",
    borderRadius: 8,
    border: "1px solid #e2e0d8",
    background: "transparent",
    color: "#555",
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all .15s",
  },
  btnSolid: {
    fontSize: 12,
    padding: "5px 12px",
    borderRadius: 8,
    border: "none",
    background: "#111",
    color: "#fff",
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "opacity .15s",
  },

  // Track
  trackWrap: { maxWidth: 600 },
  reqCard: {
    background: "#fff",
    border: "1px solid #ece9e1",
    borderRadius: 16,
    padding: "20px 22px",
    marginBottom: 16,
  },
  reqHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  reqTitle: { fontSize: 15, fontWeight: 600, color: "#111" },
  reqSub: { fontSize: 12, color: "#aaa", marginTop: 3, fontFamily: "monospace" },

  // Timeline
  timeline: { display: "flex", flexDirection: "column" },
  tlItem: { display: "flex", gap: 14, position: "relative" },
  tlConnector: {
    position: "absolute",
    left: 7,
    top: 20,
    bottom: -4,
    width: 1,
    background: "#ece9e1",
  },
  tlDot: (state) => ({
    width: 15,
    height: 15,
    borderRadius: "50%",
    flexShrink: 0,
    marginTop: 3,
    border: "2px solid",
    borderColor: state === "done" ? "#16a34a" : state === "active" ? "#d97706" : "#ddd",
    background: state === "done" ? "#16a34a" : "transparent",
  }),
  tlBody: { paddingBottom: 22 },
  tlLabel: (state) => ({
    fontSize: 13,
    fontWeight: 600,
    color: state === "waiting" ? "#bbb" : "#111",
  }),
  tlDate: { fontSize: 11, color: "#bbb", fontFamily: "monospace", marginTop: 2 },
  tlNote: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
    padding: "8px 12px",
    background: "#fffbeb",
    borderRadius: 8,
    borderLeft: "3px solid #d97706",
    lineHeight: 1.55,
  },

  // Upload
  uploadZone: {
    border: "1.5px dashed #ddd",
    borderRadius: 12,
    padding: "20px",
    textAlign: "center",
    marginTop: 20,
    cursor: "pointer",
    transition: "background .15s, border-color .15s",
  },
  uploadLabel: { fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 3 },
  uploadHint: { fontSize: 11, color: "#aaa", fontFamily: "monospace" },

  actionRow: { display: "flex", gap: 10, marginTop: 14 },
  btnPrimary: {
    fontSize: 13,
    padding: "9px 18px",
    borderRadius: 10,
    border: "none",
    background: "#111",
    color: "#fff",
    fontFamily: "inherit",
    fontWeight: 500,
    cursor: "pointer",
  },
  btnSecondary: {
    fontSize: 13,
    padding: "9px 18px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "transparent",
    color: "#555",
    fontFamily: "inherit",
    fontWeight: 500,
    cursor: "pointer",
  },
};

function CertCard({ cert, visible }) {
  const [hovered, setHovered] = useState(false);
  if (!visible) return null;
  return (
    <div
      style={{
        ...styles.card,
        boxShadow: hovered ? "0 6px 24px rgba(0,0,0,.07)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={styles.cardIcon(cert.accentBg)}>{cert.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.certType}>{cert.type}</div>
          <div style={styles.certName}>{cert.name}</div>
          <div style={styles.certDoc}>{cert.doctor} · {cert.date}</div>
        </div>
      </div>

      <div>
        <div style={styles.barTrack}>
          <div
            style={{
              height: "100%",
              borderRadius: 4,
              background: cert.accent,
              width: `${cert.progress}%`,
              transition: "width .6s ease",
            }}
          />
        </div>
        <div style={styles.barLabel}>
          {cert.expiry}{cert.daysLeft ? ` · ${cert.daysLeft}` : ""}
        </div>
      </div>

      <div style={styles.cardFooter}>
        <span style={styles.badge(cert.status)}>
          <span style={styles.dot(cert.status)} />
          {cert.status}
        </span>
        <div style={styles.btnGroup}>
          <button style={styles.btnOutline}>Share</button>
          <button style={styles.btnSolid}>Download</button>
        </div>
      </div>
    </div>
  );
}

function WalletTab() {
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

  return (
    <div>
      <div style={styles.sectionHead}>
        <div style={styles.h1}>Certificate wallet</div>
        <div style={styles.sub}>All your digital medical certificates in one place</div>
      </div>

      <div style={styles.filterRow}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search certificates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={styles.select} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option>Medical Fitness</option>
          <option>Vaccination</option>
          <option>Second Opinion</option>
        </select>
        <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All status</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Expired</option>
        </select>
      </div>

      <div style={styles.grid}>
        {certificates.map((cert, i) => (
          <CertCard key={i} cert={cert} visible={visible(cert)} />
        ))}
      </div>
    </div>
  );
}

function TrackTab() {
  const [hoverUpload, setHoverUpload] = useState(false);
  return (
    <div style={styles.trackWrap}>
      <div style={styles.sectionHead}>
        <div style={styles.h1}>Track request status</div>
        <div style={styles.sub}>Monitor the progress of your certificate requests</div>
      </div>

      <div style={styles.reqCard}>
        <div style={styles.reqHeader}>
          <div>
            <div style={styles.reqTitle}>Second Opinion Certificate</div>
            <div style={styles.reqSub}>REQ-2025-0342 · Submitted Mar 17, 2025</div>
          </div>
          <span style={styles.badge("Pending")}>
            <span style={styles.dot("Pending")} />
            Pending
          </span>
        </div>

        <div style={styles.timeline}>
          {timelineSteps.map((step, i) => (
            <div key={i} style={styles.tlItem}>
              {i < timelineSteps.length - 1 && <div style={styles.tlConnector} />}
              <div style={styles.tlDot(step.state)} />
              <div style={styles.tlBody}>
                <div style={styles.tlLabel(step.state)}>{step.label}</div>
                <div style={styles.tlDate}>{step.date}</div>
                {step.note && <div style={styles.tlNote}>{step.note}</div>}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            ...styles.uploadZone,
            background: hoverUpload ? "#fafaf8" : "transparent",
            borderColor: hoverUpload ? "#bbb" : "#ddd",
          }}
          onMouseEnter={() => setHoverUpload(true)}
          onMouseLeave={() => setHoverUpload(false)}
        >
          <div style={{ fontSize: 22, marginBottom: 6 }}>📎</div>
          <div style={styles.uploadLabel}>Upload lab reports</div>
          <div style={styles.uploadHint}>PDF, JPG, PNG · up to 10 MB</div>
        </div>

        <div style={styles.actionRow}>
          <button style={styles.btnPrimary}>Submit documents</button>
          <button style={styles.btnSecondary}>Message doctor</button>
        </div>
      </div>
    </div>
  );
}

const MyCertificate = () => {
  const [activeTab, setActiveTab] = useState("wallet");

  return (
    <div style={styles.root}>
      <div style={styles.inner}>
        <div style={styles.tabRow}>
          {["wallet", "track"].map((tab) => (
            <button
              key={tab}
              style={styles.tab(activeTab === tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "wallet" ? "Wallet" : "Track status"}
            </button>
          ))}
        </div>

        {activeTab === "wallet" ? <WalletTab /> : <TrackTab />}
      </div>
    </div>
  );
};

export default MyCertificate;