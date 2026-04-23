import { useState } from "react";
import api from "../services/api";

const SERVICES = [
  {
    val: "nurse",
    name: "Nurse",
    desc: "Trained nursing care at home",
    bg: "#E6F1FB",
    iconColor: "#185FA5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width={18} height={18}>
        <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z" />
        <path d="M12 12c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
        <line x1="12" y1="7" x2="12" y2="11" />
        <line x1="10" y1="9" x2="14" y2="9" />
      </svg>
    ),
  },
  {
    val: "homecare",
    name: "Home Care",
    desc: "Daily assistance & support",
    bg: "#E1F5EE",
    iconColor: "#0F6E56",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width={18} height={18}>
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    val: "consultation",
    name: "Consultation",
    desc: "Doctor visit at home",
    bg: "#FAEEDA",
    iconColor: "#854F0B",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width={18} height={18}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="13" y2="13" />
        <circle cx="17" cy="17" r="2.5" fill="#FAEEDA" />
        <line x1="17" y1="15.8" x2="17" y2="17.5" />
        <line x1="17" y1="18.1" x2="17" y2="18.5" />
      </svg>
    ),
  },
];

const DURATIONS = [
  { val: "1day", label: "1 Day", days: 1 },
  { val: "multiple", label: "Multiple Days", days: null },
  { val: "weekly", label: "Weekly", days: 7 },
  { val: "monthly", label: "Monthly", days: 30 },
];

const TIME_SLOTS = [
  { val: "morning", label: "Morning", range: "6am – 12pm", icon: "🌅" },
  { val: "afternoon", label: "Afternoon", range: "12pm – 5pm", icon: "☀️" },
  { val: "evening", label: "Evening", range: "5pm – 9pm", icon: "🌆" },
  { val: "night", label: "Night", range: "9pm – 6am", icon: "🌙" },
];

const today = new Date().toISOString().split("T")[0];

const SectionLabel = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
    <span style={{
      fontSize: 11, fontWeight: 500, letterSpacing: "0.07em",
      textTransform: "uppercase", color: "#888", whiteSpace: "nowrap"
    }}>
      {children}
    </span>
    <div style={{ flex: 1, height: "0.5px", background: "#e0e0e0" }} />
  </div>
);

const Required = () => <span style={{ color: "#E24B4A", marginLeft: 2 }}>*</span>;

