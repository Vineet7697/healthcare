import { useState, useRef } from "react";

const SUGGESTED_TESTS = [
  "CBC (Complete Blood Count)", "Blood Sugar (Fasting)", "Blood Sugar (PP)",
  "HbA1c", "Thyroid (TSH)", "T3 / T4", "Lipid Profile",
  "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Urine Routine",
  "Vitamin D", "Vitamin B12", "Iron Studies", "Covid-19 (RTPCR)",
  "Dengue NS1", "Malaria Antigen", "Creatinine", "Uric Acid", "SGPT / ALT",
];
const QUICK_TESTS = ["CBC", "Blood Sugar", "Thyroid (TSH)", "Lipid Profile", "Urine Routine", "Vitamin D"];
const CERTS = ["NABL Accredited", "ISO 9001 Certified", "CAP Accredited", "Govt. Approved", "ICMR Registered"];
const STEPS = [
  { id: "basic", label: "Basic Info", icon: "🧑‍⚕️", desc: "Lab & owner details" },
  { id: "location", label: "Location", icon: "📍", desc: "Address & map" },
  { id: "services", label: "Services", icon: "🧪", desc: "Tests & pricing" },
  { id: "photos", label: "Photos", icon: "🖼️", desc: "Lab images" },
];

// Color tokens
const C = {
  blue: "#2563EB",
  blueD: "#1D4ED8",
  teal: "#14B8A6",
  tealD: "#0D9488",
  tealDP: "#0F766E",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  lightBg: "#EEF2FF",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#06B6D4",
  border: "#E2E8F0",
  textMuted: "#64748B",
  placeholder: "#94A3B8",
  text: "#0F172A",
};

const Label = ({ children, optional }) => (
  <label className="block mb-[5px] text-[14px] font-bold tracking-[0.02em] text-gray-700">
    {children}

    {!optional && (
      <span className="ml-[3px] text-red-500">*</span>
    )}

    {optional && (
      <span className="ml-[4px] text-[13px] font-normal text-slate-400">
        (optional)
      </span>
    )}
  </label>
);

const Hint = ({ children }) => (
  <p className="mt-[3px] text-[13px] leading-[1.5] text-slate-400">
    {children}
  </p>
);

const ErrMsg = ({ msg }) =>
  msg ? (
    <p className="mt-[3px] text-[10.5px] text-red-500">
      {msg}
    </p>
  ) : null;

const Fg = ({ children, style }) => (
  <div className="mb-4" style={style}>
    {children}
  </div>
);

const Grid2 = ({ children }) => (
  <div className="grid grid-cols-2 gap-x-4">
    {children}
  </div>
);

const Grid3 = ({ children }) => (
  <div className="grid grid-cols-3 gap-x-3">
    {children}
  </div>
);

function TInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  onKeyDown,
  style,
}) {
  const [f, setF] = useState(false);

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      style={style}
      className={`
        w-full box-border rounded-[9px]
        px-[13px] py-[10px]
        text-[13px] font-inherit outline-none
        transition-all duration-150
        ${
          error
            ? "border-[1.5px] border-red-300"
            : f
            ? "border-[1.5px] border-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,0.1)] bg-[#FAFEFF]"
            : "border-[1.5px] border-slate-200 bg-gray-50"
        }
        text-slate-900
      `}
    />
  );
}




function TArea({ value, onChange, placeholder, rows = 3 }) {
  const [f, setF] = useState(false);

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      className={`
        w-full box-border rounded-[9px]
        px-[13px] py-[10px]
        text-[13px] leading-[1.6]
        font-inherit outline-none
        resize-y transition-all duration-150
        ${
          f
            ? "border-[1.5px] border-blue-600 bg-[#FAFEFF] shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            : "border-[1.5px] border-slate-200 bg-gray-50"
        }
        text-slate-900
      `}
    />
  );
}

