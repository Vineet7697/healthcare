import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchVisitDoctors } from "../../../services/patientService";

const certificateTypes = [
  {
    id: "medical",
    title: "Medical Fitness",
    description: "For employment or sports",
    icon: "🏥",
  },
  {
    id: "vaccination",
    title: "Vaccination",
    description: "Immunization records",
    icon: "💉",
  },
  {
    id: "disability",
    title: "Disability",
    description: "Official disability proof",
    icon: "♿",
  },
  {
    id: "second-opinion",
    title: "Second Opinion",
    description: "Expert medical review",
    icon: "🔬",
  },
  {
    id: "Discharge",
    title: "Discharge Summary",
    description: "Summary of hospital discharge",
    icon: "🏨",
  },
];

const steps = ["Type", "Medical Info", "Documents", "Review"];

const purposeOptions = [
  "Employment / Job",
  "Sports / Athletic activity",
  "Travel",
  "School / Education",
  "Insurance",
  "Legal/ Court",
  "Other",
];

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const RequestCertificate = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const passedDoctor = state?.doctor || null;

  const [doctor, setDoctor] = useState(passedDoctor);
  const [doctors, setDoctors] = useState([]);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState("medical");
  const [purpose, setPurpose] = useState("Employment / Job");
  const [notes, setNotes] = useState("");

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");

  const handleNext = () => {
    if (currentStep === 0 && !doctor) {
      alert("Please select an assigned doctor to proceed.");
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  useEffect(() => {
    if (!passedDoctor) fetchDoctors();
  }, [passedDoctor]);

  const fetchDoctors = async () => {
    try {
      const res = await searchVisitDoctors({
        search: "",
        city: "",
        page: 1,
        limit: 50,
      });
      setDoctors(res.data?.data?.doctors || []);
    } catch (error) {
      console.error(
        "Error fetching doctors:",
        error.response?.data || error.message,
      );
    }
  };

  const handleSubmit = () => {
    alert(
      "Certificate request submitted! The assigned doctor will review it shortly.",
    );
    navigate("/client/mycertificate");
  };

  /* ── Step dot style helpers ── */
  const stepDotBg = (index) => {
    if (index === currentStep)
      return "bg-gradient-to-br from-[#0086C3] to-[#00b4d8] text-white shadow-[0_4px_12px_rgba(0,134,195,0.35)]";
    if (index < currentStep) return "bg-green-100 text-green-700";
    return "bg-black/5 text-slate-400";
  };

  const stepLabelColor = (index) => {
    if (index === currentStep) return "text-[#0086C3]";
    if (index < currentStep) return "text-green-700";
    return "text-slate-400";
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className=" text-[13px] font-semibold text-[#0086C3] mb-5 flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:-translate-x-1 bg-transparent border-none"
        >
          ← Back
        </button>

        {/* Page Title */}
        <div className="mb-6 animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">
          <h1 className=" text-[24px] font-extrabold text-[#0c1e3a]">
            Apply for Certificate
          </h1>
          {doctor && (
            <p className=" text-[13px] mt-1 text-slate-500">
              Requesting from{" "}
              <span className="font-semibold text-[#0086C3]">
                {doctor.doctorName}
              </span>{" "}
              — {doctor.specialization}
            </p>
          )}
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-2xl px-6 py-4 mb-5 flex items-center shadow-[0_2px_20px_rgba(12,30,58,0.08)] border border-black/[0.06]">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-bold transition-all duration-300 ${stepDotBg(index)}`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <span
                  className={`text-[13px] font-semibold hidden sm:block ${stepLabelColor(index)}`}
                >
                  {step}
                </span>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 rounded transition-all duration-300 ${index < currentStep ? "bg-green-300" : "bg-black/[0.07]"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 1 — Type ── */}
        {currentStep === 0 && (
          <StepCard>
            <h2 className=" text-[17px] font-bold text-[#0c1e3a] mb-4">
              Step 1 — Select Certificate Type
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {certificateTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`cursor-pointer rounded-xl px-4 py-3 transition-all duration-200 ${
                    selectedType === type.id
                      ? "border-[1.5px] border-[#0086C3] bg-[rgba(0,134,195,0.05)] shadow-[0_0_0_3px_rgba(0,134,195,0.1)]"
                      : "border border-black/[0.08] bg-[#f8fafc]"
                  }`}
                >
                  <div className="text-xl mb-1">{type.icon}</div>
                  <p
                    className={`text-[14px] font-semibold ${selectedType === type.id ? "text-[#0086C3]" : "text-[#0c1e3a]"}`}
                  >
                    {type.title}
                  </p>
                  <p className=" text-[12px] text-slate-400">
                    {type.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Assigned Doctor */}
            <div className="mb-4">
              <FieldLabel>
                🩺 Assigned Doctor <Req />
              </FieldLabel>
              {doctor ? (
                <div className="rounded-xl px-4 py-3 bg-[#f8fafc] border border-black/[0.08]">
                  <p className=" font-semibold text-[#0c1e3a] text-[14px]">
                    {doctor.doctorName}
                  </p>
                  <p className=" text-[12px] text-slate-500 mt-0.5">
                    {doctor.specialization}
                  </p>
                </div>
              ) : (
                <StyledSelect
                  onChange={(e) => {
                    const selected = doctors.find(
                      (doc) => doc.doctorId === Number(e.target.value),
                    );
                    setDoctor(selected);
                  }}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.doctorId} value={doc.doctorId}>
                      {doc.doctorName} — {doc.specialization}
                    </option>
                  ))}
                </StyledSelect>
              )}
            </div>

            {/* Purpose */}
            <div className="mb-4">
              <FieldLabel>
                📌 Purpose of Certificate <Req />
              </FieldLabel>
              <StyledSelect
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                {purposeOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </StyledSelect>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <FieldLabel>📝 Additional Notes for Doctor</FieldLabel>
              <StyledTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific medical conditions or notes for the doctor..."
              />
            </div>

            <ActionButtons
              onCancel={() => navigate(-1)}
              onNext={handleNext}
              isFirst
            />
          </StepCard>
        )}

        {/* ── Step 2 — Medical Details ── */}
        {currentStep === 1 && (
          <StepCard>
            <h2 className=" text-[17px] font-bold text-[#0c1e3a] mb-4">
              Step 2 — Medical Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <FieldBox label="Full Name">
                <StyledInput
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </FieldBox>

              <FieldBox label="Date of Birth">
                <StyledInput
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </FieldBox>
              <FieldBox label="Gender">
                <StyledSelect
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </StyledSelect>
              </FieldBox>

              <FieldBox label="🩸 Blood Group">
                <StyledSelect
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg}>{bg}</option>
                  ))}
                </StyledSelect>
              </FieldBox>

              <FieldBox label="📏 Height (cm)">
                <StyledInput
                  type="number"
                  placeholder="e.g. 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </FieldBox>
              <FieldBox label="⚖️ Weight (kg)">
                <StyledInput
                  type="number"
                  placeholder="e.g. 65"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </FieldBox>
            </div>

            <div className="mb-4">
              <FieldBox label="🏥 Known Medical Conditions">
                <StyledTextarea
                  placeholder="Diabetes, Hypertension, Asthma..."
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                />
              </FieldBox>
            </div>
            <div className="mb-6">
              <FieldBox label="💊 Current Medications">
                <StyledTextarea
                  placeholder="Metformin 500mg, Amlodipine..."
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                />
              </FieldBox>
            </div>

            <ActionButtons onBack={handleBack} onNext={handleNext} />
          </StepCard>
        )}

        {/* ── Step 3 — Documents ── */}
        {currentStep === 2 && (
          <StepCard>
            <h2 className=" text-[17px] font-bold text-[#0c1e3a] mb-4">
              Step 3 — Upload Documents
            </h2>

            {[
              "ID Proof (Aadhar / PAN)",
              "Previous Medical Reports",
              "Prescription (if any)",
            ].map((docLabel, i) => (
              <div className="mb-4" key={i}>
                <FieldLabel>📎 {docLabel}</FieldLabel>
                <label className="w-full flex flex-col items-center justify-center rounded-xl py-6 cursor-pointer transition-all duration-200 border-[1.5px] border-dashed border-[rgba(0,134,195,0.35)] bg-[rgba(0,134,195,0.03)] hover:bg-[rgba(0,134,195,0.07)]">
                  <span className="text-[22px]">📂</span>
                  <p className=" text-[13px] font-semibold mt-1 text-[#0086C3]">
                    Click to upload
                  </p>
                  <p className=" text-[11px] text-slate-400">
                    PDF, JPG, PNG — max 5MB
                  </p>
                  <input type="file" className="hidden" />
                </label>
              </div>
            ))}

            <div className="mt-6">
              <ActionButtons onBack={handleBack} onNext={handleNext} />
            </div>
          </StepCard>
        )}

        {/* ── Step 4 — Review ── */}
        {currentStep === 3 && (
          <StepCard>
            <h2 className=" text-[17px] font-bold text-[#0c1e3a] mb-5">
              Step 4 — Review & Submit
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {[
                { label: "Full Name", value: fullName, icon: "👤" },
                { label: "Date of Birth", value: dob, icon: "🎂" },
                { label: "Gender", value: gender, icon: "⚧️" },
                { label: "Blood Group", value: bloodGroup, icon: "🩸" },
                {
                  label: "Certificate Type",
                  value: certificateTypes.find((c) => c.id === selectedType)
                    ?.title,
                  icon: "📋",
                },
                { label: "Purpose", value: purpose, icon: "📌" },
                {
                  label: "Doctor",
                  value: doctor?.doctorName || "Not assigned",
                  icon: "🩺",
                },
                {
                  label: "Specialization",
                  value: doctor?.specialization || "—",
                  icon: "🏥",
                },
                {
                  label: "Height",
                  value: height ? `${height} cm` : "—",
                  icon: "📏",
                },
                {
                  label: "Weight",
                  value: weight ? `${weight} kg` : "—",
                  icon: "⚖️",
                },
                
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl px-4 py-3 bg-[#f8fafc] border border-black/[0.05]"
                >
                  <p className=" text-[11px] font-semibold uppercase tracking-wider mb-1 text-slate-400">
                    {item.icon} {item.label}
                  </p>
                  <p className=" text-[14px] font-semibold text-[#0c1e3a]">
                    {item.value || "—"}
                  </p>
                </div>
              ))}

              {notes && (
                <div className="sm:col-span-2 rounded-xl px-4 py-3 bg-[#f8fafc] border border-black/[0.05]">
                  <p className=" text-[11px] font-semibold uppercase tracking-wider mb-1 text-slate-400">
                    📝 Notes
                  </p>
                  <p className=" text-[14px] text-[#0c1e3a]">{notes}</p>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl px-4 py-3 mb-5 bg-[rgba(0,134,195,0.06)] border border-[rgba(0,134,195,0.15)]">
              <p className=" text-[12px] text-[#0c1e3a]">
                ℹ️ By submitting, you confirm that all information provided is
                accurate. The assigned doctor will review and issue the
                certificate.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleBack}
                className=" font-semibold text-[13px] text-slate-500 px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-x-0.5 bg-transparent border border-black/[0.12]"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className=" font-bold text-[14px] text-white px-8 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-br from-[#0086C3] to-[#00b4d8] shadow-[0_4px_14px_rgba(0,134,195,0.35)] hover:shadow-[0_6px_20px_rgba(0,134,195,0.5)]"
              >
                ✅ Submit Request
              </button>
            </div>
          </StepCard>
        )}
      </div>
    </div>
  );
};