const FieldLabel = ({ children, optional }) => (
  <label style={{ fontSize: 12, fontWeight: 500, color: "#666", display: "block", marginBottom: 5 }}>
    {children}
    {optional
      ? <span style={{ fontWeight: 400, color: "#aaa" }}> (optional)</span>
      : <Required />}
  </label>
);

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: "0.5px solid #d0d0d0",
  background: "#f8f8f7",
  fontSize: 14,
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const InputField = ({ id, type = "text", placeholder, value, onChange, min, disabled, style }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      min={min}
      disabled={disabled}
      style={{
        ...inputStyle,
        borderColor: focused ? "#378ADD" : "#d0d0d0",
        boxShadow: focused ? "0 0 0 3px rgba(55,138,221,0.1)" : "none",
        background: focused ? "#fff" : "#f8f8f7",
        ...(disabled ? { opacity: 0.6, cursor: "not-allowed" } : {}),
        ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const TextAreaField = ({ id, placeholder, value, onChange, minHeight = 80 }) => {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        ...inputStyle,
        minHeight,
        resize: "vertical",
        lineHeight: 1.6,
        borderColor: focused ? "#378ADD" : "#d0d0d0",
        boxShadow: focused ? "0 0 0 3px rgba(55,138,221,0.1)" : "none",
        background: focused ? "#fff" : "#f8f8f7",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const Card = ({ children, style }) => (
  <div style={{
    background: "#fff",
    border: "0.5px solid #e8e8e6",
    borderRadius: 12,
    padding: "1.25rem 1.5rem",
    marginBottom: "1rem",
    ...style,
  }}>
    {children}
  </div>
);

export default function PatientBookHomeService() {
  const [form, setForm] = useState({
    fullName: "", address: "", contact: "",
    service: "", condition: "",
    durationType: "", numDays: "", prefDate: "", timeSlot: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const selectDuration = (dur) => {
    set("durationType", dur.val);
    if (dur.days !== null) set("numDays", String(dur.days));
    else if (dur.val === "multiple") set("numDays", "");
  };

  const validate = () => {
    const e = {};
    if (!form.fullName) e.fullName = true;
    if (!form.contact) e.contact = true;
    if (!form.address) e.address = true;
    if (!form.service) e.service = true;
    if (!form.condition) e.condition = true;
    if (!form.durationType) e.durationType = true;
    if (!form.numDays) e.numDays = true;
    if (!form.prefDate) e.prefDate = true;
    if (!form.timeSlot) e.timeSlot = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

const handleSubmit = async () => {
  if (!validate()) return;

  try {
    const res = await api.post("/patient/bookhomecare", {
      full_name: form.fullName,
      address: form.address,
      contact_number: form.contact,
      service_type: form.service,
      medical_condition: form.condition,
      duration_type: form.durationType,
      number_of_days: form.numDays,
      preferred_date: form.prefDate,
      time_slot: form.timeSlot,
      notes: form.notes,
    });

    if (res.data.success) {
      setSubmitted(true);
    }
  } catch (error) {
    console.error("Booking Error:", error);
    alert("Booking failed!");
  }
};

  const reset = () => {
    setForm({ fullName: "", address: "", contact: "", service: "", condition: "", durationType: "", numDays: "", prefDate: "", timeSlot: "", notes: "" });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'DM Sans', sans-serif" }}>
        <Card style={{ textAlign: "center", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#EAF3DE", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2.2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "#1a1a1a" }}>Booking request submitted!</p>
          <p style={{ fontSize: 13, color: "#888", margin: 0, lineHeight: 1.7, maxWidth: 360 }}>
            Thank you, <strong>{form.fullName}</strong>. Our team will review your request and contact you at <strong>{form.contact}</strong> within 24 hours to confirm.
          </p>
          <button onClick={reset} style={{ marginTop: 8, padding: "10px 28px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#185FA5,#378ADD)", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
            Book another
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1rem 1rem 2rem", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", marginTop: "4rem" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#0C447C 0%,#185FA5 60%,#378ADD 100%)",
        borderRadius: 12, padding: "1.75rem 2rem 1.5rem",
        marginBottom: "1.25rem", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", color: "#B5D4F4", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5DCAA5", display: "inline-block" }} />
          Home Healthcare Services
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 6px", lineHeight: 1.3 }}>Book a Care Service</h1>
        <p style={{ fontSize: 13, color: "#85B7EB", margin: 0, lineHeight: 1.6 }}>Fill in your details to schedule a nurse, home care, or home consultation.</p>
      </div>

      {/* Personal Details */}
      <Card>
        <SectionLabel>Personal details</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            <FieldLabel>Full name</FieldLabel>
            <InputField id="fullName" placeholder="e.g. Ramesh Patel" value={form.fullName} onChange={e => set("fullName", e.target.value)} style={errors.fullName ? { borderColor: "#E24B4A" } : {}} />
          </div>
          <div>
            <FieldLabel>Contact number</FieldLabel>
            <InputField id="contact" type="tel" placeholder="+91 98765 43210" value={form.contact} onChange={e => set("contact", e.target.value)} style={errors.contact ? { borderColor: "#E24B4A" } : {}} />
          </div>
        </div>
        <div>
          <FieldLabel>Address</FieldLabel>
          <InputField id="address" placeholder="House no., street, area, city" value={form.address} onChange={e => set("address", e.target.value)} style={errors.address ? { borderColor: "#E24B4A" } : {}} />
        </div>
      </Card>

      {/* Service Type */}
      <Card>
        <SectionLabel>Type of service</SectionLabel>
        {errors.service && <p style={{ fontSize: 12, color: "#E24B4A", margin: "-8px 0 10px" }}>Please select a service type.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {SERVICES.map(s => (
            <div key={s.val} onClick={() => set("service", s.val)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              padding: "14px 10px", borderRadius: 8, textAlign: "center", cursor: "pointer",
              border: form.service === s.val ? `1.5px solid #185FA5` : "0.5px solid #d8d8d8",
              background: form.service === s.val ? "#E6F1FB" : "#f8f8f7",
              boxShadow: form.service === s.val ? "0 0 0 1px #185FA5" : "none",
              transition: "all 0.15s",
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.iconColor }}>
                {s.icon}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a" }}>{s.name}</span>
              <span style={{ fontSize: 10, color: "#888", lineHeight: 1.4 }}>{s.desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Medical Condition */}
      <Card>
        <SectionLabel>Medical condition</SectionLabel>
        <FieldLabel>Health issue / Bimari</FieldLabel>
        <TextAreaField id="condition" placeholder="Describe the patient's medical condition, current symptoms, or ongoing treatment…" value={form.condition} onChange={e => set("condition", e.target.value)} />
        {errors.condition && <p style={{ fontSize: 12, color: "#E24B4A", margin: "4px 0 0" }}>Please describe the medical condition.</p>}
      </Card>

      {/* Duration */}
      <Card>
        <SectionLabel>Service duration</SectionLabel>
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Duration type</FieldLabel>
          {errors.durationType && <p style={{ fontSize: 12, color: "#E24B4A", margin: "-4px 0 8px" }}>Please select a duration.</p>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {DURATIONS.map(d => (
              <div key={d.val} onClick={() => selectDuration(d)} style={{
                padding: "8px 6px", borderRadius: 8, textAlign: "center", cursor: "pointer",
                fontSize: 12, fontWeight: 500,
                border: form.durationType === d.val ? "1.5px solid #185FA5" : "0.5px solid #d8d8d8",
                background: form.durationType === d.val ? "#E6F1FB" : "#f8f8f7",
                color: form.durationType === d.val ? "#0C447C" : "#666",
                boxShadow: form.durationType === d.val ? "0 0 0 1px #185FA5" : "none",
                transition: "all 0.15s",
              }}>
                {d.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <FieldLabel>Number of days</FieldLabel>
            <InputField
              id="numDays" type="number" placeholder="e.g. 7"
              value={form.numDays}
              onChange={e => set("numDays", e.target.value)}
              min="1"
              disabled={form.durationType === "1day"}
              style={errors.numDays ? { borderColor: "#E24B4A" } : {}}
            />
          </div>
          <div>
            <FieldLabel>Preferred start date</FieldLabel>
            <InputField
              id="prefDate" type="date"
              value={form.prefDate}
              onChange={e => set("prefDate", e.target.value)}
              min={today}
              style={errors.prefDate ? { borderColor: "#E24B4A" } : {}}
            />
          </div>
        </div>
      </Card>

      {/* Time Slot */}
      <Card>
        <SectionLabel>Time preference</SectionLabel>
        {errors.timeSlot && <p style={{ fontSize: 12, color: "#E24B4A", margin: "-8px 0 10px" }}>Please select a time slot.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {TIME_SLOTS.map(t => (
            <div key={t.val} onClick={() => set("timeSlot", t.val)} style={{
              padding: "10px 6px", borderRadius: 8, textAlign: "center", cursor: "pointer",
              border: form.timeSlot === t.val ? "1.5px solid #185FA5" : "0.5px solid #d8d8d8",
              background: form.timeSlot === t.val ? "#E6F1FB" : "#f8f8f7",
              boxShadow: form.timeSlot === t.val ? "0 0 0 1px #185FA5" : "none",
              transition: "all 0.15s",
            }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#1a1a1a" }}>{t.label}</div>
              <div style={{ fontSize: 9, color: "#888", marginTop: 2 }}>{t.range}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <SectionLabel>Additional notes</SectionLabel>
        <FieldLabel optional>Any special instructions?</FieldLabel>
        <TextAreaField id="notes" placeholder="e.g. patient is wheelchair-bound, prefer female caregiver, building access code…" value={form.notes} onChange={e => set("notes", e.target.value)} minHeight={70} />
      </Card>

      {/* Submit */}
      <button onClick={handleSubmit} style={{
        width: "100%", padding: "13px", borderRadius: 8, border: "none",
        background: "linear-gradient(135deg,#185FA5,#378ADD)",
        color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 500,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        transition: "opacity 0.15s",
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" />
        </svg>
        Submit Booking Request
      </button>
    </div>
  );
}