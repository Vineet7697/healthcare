import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const POPULAR_TESTS = [
  { id: "fbc", label: "Full Body Checkup", icon: "🫀", price: 999 },
  { id: "blood", label: "Blood Test", icon: "🩸", price: 299 },
  { id: "diabetes", label: "Diabetes Test", icon: "💉", price: 399 },
  { id: "covid", label: "Covid Test", icon: "🦠", price: 499 },
  { id: "lipid", label: "Lipid Profile", icon: "🧬", price: 599 },
  { id: "thyroid", label: "Thyroid", icon: "🔬", price: 449 },
];

const LABS = [
  {
    id: 1,
    name: "Metropolis Diagnostics",
    address: "12, MG Road, Near City Mall, Ahmedabad",
    distance: "0.8 km",
    rating: 4.8,
    reviews: 312,
    homeCollection: true,
    openNow: true,
    phone: "+91 98765 00001",
    whatsapp: "+91 98765 00001",
    mapUrl: "https://maps.google.com",
    tests: { fbc: 899, blood: 249, diabetes: 349, covid: 449, lipid: 549, thyroid: 399, default: 399 },
    tags: ["NABL Accredited", "Home Collection"],
    accent: "blue",
  },
  {
    id: 2,
    name: "SRL Diagnostics",
    address: "45, Satellite Road, Beside HDFC Bank, Ahmedabad",
    distance: "1.4 km",
    rating: 4.6,
    reviews: 215,
    homeCollection: true,
    openNow: true,
    phone: "+91 98765 00002",
    whatsapp: "+91 98765 00002",
    mapUrl: "https://maps.google.com",
    tests: { fbc: 949, blood: 279, diabetes: 379, covid: 479, lipid: 579, thyroid: 429, default: 429 },
    tags: ["ISO Certified", "Home Collection"],
    accent: "teal",
  },
  {
    id: 3,
    name: "Thyrocare Labs",
    address: "88, CG Road, Navrangpura, Ahmedabad",
    distance: "2.1 km",
    rating: 4.4,
    reviews: 178,
    homeCollection: false,
    openNow: false,
    phone: "+91 98765 00003",
    whatsapp: "+91 98765 00003",
    mapUrl: "https://maps.google.com",
    tests: { fbc: 799, blood: 199, diabetes: 299, covid: 399, lipid: 499, thyroid: 349, default: 349 },
    tags: ["Budget Friendly"],
    accent: "amber",
  },
  {
    id: 4,
    name: "Dr. Lal PathLabs",
    address: "22, Prahlad Nagar, SG Highway, Ahmedabad",
    distance: "3.0 km",
    rating: 4.7,
    reviews: 290,
    homeCollection: true,
    openNow: true,
    phone: "+91 98765 00004",
    whatsapp: "+91 98765 00004",
    mapUrl: "https://maps.google.com",
    tests: { fbc: 1099, blood: 329, diabetes: 429, covid: 529, lipid: 649, thyroid: 479, default: 479 },
    tags: ["NABL Accredited", "Trusted Brand"],
    accent: "indigo",
  },
];