function StepBasic({ d, set, errors }) {
  return (
    <div>
      <Grid2>
        <Fg>
          <Label>Lab / Shop Name</Label>

          <TInput
            value={d.labName}
            onChange={(e) => set("labName", e.target.value)}
            placeholder="e.g. Metropolis Diagnostics"
            error={errors.labName}
          />

          <ErrMsg msg={errors.labName} />
        </Fg>

        <Fg>
          <Label>Owner / Manager Name</Label>

          <TInput
            value={d.ownerName}
            onChange={(e) => set("ownerName", e.target.value)}
            placeholder="e.g. Dr. Ramesh Patel"
            error={errors.ownerName}
          />

          <ErrMsg msg={errors.ownerName} />
        </Fg>
      </Grid2>

      <Grid2>
        <Fg>
          <Label>Mobile Number</Label>

          <TInput
            type="tel"
            value={d.mobile}
            onChange={(e) => set("mobile", e.target.value)}
            placeholder="+91 98765 43210"
            error={errors.mobile}
          />

          <ErrMsg msg={errors.mobile} />
        </Fg>

        <Fg>
          <Label optional>WhatsApp Number</Label>

          <TInput
            type="tel"
            value={d.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="+91 98765 43210"
          />

          <Hint>
            For quick booking communication with patients
          </Hint>
        </Fg>
      </Grid2>

      <Fg className="mb-0">
        <Label optional>
          Lab Registration / License Number
        </Label>

        <TInput
          value={d.license}
          onChange={(e) => set("license", e.target.value)}
          placeholder="e.g. GUJ/LAB/2024/001"
        />

        <Hint>
          NABL, ISO or local authority registration number
        </Hint>
      </Fg>
    </div>
  );
}

function StepLocation({ d, set, errors }) {
  return (
    <div>
      <Fg>
        <Label>Full Address</Label>

        <TArea
          value={d.address}
          onChange={(e) => set("address", e.target.value)}
          placeholder="Shop no., building name, street, landmark…"
        />

        <ErrMsg msg={errors.address} />
      </Fg>

      <Grid3>
        <Fg>
          <Label>City</Label>

          <TInput
            value={d.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="Ahmedabad"
            error={errors.city}
          />

          <ErrMsg msg={errors.city} />
        </Fg>

        <Fg>
          <Label optional>State</Label>

          <TInput
            value={d.state}
            onChange={(e) => set("state", e.target.value)}
            placeholder="Gujarat"
          />
        </Fg>

        <Fg>
          <Label>Pincode</Label>

          <TInput
            type="tel"
            value={d.pincode}
            onChange={(e) => set("pincode", e.target.value)}
            placeholder="380001"
            error={errors.pincode}
          />

          <ErrMsg msg={errors.pincode} />
        </Fg>
      </Grid3>

      <Fg>
        <Label optional>Google Maps Link</Label>

        <TInput
          value={d.mapLink}
          onChange={(e) => set("mapLink", e.target.value)}
          placeholder="https://maps.google.com/…"
        />

        <Hint>
          Paste your Google Maps share link so patients can find you easily
        </Hint>
      </Fg>

      <Fg className="mb-0">
        <Label optional>Working Hours</Label>

        <Grid2>
          <div>
            <Hint>Opens at</Hint>

            <div className="mt-1">
              <select
                value={d.opensAt}
                onChange={(e) => set("opensAt", e.target.value)}
                className="
                  w-full rounded-[9px]
                  border-[1.5px] border-slate-200
                  bg-gray-50
                  px-3 py-[10px]
                  text-[13px]
                  text-slate-900
                  outline-none
                  font-inherit
                "
              >
                {[
                  "6:00 AM",
                  "7:00 AM",
                  "8:00 AM",
                  "9:00 AM",
                  "10:00 AM",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Hint>Closes at</Hint>

            <div className="mt-1">
              <select
                value={d.closesAt}
                onChange={(e) => set("closesAt", e.target.value)}
                className="
                  w-full rounded-[9px]
                  border-[1.5px] border-slate-200
                  bg-gray-50
                  px-3 py-[10px]
                  text-[13px]
                  text-slate-900
                  outline-none
                  font-inherit
                "
              >
                {[
                  "6:00 PM",
                  "7:00 PM",
                  "8:00 PM",
                  "9:00 PM",
                  "10:00 PM",
                  "Open 24/7",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </Grid2>
      </Fg>
    </div>
  );
}

function StepServices({ d, set, errors }) {
  const [testName, setTestName] = useState("");
  const [testPrice, setTestPrice] = useState("");
  const [showSug, setShowSug] = useState(false);

  const suggestions = SUGGESTED_TESTS.filter(
    (s) =>
      testName &&
      s.toLowerCase().includes(testName.toLowerCase()) &&
      !d.tests.find(
        (t) => t.name.toLowerCase() === s.toLowerCase()
      )
  );

  const addTest = (name, price) => {
    const n = (name || testName).trim();
    const p = (
      price !== undefined ? price : testPrice
    )
      .toString()
      .trim();

    if (
      !n ||
      d.tests.find(
        (t) => t.name.toLowerCase() === n.toLowerCase()
      )
    )
      return;

    set("tests", [...d.tests, { name: n, price: p }]);

    setTestName("");
    setTestPrice("");
    setShowSug(false);
  };

  const quickAdd = (name) => {
    if (!d.tests.find((t) => t.name === name)) {
      set("tests", [
        ...d.tests,
        { name, price: "" },
      ]);
    }
  };

  const toggleCert = (c) =>
    set(
      "certs",
      d.certs.includes(c)
        ? d.certs.filter((x) => x !== c)
        : [...d.certs, c]
    );

  return (
    <div>
      <Fg>
        <Label>
          Available Tests & Prices
        </Label>

        <Hint>
          Add each test with its price. Type or
          pick from suggestions.
        </Hint>

        <div className="mt-2 mb-2 flex gap-2">
          {/* Test Name */}
          <div className="relative flex-[2]">
            <TInput
              value={testName}
              onChange={(e) => {
                setTestName(e.target.value);
                setShowSug(true);
              }}
              placeholder="Test name (e.g. CBC, Thyroid…)"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(), addTest())
              }
            />

            {showSug && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 max-h-[180px] overflow-y-auto rounded-[10px] border-[1.5px] border-slate-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
                {suggestions
                  .slice(0, 6)
                  .map((s) => (
                    <div
                      key={s}
                      onMouseDown={() => {
                        setTestName(s);
                        setShowSug(false);
                      }}
                      className="cursor-pointer border-b border-gray-100 px-[13px] py-[9px] text-[12.5px] text-gray-700 hover:bg-indigo-50"
                    >
                      {s}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">
              ₹
            </span>

            <input
              type="number"
              value={testPrice}
              onChange={(e) =>
                setTestPrice(e.target.value)
              }
              placeholder="Price"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (e.preventDefault(), addTest())
              }
              className="
                w-full box-border rounded-[9px]
                border-[1.5px] border-slate-200
                bg-gray-50
                py-[10px] pl-6 pr-3
                text-[13px]
                outline-none
                font-inherit
              "
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => addTest()}
            className="
              flex items-center gap-[5px]
              whitespace-nowrap
              rounded-[9px]
              bg-blue-600
              px-4 py-[10px]
              text-[12.5px] font-bold
              text-white
              transition-all duration-150
              hover:bg-blue-700
            "
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
              />
              <line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              />
            </svg>

            Add
          </button>
        </div>

        {/* Quick Add */}
        <div className="mb-[10px]">
          <Hint>Quick add:</Hint>

          <div className="mt-[5px] flex flex-wrap gap-[5px]">
            {QUICK_TESTS.map((t) => {
              const sel = !!d.tests.find(
                (x) => x.name === t
              );

              return (
                <button
                  key={t}
                  onClick={() => quickAdd(t)}
                  className={`
                    rounded-full border-[1.5px]
                    px-[11px] py-[4px]
                    text-[11.5px] font-semibold
                    transition-all duration-150
                    ${
                      sel
                        ? "border-blue-600 bg-indigo-50 text-blue-700"
                        : "border-slate-200 bg-gray-50 text-slate-500"
                    }
                  `}
                >
                  {sel ? "✓ " : "+ "}
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <ErrMsg msg={errors.tests} />

        {/* Table */}
        {d.tests.length > 0 && (
          <div className="mt-[6px] overflow-hidden rounded-[10px] border border-slate-200">
            {/* Header */}
            <div className="grid grid-cols-[1fr_90px_32px] bg-slate-100 px-[13px] py-[7px]">
              {["Test name", "Price", ""].map(
                (h, i) => (
                  <span
                    key={i}
                    className={`
                      text-[10px] font-bold uppercase tracking-[0.06em]
                      text-slate-400
                      ${
                        i === 1
                          ? "text-right"
                          : "text-left"
                      }
                    `}
                  >
                    {h}
                  </span>
                )
              )}
            </div>

            {/* Rows */}
            {d.tests.map((t, i) => (
              <div
                key={i}
                className={`
                  grid grid-cols-[1fr_90px_32px]
                  items-center
                  border-t border-slate-50
                  px-[13px] py-[9px]
                  ${
                    i % 2 === 0
                      ? "bg-white"
                      : "bg-[#FAFAFA]"
                  }
                `}
              >
                <span className="text-[13px] text-slate-900">
                  {t.name}
                </span>

                <span className="text-right text-[13px] font-bold text-blue-700">
                  {t.price ? (
                    `₹${t.price}`
                  ) : (
                    <span className="font-normal text-gray-300">
                      —
                    </span>
                  )}
                </span>

                <button
                  onClick={() =>
                    set(
                      "tests",
                      d.tests.filter(
                        (_, idx) => idx !== i
                      )
                    )
                  }
                  className="
                    ml-auto flex h-[22px] w-[22px]
                    items-center justify-center
                    rounded-full
                    bg-red-100
                    text-[14px] text-red-500
                  "
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </Fg>

      {/* Home Collection */}
      <Fg>
        <Label optional>
          Home Sample Collection Available?
        </Label>

        <div className="flex gap-[10px]">
          {[
            {
              val: true,
              label:
                "✅ Yes, we offer home collection",
              selBg: "bg-emerald-50",
              selBrd: "border-emerald-400",
              selCol: "text-emerald-900",
            },
            {
              val: false,
              label: "❌ No, lab visit only",
              selBg: "bg-red-50",
              selBrd: "border-red-300",
              selCol: "text-red-900",
            },
          ].map((opt) => (
            <div
              key={String(opt.val)}
              onClick={() =>
                set("homeCollection", opt.val)
              }
              className={`
                flex-1 cursor-pointer rounded-[10px]
                border-[1.5px]
                px-[13px] py-[11px]
                text-center text-[12.5px] font-semibold
                transition-all duration-150
                ${
                  d.homeCollection === opt.val
                    ? `${opt.selBg} ${opt.selBrd} ${opt.selCol}`
                    : "border-slate-200 bg-gray-50 text-slate-500"
                }
              `}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </Fg>

      {/* Certifications */}
      <Fg style={{ marginBottom: 0 }}>
        <Label optional>
          Accreditations / Certifications
        </Label>

        <div className="mt-1 flex flex-wrap gap-[7px]">
          {CERTS.map((c) => {
            const sel = d.certs.includes(c);

            return (
              <button
                key={c}
                onClick={() => toggleCert(c)}
                className={`
                  rounded-full border-[1.5px]
                  px-3 py-[5px]
                  text-[11.5px] font-semibold
                  transition-all duration-150
                  ${
                    sel
                      ? "border-teal-500 bg-teal-100 text-teal-800"
                      : "border-slate-200 bg-gray-50 text-slate-500"
                  }
                `}
              >
                {sel ? "✓ " : ""}
                {c}
              </button>
            );
          })}
        </div>
      </Fg>
    </div>
  );
}

function StepPhotos({ d, set }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);

  const addFiles = (files) => {
    const newPhotos = Array.from(files)
      .slice(0, 10 - d.photos.length)
      .map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
      }));

    set("photos", [...d.photos, ...newPhotos]);
  };

  return (
    <div>
      <Fg>
        <Label optional>Lab Photos</Label>

        <Hint>
          Upload clear photos of your lab. Good
          images increase patient bookings by 3×.
        </Hint>

        {/* Upload Area */}
        <div
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`
            mt-2 cursor-pointer rounded-[12px]
            border-2 border-dashed
            p-8 text-center
            transition-all duration-150
            ${
              dragging
                ? "border-blue-600 bg-indigo-50"
                : "border-slate-200 bg-[#FAFAFA]"
            }
          `}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              addFiles(e.target.files)
            }
          />

          {/* Icon */}
          <div className="mx-auto mb-[10px] flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-indigo-50">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.blue}
              strokeWidth="1.8"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="3"
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="1.5"
              />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>

          <p className="mb-1 text-[13.5px] font-bold text-gray-700">
            Drop photos here or click to browse
          </p>

          <p className="text-[11.5px] text-slate-400">
            JPG, PNG, WEBP · Max 5MB each · Up
            to 10 photos
          </p>
        </div>

        {/* Preview Grid */}
        {d.photos.length > 0 && (
          <div className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-[10px]">
            {d.photos.map((p, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-[10px] border-[1.5px] border-slate-200"
              >
                <img
                  src={p.url}
                  alt={p.name}
                  className="block h-[95px] w-full object-cover"
                />

                {/* Remove Button */}
                <button
                  onClick={() =>
                    set(
                      "photos",
                      d.photos.filter(
                        (_, idx) => idx !== i
                      )
                    )
                  }
                  className="
                    absolute right-[5px] top-[5px]
                    flex h-[22px] w-[22px]
                    items-center justify-center
                    rounded-full
                    bg-black/55
                    text-[13px] text-white
                  "
                >
                  ×
                </button>

                {/* Filename */}
                <div className="bg-white px-[7px] py-[5px]">
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-slate-500">
                    {p.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Fg>

      {/* Tips Box */}
      <div className="rounded-[12px] border-[1.5px] border-teal-200 bg-teal-50 px-4 py-[14px]">
        <p className="mb-2 text-[12px] font-bold text-teal-800">
          📸 Photo tips for better bookings
        </p>

        {[
          "Upload at least 3–5 photos for a complete listing",
          "Show clean, well-lit spaces — patients value cleanliness",
          "Include equipment photos to build trust",
          "Avoid blurry or dark images",
        ].map((tip, i) => (
          <p
            key={i}
            className="my-1 flex items-start gap-[6px] text-[11.5px] text-teal-600"
          >
            <span className="shrink-0">
              ✓
            </span>

            {tip}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function LabRegistration() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [basic, setBasicRaw] = useState({
    labName: "",
    ownerName: "",
    mobile: "",
    whatsapp: "",
    license: "",
  });

  const [loc, setLocRaw] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    mapLink: "",
    opensAt: "8:00 AM",
    closesAt: "8:00 PM",
  });

  const [svc, setSvcRaw] = useState({
    tests: [],
    homeCollection: null,
    certs: [],
  });

  const [photos, setPhotosRaw] = useState({
    photos: [],
  });

  const setBasic = (k, v) =>
    setBasicRaw((d) => ({ ...d, [k]: v }));

  const setLoc = (k, v) =>
    setLocRaw((d) => ({ ...d, [k]: v }));

  const setSvc = (k, v) =>
    setSvcRaw((d) => ({ ...d, [k]: v }));

  const setPhotos = (k, v) =>
    setPhotosRaw((d) => ({ ...d, [k]: v }));

  const validate = () => {
    const e = {};

    if (step === 0) {
      if (!basic.labName)
        e.labName = "Required";

      if (!basic.ownerName)
        e.ownerName = "Required";

      if (!basic.mobile)
        e.mobile = "Required";
    }

    if (step === 1) {
      if (!loc.address)
        e.address = "Required";

      if (!loc.city)
        e.city = "Required";

      if (!loc.pincode)
        e.pincode = "Required";
    }

    if (step === 2) {
      if (svc.tests.length === 0)
        e.tests = "Add at least one test";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate())
      setStep((s) => s + 1);
  };

  const prev = () => {
    setStep((s) => s - 1);
    setErrors({});
  };

  const submit = () => {
    if (validate()) setSubmitted(true);
  };

  const resetAll = () => {
    setSubmitted(false);
    setStep(0);
    setErrors({});

    setBasicRaw({
      labName: "",
      ownerName: "",
      mobile: "",
      whatsapp: "",
      license: "",
    });

    setLocRaw({
      address: "",
      city: "",
      state: "",
      pincode: "",
      mapLink: "",
      opensAt: "8:00 AM",
      closesAt: "8:00 PM",
    });

    setSvcRaw({
      tests: [],
      homeCollection: null,
      certs: [],
    });

    setPhotosRaw({
      photos: [],
    });
  };

  /* ---------------- SUCCESS ---------------- */

  if (submitted)
    return (
      <div className="mx-auto max-w-[640px] p-4 font-['Nunito','DM_Sans',sans-serif]">
        <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white">
          {/* Top Gradient */}
          <div className="h-[5px] bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500" />

          <div className="flex flex-col items-center gap-[14px] px-8 py-10 text-center">
            {/* Icon */}
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-emerald-50">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2.2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Text */}
            <div>
              <h2 className="mb-[6px] font-serif text-[22px] font-bold text-slate-900">
                Lab registered successfully!
              </h2>

              <p className="text-[15px] leading-[1.7] text-slate-500">
                <strong>{basic.labName}</strong>{" "}
                has been submitted for
                review.
                <br />
                Our team will activate your
                listing within 24–48 hours.
              </p>
            </div>

            {/* Summary */}
            <div className="w-full max-w-[340px]">
              {[
                ["Lab name", basic.labName],
                ["Owner", basic.ownerName],
                ["Contact", basic.mobile],
                [
                  "City",
                  loc.city +
                    (loc.pincode
                      ? ` – ${loc.pincode}`
                      : ""),
                ],
                [
                  "Tests listed",
                  svc.tests.length +
                    " tests",
                ],
                [
                  "Home collection",
                  svc.homeCollection === true
                    ? "Yes ✅"
                    : svc.homeCollection ===
                      false
                    ? "No ❌"
                    : "Not specified",
                ],
                [
                  "Photos",
                  photos.photos.length +
                    " uploaded",
                ],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex justify-between border-b border-gray-100 py-2 text-[15px]"
                >
                  <span className="text-slate-500">
                    {l}
                  </span>

                  <span className="font-bold text-slate-900">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Notice */}
            <div className="max-w-[340px] rounded-[10px] border border-orange-200 bg-orange-50 px-4 py-3 text-left">
              <p className="mb-1 text-[14px] font-bold text-orange-800">
                🔔 What happens next?
              </p>

              <p className="text-[14px] leading-[1.6] text-orange-700">
                Our admin will call you at{" "}
                <strong>
                  {basic.mobile}
                </strong>{" "}
                to verify and activate your
                listing. Keep your phone
                reachable.
              </p>
            </div>

            {/* Button */}
            <button
              onClick={resetAll}
              className="
                rounded-[10px]
                bg-blue-600
                px-7 py-[10px]
                text-[14px] font-semibold
                text-white
                transition-all duration-150
                hover:bg-blue-700
              "
            >
              Register Another Lab
            </button>
          </div>
        </div>
      </div>
    );

  /* ---------------- MAIN ---------------- */

  return (
    <div className="mx-auto  max-w-[680px] rounded-2xl mb-10 bg-slate-200 pb-12 font-['Nunito','DM_Sans',sans-serif] mt-20">
      {/* HERO */}
      <div className="relative overflow-hidden bg-blue-600 px-8 pb-[4.5rem] pt-8   rounded-t-2xl">
        <div className="absolute -right-[50px] -top-[50px] h-[200px] w-[200px] rounded-full bg-white/10" />

        <div className="mb-3 inline-flex items-center gap-[6px] rounded-full bg-white/15 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.09em] text-blue-200">
          <span className="inline-block h-[6px] w-[6px] rounded-full bg-blue-300" />
          For Lab Owners
        </div>

        <h1 className="mb-[6px] font-serif text-[24px] font-bold leading-[1.3] text-white">
          🧪 Register your lab & start
          receiving bookings
        </h1>

        <p className="text-[15px] leading-[1.7] text-blue-100 font-medium">
          Fill in your lab details below.
          Once verified, your lab will be
          visible to patients searching
          nearby.
        </p>
      </div>

      {/* STEP BAR */}
      <div className="mx-2 mt-[10px] grid grid-cols-4 gap-1 rounded-[14px] border border-slate-200 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.07)]">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;

          return (
            <div
              key={s.id}
              onClick={() =>
                i < step &&
                (setStep(i), setErrors({}))
              }
              className={`
                flex flex-col items-center gap-[5px]
                rounded-[10px]
                px-1 py-2
                transition-all duration-150
                ${
                  active
                    ? "bg-indigo-50"
                    : done
                    ? "bg-emerald-50"
                    : "bg-transparent"
                }
                ${
                  i < step
                    ? "cursor-pointer"
                    : "cursor-default"
                }
              `}
            >
              {/* Circle */}
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full
                  border-2 text-[18px]
                  transition-all duration-200
                  ${
                    active
                      ? "border-blue-700 bg-blue-600 text-white"
                      : done
                      ? "border-transparent bg-green-500 text-white"
                      : "border-transparent bg-slate-100 text-slate-400"
                  }
                `}
              >
                {done ? "✓" : s.icon}
              </div>

              {/* Text */}
              <div className="text-center">
                <p
                  className={`
                    text-[14.5px] font-bold
                    ${
                      active
                        ? "text-blue-600"
                        : done
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }
                  `}
                >
                  {s.label}
                </p>

                <p className="text-[14px] text-slate-600">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CARD */}
      <div className="mx-2 my-4">
        <div className="overflow-hidden rounded-[14px] border border-slate-200 bg-white">
          {/* Header */}
          <div className="flex items-center gap-[10px] border-b border-slate-100 bg-slate-50 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-indigo-50 text-[16px]">
              {STEPS[step].icon}
            </div>

            <div>
              <p className="text-[16px] font-bold text-slate-900">
                {STEPS[step].label}
              </p>

              <p className="text-[14px] text-slate-500">
                Step {step + 1} of{" "}
                {STEPS.length} —{" "}
                {STEPS[step].desc}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 0 && (
              <StepBasic
                d={basic}
                set={setBasic}
                errors={errors}
              />
            )}

            {step === 1 && (
              <StepLocation
                d={loc}
                set={setLoc}
                errors={errors}
              />
            )}

            {step === 2 && (
              <StepServices
                d={svc}
                set={setSvc}
                errors={errors}
              />
            )}

            {step === 3 && (
              <StepPhotos
                d={photos}
                set={setPhotos}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
            {/* Back */}
            <button
              onClick={prev}
              disabled={step === 0}
              className={`
                rounded-[9px]
                border-[1.5px] border-slate-200
                bg-white
                px-5 py-[9px]
                text-[12.5px] font-bold
                text-gray-700
                ${
                  step === 0
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer"
                }
              `}
            >
              ← Back
            </button>

            {/* Dots */}
            <div className="flex gap-[5px]">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`
                    h-[5px] rounded-[3px]
                    transition-all duration-200
                    ${
                      i === step
                        ? "w-5 bg-blue-600"
                        : i < step
                        ? "w-[6px] bg-teal-500"
                        : "w-[6px] bg-slate-200"
                    }
                  `}
                />
              ))}
            </div>

            {/* Buttons */}
            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                className="
                  rounded-[9px]
                  bg-blue-600
                  px-5 py-[9px]
                  text-[12.5px] font-bold
                  text-white
                  transition-all duration-150
                  hover:bg-blue-700
                "
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={submit}
                className="
                  flex items-center gap-[7px]
                  rounded-[9px]
                  bg-blue-600
                  px-[22px] py-[9px]
                  text-[12.5px] font-bold
                  text-white
                  transition-all duration-150
                  hover:bg-blue-700
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>

                Register Lab
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER BADGES */}
      <div className="mt-[14px] flex flex-wrap justify-center gap-5 px-6">
        {[
          "🔒 Secure & private",
          "✅ Free to register",
          "📞 Admin verification call",
          "🚀 Live in 24–48 hrs",
        ].map((t) => (
          <span
            key={t}
            className="text-[13px] font-semibold text-slate-600"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}