/* ─── Reusable sub-components ─── */

const StepCard = ({ children }) => (
  <div className="bg-white rounded-2xl overflow-hidden animate-[fadeUp_0.4s_cubic-bezier(0.22,1,0.36,1)_both] shadow-[0_2px_20px_rgba(12,30,58,0.08)] border border-black/[0.06]">
    <div className="h-1 w-full bg-gradient-to-r from-[#0086C3] via-[#00b4d8] to-[#2ecc71]" />
    <div className="px-6 py-5">{children}</div>
  </div>
);

const FieldLabel = ({ children }) => (
  <label className=" text-[11px] font-semibold uppercase tracking-wider mb-1.5 block">
    {children}
  </label>
);

const Req = () => <span className="text-red-500">*</span>;

const FieldBox = ({ label, children }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

const inputBaseCls =
  "w-full  text-[14px] text-[#0c1e3a] rounded-xl px-4 py-3 outline-none transition-all duration-200 bg-[#f8fafc] border border-black/[0.12] focus:border-[1.5px] focus:border-[#0086C3]";

const StyledInput = (props) => <input {...props} className={inputBaseCls} />;

const StyledSelect = ({ children, ...props }) => (
  <select {...props} className={inputBaseCls}>
    {children}
  </select>
);

const StyledTextarea = (props) => (
  <textarea rows={3} {...props} className={`${inputBaseCls} resize-none`} />
);

const ActionButtons = ({ onBack, onNext, onCancel, isFirst }) => (
  <div className="flex items-center justify-between gap-3">
    {isFirst ? (
      <button
        onClick={onCancel}
        className=" font-semibold text-[13px] text-slate-500 px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 bg-transparent border border-black/[0.12]"
      >
        Cancel
      </button>
    ) : (
      <button
        onClick={onBack}
        className=" font-semibold text-[13px] text-slate-500 px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-x-0.5 bg-transparent border border-black/[0.12]"
      >
        ← Back
      </button>
    )}
    <button
      onClick={onNext}
      className=" font-bold text-[14px] text-white px-8 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 bg-gradient-to-br from-[#0086C3] to-[#00b4d8] shadow-[0_4px_14px_rgba(0,134,195,0.35)] hover:shadow-[0_6px_20px_rgba(0,134,195,0.5)]"
    >
      {isFirst ? "Next Step →" : "Next Step →"}
    </button>
  </div>
);

export default RequestCertificate;