const ACCENT = {
  blue:   { bar: "bg-blue-600",   text: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-600",   btn: "bg-blue-600 hover:bg-blue-700",   tag: "bg-blue-50 text-blue-700",   dist: "bg-blue-50 text-blue-600" },
  teal:   { bar: "bg-teal-500",   text: "text-teal-600",   bg: "bg-teal-50",   border: "border-teal-500",   btn: "bg-teal-500 hover:bg-teal-600",   tag: "bg-teal-50 text-teal-700",   dist: "bg-teal-50 text-teal-600" },
  amber:  { bar: "bg-amber-500",  text: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-500",  btn: "bg-amber-500 hover:bg-amber-600",  tag: "bg-amber-50 text-amber-700",  dist: "bg-amber-50 text-amber-600" },
  indigo: { bar: "bg-indigo-600", text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-600", btn: "bg-indigo-600 hover:bg-indigo-700", tag: "bg-indigo-50 text-indigo-700", dist: "bg-indigo-50 text-indigo-600" },
};

// ─── Star Rating ──────────────────────────────────────────────────────────────

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i <= full ? "#F59E0B" : i === full + 1 && half ? "url(#half)" : "none"}
          stroke="#F59E0B" strokeWidth="2">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
};

// ─── Action Button ────────────────────────────────────────────────────────────

const ActionBtn = ({ icon, label, onClick, colorClass = "text-slate-700" }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all min-w-[60px] ${colorClass}`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-[12px] font-medium whitespace-nowrap">{label}</span>
  </button>
);

// ─── Booking Modal ────────────────────────────────────────────────────────────

function BookingModal({ lab, testId, testPrice, onClose }) {
  const [form, setForm] = useState({ name: "", mobile: "", address: "", date: "", time: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();
  const a = ACCENT[lab.accent];

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Required";
    if (!form.mobile) e.mobile = "Required";
    if (!form.address) e.address = "Required";
    if (!form.date) e.date = "Required";
    if (!form.time) e.time = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const today = new Date().toISOString().split("T")[0];
  const testName = POPULAR_TESTS.find(t => t.id === testId)?.label || "Selected Test";

  const inputCls = (err) =>
    `w-full px-3 py-2.5 rounded-lg border text-sm font-['DM_Sans',sans-serif] bg-[#F8FAFC] text-slate-900 outline-none transition-all focus:ring-2 focus:ring-blue-200 ${err ? "border-red-400" : "border-[#E2E8F0]"}`;

  if (submitted) return (
    <div className="p-8 flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <p className="text-lg font-semibold text-slate-900">Booking Confirmed!</p>
      <p className="text-sm text-slate-500 leading-relaxed">
        Your test request at <strong className="text-slate-700">{lab.name}</strong> has been submitted.<br />
        They'll call <strong className="text-slate-700">{form.mobile}</strong> shortly to confirm.
      </p>
      <div className="w-full max-w-xs mt-1">
        {[{ l: "Test", v: testName }, { l: "Date", v: form.date }, { l: "Time", v: form.time }, { l: "Price", v: `₹${testPrice}` }].map(({ l, v }) => (
          <div key={l} className="flex justify-between text-sm py-2 border-b border-slate-100">
            <span className="text-slate-400">{l}</span>
            <span className="font-medium text-slate-800">{v}</span>
          </div>
        ))}
      </div>
      <button onClick={onClose} className={`mt-2 px-7 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer border-none ${a.btn}`}>Done</button>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="flex-1">
          <p className="text-lg font-semibold text-slate-900">Book: {testName}</p>
          <p className="text-sm text-slate-500 mt-0.5">{lab.name} · <span className={`${a.text} font-semibold`}>₹{testPrice}</span></p>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full border border-slate-200 bg-slate-50 cursor-pointer text-slate-400 flex items-center justify-center text-lg hover:bg-slate-100 transition-colors">×</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[14px] font-medium text-slate-600 block mb-1">Full name *</label>
          <input className={inputCls(errors.name)} placeholder="Your name" value={form.name} onChange={e => set("name", e.target.value)} />
          {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
        </div>
        <div>
          <label className="text-[14px] font-medium text-slate-600 block mb-1">Mobile *</label>
          <input type="tel" className={inputCls(errors.mobile)} placeholder="+91 98765 43210" value={form.mobile} onChange={e => set("mobile", e.target.value)} />
          {errors.mobile && <p className="text-[10px] text-red-500 mt-0.5">{errors.mobile}</p>}
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[14px] font-medium text-slate-600 block mb-1">Address *</label>
        <input className={inputCls(errors.address)} placeholder="Full delivery / visit address" value={form.address} onChange={e => set("address", e.target.value)} />
        {errors.address && <p className="text-[10px] text-red-500 mt-0.5">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-[14px] font-medium text-slate-600 block mb-1">Preferred date *</label>
          <input type="date" min={today} className={inputCls(errors.date)} value={form.date} onChange={e => set("date", e.target.value)} />
          {errors.date && <p className="text-[10px] text-red-500 mt-0.5">{errors.date}</p>}
        </div>
        <div>
          <label className="text-[14px] font-medium text-slate-600 block mb-1">Time slot *</label>
          <select className={inputCls(errors.time)} value={form.time} onChange={e => set("time", e.target.value)}>
            <option value="">Select time</option>
            <option>7:00 AM – 9:00 AM</option>
            <option>9:00 AM – 11:00 AM</option>
            <option>11:00 AM – 1:00 PM</option>
            <option>2:00 PM – 4:00 PM</option>
            <option>4:00 PM – 6:00 PM</option>
          </select>
          {errors.time && <p className="text-[10px] text-red-500 mt-0.5">{errors.time}</p>}
        </div>
      </div>

      <div className="mb-3">
        <label className="text-[14px] font-medium text-slate-600 block mb-1">
          Upload prescription <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <div
          onClick={() => fileRef.current.click()}
          className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${fileName ? `${a.border} ${a.bg}` : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-blue-300"}`}
        >
          <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={e => e.target.files[0] && setFileName(e.target.files[0].name)} />
          <p className="text-xs font-medium text-slate-700">{fileName || "Click to upload report / prescription"}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, PDF</p>
        </div>
      </div>

      <div className="mb-5">
        <label className="text-[14px] font-medium text-slate-600 block mb-1">
          Notes <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-200 resize-y leading-relaxed min-h-[60px] font-['DM_Sans',sans-serif]"
          placeholder="e.g. fasting required, home sample collection needed…"
          value={form.notes}
          onChange={e => set("notes", e.target.value)}
        />
      </div>

      <button
        onClick={() => validate() && setSubmitted(true)}
        className={`w-full py-3 rounded-xl text-white text-sm font-semibold cursor-pointer border-none flex items-center justify-center gap-2 transition-all ${a.btn}`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        Confirm Booking
      </button>
    </div>
  );
}

// ─── Lab Card ─────────────────────────────────────────────────────────────────

function LabCard({ lab, selectedTest, onBook }) {
  const [expanded, setExpanded] = useState(false);
  const a = ACCENT[lab.accent];
  const price = selectedTest ? (lab.tests[selectedTest] ?? lab.tests.default) : null;
  const testName = selectedTest ? POPULAR_TESTS.find(t => t.id === selectedTest)?.label : null;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className={`h-1 ${a.bar}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[15px] font-semibold text-slate-900">{lab.name}</span>
              <span className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full ${lab.openNow ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                {lab.openNow ? "Open now" : "Closed"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <StarRating rating={lab.rating} />
              <span className="text-sm font-semibold text-slate-800">{lab.rating}</span>
              <span className="text-[12px] text-slate-400">({lab.reviews} reviews)</span>
            </div>
          </div>
          {price && (
            <div className="text-right shrink-0">
              <p className={`text-xl font-bold ${a.text} leading-none`}>₹{price}</p>
              <p className="text-[12px] text-slate-400 mt-1">{testName}</p>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 mb-3">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" className="mt-0.5 shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-sm text-slate-500 leading-relaxed flex-1">{lab.address}</span>
          <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${a.dist}`}>{lab.distance}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lab.tags.map(t => (
            <span key={t} className={`text-[12px] font-medium px-2.5 py-0.5 rounded-full ${a.tag}`}>{t}</span>
          ))}
          {lab.homeCollection && (
            <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">🏠 Home Collection</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap mb-4">
          <ActionBtn icon="📞" label="Call Now" onClick={() => window.open(`tel:${lab.phone}`)} colorClass="text-blue-600" />
          <ActionBtn icon="💬" label="WhatsApp" onClick={() => window.open(`https://wa.me/${lab.whatsapp.replace(/\D/g, "")}`)} colorClass="text-teal-600" />
          <ActionBtn icon="📍" label="Map" onClick={() => window.open(lab.mapUrl)} colorClass="text-amber-600" />
          <ActionBtn icon="📋" label="Details" onClick={() => setExpanded(x => !x)} colorClass="text-slate-600" />
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">All test prices at this lab</p>
            <div className="grid grid-cols-2 gap-x-4">
              {POPULAR_TESTS.map(t => (
                <div key={t.id} className="flex justify-between text-sm py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">{t.label}</span>
                  <span className={`font-semibold ${a.text}`}>₹{lab.tests[t.id] ?? lab.tests.default}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Book button */}
        <button
          onClick={() => onBook(lab)}
          className={`w-full py-3 rounded-xl text-white text-sm font-semibold cursor-pointer border-none flex items-center justify-center gap-2 transition-all ${a.btn}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Book Test{price ? ` · ₹${price}` : ""}
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function BookLabTest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [sortBy, setSortBy] = useState("distance");
  const [homeOnly, setHomeOnly] = useState(false);
  const [modalLab, setModalLab] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const selectTest = (testId) => {
    setSelectedTest(p => p === testId ? null : testId);
    const t = POPULAR_TESTS.find(t => t.id === testId);
    if (t) setSearchQuery(t.label);
  };

  const filteredLabs = LABS
    .filter(l => !homeOnly || l.homeCollection)
    .sort((a, b) => {
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
      if (sortBy === "price" && selectedTest) return (a.tests[selectedTest] ?? a.tests.default) - (b.tests[selectedTest] ?? b.tests.default);
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const testPrice = (lab) => selectedTest ? (lab.tests[selectedTest] ?? lab.tests.default) : lab.tests.default;

  return (
    <div className="font-['DM_Sans','Segoe_UI',sans-serif] max-w-2xl mx-auto pb-12 bg-slate-200 min-h-screen rounded-2xl mt-20">

      {/* Hero header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-400 px-7 pt-8 pb-14 relative overflow-hidden mt-10 rounded-t-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-16 w-28 h-28 rounded-full bg-white/5 translate-y-1/2" />

       <div className="flex items-center justify-between">
         <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-[11px] font-medium tracking-widest uppercase px-3 py-1 rounded-full mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Nearby diagnostics
        </div>
        <button className="bg-white text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer "
        onClick={() => navigate("/labregister")}
        >
          Register Your Lab
        </button>
       </div>

        <h1 className="text-2xl font-semibold text-white mb-1.5 leading-snug" style={{ fontFamily: "Georgia, serif" }}>
          Find & book lab tests near you
        </h1>
        <p className="text-md text-blue-100 mb-6 leading-relaxed">
          Compare prices, view lab details and schedule your test from home.
        </p>

        {/* Search */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={searchFocused ? "#2563EB" : "#94A3B8"} strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search test — Blood Test, CBC, Thyroid, Sugar…"
            className="w-full py-3.5 pl-11 pr-4 rounded-xl border-none bg-white text-sm text-slate-900 outline-none focus:ring-3 focus:ring-blue-300 transition-all placeholder-[#94A3B8] box-border"
            style={{ boxShadow: searchFocused ? "0 0 0 3px rgba(37,99,235,0.25)" : "none" }}
          />
        </div>
      </div>

      {/* Popular tests panel */}
      <div className="mx-5  bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-lg mb-5 mt-6">
        <p className="text-[13px] font-semibold text-slate-600 tracking-widest uppercase mb-3">Popular tests</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TESTS.map(t => (
            <button
              key={t.id}
              onClick={() => selectTest(t.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all border ${
                selectedTest === t.id
                  ? "border-blue-600 bg-[#EEF2FF] text-blue-700 ring-1 ring-blue-600"
                  : "border-[#E2E8F0] bg-[#F8FAFC] text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              <span className="text-md">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-2.5 px-5 pb-4 flex-wrap">
        <span className="text-sm font-semibold text-slate-600">Sort by:</span>
        {[["distance", "📍 Nearest"], ["price", "💰 Price"], ["rating", "⭐ Rating"]].map(([val, lbl]) => (
          <button
            key={val}
            onClick={() => setSortBy(val)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer border transition-all ${
              sortBy === val
                ? "border-blue-600 bg-[#EEF2FF] text-blue-700"
                : "border-[#E2E8F0] bg-white text-slate-500 hover:border-blue-300"
            }`}
          >
            {lbl}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setHomeOnly(h => !h)}
              className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${homeOnly ? "bg-teal-500" : "bg-slate-300"}`}
            >
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all duration-200 ${homeOnly ? "left-4" : "left-0.5"}`} />
            </div>
            Home collection
          </label>
        </div>
      </div>

      {/* Results count */}
      <div className="px-5 pb-3 flex justify-between items-center">
        <p className="text-md text-slate-500">
          <span className="font-semibold text-slate-900">{filteredLabs.length} labs</span> found nearby
          {selectedTest && (
            <span> for <span className="text-blue-600 font-medium">{POPULAR_TESTS.find(t => t.id === selectedTest)?.label}</span></span>
          )}
        </p>
      </div>

      {/* Lab cards */}
      <div className="flex flex-col gap-3.5 px-5">
        {filteredLabs.map(lab => (
          <LabCard key={lab.id} lab={lab} selectedTest={selectedTest} onBook={setModalLab} />
        ))}
        {filteredLabs.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-4xl mb-2">🏥</p>
            <p className="text-sm font-medium text-slate-600">No labs match your filters</p>
            <p className="text-xs text-slate-400 mt-1">Try removing the home collection filter</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalLab && (
        <div
          onClick={e => e.target === e.currentTarget && setModalLab(null)}
          className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className={`h-1 rounded-t-2xl ${ACCENT[modalLab.accent].bar}`} />
            <BookingModal
              lab={modalLab}
              testId={selectedTest}
              testPrice={testPrice(modalLab)}
              onClose={() => setModalLab(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}