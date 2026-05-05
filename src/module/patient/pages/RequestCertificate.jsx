import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchVisitDoctors } from "../../../services/patientService";
import { validateStep } from "../../../controllers/FormValidation";
import { notify } from "../../../utils/notify";
import Select from "react-select";
import {
  createRequest,
  uploadDocuments,
} from "../../../services/certificateService";

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
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const DOC_FIELDS = [
  {
    field: "profilePhoto",
    label: "Profile Photo",
    required: true,
    accept: "image/*",
    hint: "Upload your profile picture (jpg, png)",
  },
  {
    field: "idProof",
    label: "Government ID Proof",
    required: true,
    accept: "image/*,.pdf",
    hint: "Aadhaar / PAN / Passport",
  },
  {
    field: "medicalReports",
    label: "Medical Reports",
    required: false,
    accept: "image/*,.pdf",
    hint: "Previous diagnostic reports",
  },
  {
    field: "prescription",
    label: "Prescription",
    required: false,
    accept: "image/*,.pdf",
    hint: "Doctor's prescription (if available)",
  },
];

const StepCard = ({ children }) => (
  <div
    className="bg-white rounded-2xl overflow-hidden border border-black/[0.06]"
    style={{
      boxShadow: "0 2px 20px rgba(12,30,58,0.08)",
      animation: "fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
    }}
  >
    <div className="h-1 w-full bg-gradient-to-r from-[#0086C3] via-[#00b4d8] to-[#2ecc71]" />
    <div className="px-4 sm:px-6 py-5">{children}</div>
  </div>
);

const StepHeading = ({ children }) => (
  <h2 className="text-base sm:text-[17px] font-bold text-[#0c1e3a] mb-4">
    {children}
  </h2>
);

const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
    {children}
  </label>
);

const Req = () => <span className="text-red-500 ml-0.5">*</span>;

const FieldBox = ({ label, children }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {children}
  </div>
);

const ErrMsg = ({ msg }) =>
  msg ? <p className="text-red-500 text-[11px] mt-1">{msg}</p> : null;

const inputCls =
  "w-full text-[14px] text-[#0c1e3a] rounded-xl px-4 py-2.5 sm:py-3 outline-none transition-all duration-200 bg-[#f8fafc] border border-black/[0.12] focus:border-[#0086C3] focus:ring-2 focus:ring-[rgba(0,134,195,0.12)] focus:bg-white placeholder:text-slate-300";

const StyledInput = (props) => (
  <input {...props} className={inputCls} style={{ fontSize: "16px" }} />
);
const StyledSelect = ({ children, ...props }) => (
  <select {...props} className={inputCls}>
    {children}
  </select>
);
const StyledTextarea = (props) => (
  <textarea
    rows={3}
    {...props}
    className={`${inputCls} resize-none`}
    style={{ fontSize: "16px" }}
  />
);

const ActionButtons = ({
  onBack,
  onNext,
  onCancel,
  isFirst,
  submitLabel,
  onSubmit,
  submitting,
}) => (
  <div className="flex items-center justify-between gap-3 mt-6">
    {/* Left btn */}
    {isFirst ? (
      <button
        onClick={onCancel}
        className="text-[13px] font-semibold text-slate-500 px-4 sm:px-5 py-2.5 rounded-xl border border-black/[0.12] bg-transparent hover:bg-slate-50 transition-all"
      >
        Cancel
      </button>
    ) : (
      <button
        onClick={onBack}
        className="text-[13px] font-semibold text-slate-500 px-4 sm:px-5 py-2.5 rounded-xl border border-black/[0.12] bg-transparent hover:bg-slate-50 hover:-translate-x-0.5 transition-all"
      >
        ← Back
      </button>
    )}

    {/* Right btn */}
    {onSubmit ? (
      <button
        onClick={onSubmit}
        disabled={submitting}
        className={`text-[14px] font-bold text-white px-6 sm:px-8 py-2.5 rounded-xl transition-all duration-200
          ${
            submitting
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-gradient-to-br from-[#0086C3] to-[#00b4d8] hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(0,134,195,0.35)] hover:shadow-[0_6px_20px_rgba(0,134,195,0.45)]"
          }`}
      >
        {submitting ? "Submitting…" : submitLabel || "✅ Submit Request"}
      </button>
    ) : (
      <button
        onClick={onNext}
        className="text-[14px] font-bold cursor-pointer text-white px-6 sm:px-8 py-2.5 rounded-xl bg-gradient-to-br from-[#0086C3] to-[#00b4d8] hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(0,134,195,0.35)] hover:shadow-[0_6px_20px_rgba(0,134,195,0.45)] transition-all duration-200"
      >
        Next Step →
      </button>
    )}
  </div>
);

const FileUploadCard = ({
  field,
  label,
  required,
  accept,
  hint,
  file,
  onUpload,
  onDelete,
  error,
}) => {
  const isImage = file && file.type?.startsWith("image/");
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <FieldLabel>
          {label} {required && <Req />}
        </FieldLabel>
        {file && (
          <button
            onClick={() => onDelete(field)}
            className="text-[11px] font-semibold text-red-500 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      {!file ? (
        <label className="flex items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 sm:px-5 py-4 sm:py-5 cursor-pointer hover:border-[#0086C3] hover:bg-blue-50 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg flex-shrink-0">
            📤
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700">
              Click to upload
            </p>
            <p className="text-xs text-slate-400 truncate">{hint}</p>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={(e) => onUpload(e, field)}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center gap-3 sm:gap-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 sm:px-5 py-3 sm:py-4">
          {isImage ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-xl">
              📄
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-800 truncate">
              {file.name}
            </p>
            <p className="text-xs text-emerald-600">
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            onClick={() => window.open(URL.createObjectURL(file))}
            className="text-[#0086C3] text-xs font-semibold hover:underline flex-shrink-0"
          >
            View
          </button>
        </div>
      )}

      <ErrMsg msg={error} />
    </div>
  );
};

const selectStyles = {
  control: (base, state) => ({
    ...base,
    fontSize: "14px",
    color: "#0c1e3a",
    borderRadius: "0.75rem",
    padding: "2px 4px",
    background: "#f8fafc",
    border: state.isFocused
      ? "1.5px solid #0086C3"
      : "1px solid rgba(0,0,0,0.12)",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(0,134,195,0.12)" : "none",
    transition: "all 0.2s",
    "&:hover": { borderColor: "#0086C3" },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "13px",
    background: state.isSelected
      ? "#0086C3"
      : state.isFocused
        ? "rgba(0,134,195,0.08)"
        : "#fff",
    color: state.isSelected ? "#fff" : "#0c1e3a",
    borderRadius: "6px",
    margin: "2px 4px",
    width: "calc(100% - 8px)",
    cursor: "pointer",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  }),
  singleValue: (base) => ({ ...base, color: "#0c1e3a", fontSize: "14px" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: "14px" }),
  indicatorSeparator: () => ({ display: "none" }),
};

const RequestCertificate = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const passedDoctor = state?.doctor || null;

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctor, setDoctor] = useState(passedDoctor);
  const [doctors, setDoctors] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [selectedType, setSelectedType] = useState("medical");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");

  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [documents, setDocuments] = useState({
    profilePhoto: null,
    idProof: null,
    medicalReports: null,
    prescription: null,
  });

  const isDoctorFixed = !!passedDoctor;

  const doctorOptions = doctors.map((doc) => ({
    value: doc.doctorId,
    label: `${doc.doctorName} — ${doc.specialization}`,
  }));

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (passedDoctor && doctors.length > 0) {
      const match = doctors.find((d) => d.doctorId === passedDoctor.doctorId);
      setDoctor(match || passedDoctor);
    }
  }, [passedDoctor, doctors]);

  const fetchDoctors = async () => {
    try {
      const res = await searchVisitDoctors({
        search: "",
        city: "",
        page: 1,
        limit: 50,
      });
      setDoctors(res.data?.data?.doctors || []);
    } catch (e) {
      console.error(e);
    }
  };

  const validateFile = (file) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type))
      return "Only PDF, JPG, and PNG files are allowed.";
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5 MB.";
    return null;
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      setErrors((p) => ({ ...p, [field]: err }));
      return;
    }
    setDocuments((p) => ({ ...p, [field]: file }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleDeleteDoc = (field) =>
    setDocuments((p) => ({ ...p, [field]: null }));

  const handleNext = () => {
    const formData = {
      doctor,
      purpose,
      fullName,
      dob,
      gender,
      height,
      weight,
      documents,
    };
    const errs = validateStep(currentStep, formData, validateFile);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        notify.error("Please login again.");
        navigate("/login");
        return;
      }
      if (!doctor?.doctorId) {
        notify.error("Please select an assigned doctor.");
        return;
      }

      const res = await createRequest({
        doctor_id: doctor.doctorId,
        certificate_type: selectedType,
        purpose,
        notes,
        full_name: fullName,
        dob,
        gender,
        blood_group: bloodGroup,
        height,
        weight,
        medical_conditions: conditions,
        medications,
      });

      const requestId = res.data.requestId;
      const hasDocuments = Object.values(documents).some((f) => f !== null);

      if (hasDocuments) {
        const fd = new FormData();
        fd.append("request_id", requestId);
        if (documents.profilePhoto)
          fd.append("profilePhoto", documents.profilePhoto);
        if (documents.idProof) fd.append("idProof", documents.idProof);
        if (documents.medicalReports)
          fd.append("medicalReports", documents.medicalReports);
        if (documents.prescription)
          fd.append("prescription", documents.prescription);
        await uploadDocuments(fd);
      }

      notify.success("Certificate request submitted successfully!");
      navigate("/client/mycertificate", { state: { success: true } });
    } catch (e) {
      notify.error(e.response?.data?.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const dotClass = (i) => {
    if (i === currentStep)
      return "bg-gradient-to-br from-[#0086C3] to-[#00b4d8] text-white shadow-[0_4px_12px_rgba(0,134,195,0.35)]";
    if (i < currentStep) return "bg-emerald-100 text-emerald-700";
    return "bg-black/[0.06] text-slate-400";
  };
  const labelClass = (i) => {
    if (i === currentStep) return "text-[#0086C3]";
    if (i < currentStep) return "text-emerald-700";
    return "text-slate-400";
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0086C3] mb-4 sm:mb-5 hover:-translate-x-1 transition-transform bg-transparent border-none cursor-pointer"
        >
          ← Back
        </button>

        <div
          className="mb-5 sm:mb-6"
          style={{ animation: "fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0c1e3a]">
            Apply for Certificate
          </h1>
          {doctor && (
            <p className="text-[13px] mt-1 text-slate-500">
              Requesting from{" "}
              <span
                onClick={() =>
                  navigate(`/client/doctor-profile/${doctor.doctorId}`)
                }
                className="font-semibold text-[#0086C3] cursor-pointer hover:underline"
              >
                {doctor.doctorName}
              </span>{" "}
              — {doctor.specialization}
            </p>
          )}
        </div>

        <div
          className="bg-white rounded-2xl px-4 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-5 flex items-center border border-black/[0.06]"
          style={{ boxShadow: "0 2px 20px rgba(12,30,58,0.08)" }}
        >
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[12px] sm:text-[13px] font-bold transition-all duration-300 ${dotClass(i)}`}
                >
                  {i < currentStep ? "✓" : i + 1}
                </div>

                <span
                  className={`text-[12px] sm:text-[13px] font-semibold hidden sm:block ${labelClass(i)}`}
                >
                  {step}
                </span>
              </div>
              {i !== steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded transition-all duration-300 ${i < currentStep ? "bg-emerald-300" : "bg-black/[0.07]"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ════════════════════════════════
            STEP 1 — TYPE
        ════════════════════════════════ */}
        {currentStep === 0 && (
          <StepCard>
            <StepHeading>Step 1 — Select Certificate Type</StepHeading>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
              {certificateTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`cursor-pointer rounded-xl px-4 py-3 transition-all duration-200 ${
                    selectedType === type.id
                      ? "border-[1.5px] border-[#0086C3] bg-[rgba(0,134,195,0.05)] shadow-[0_0_0_3px_rgba(0,134,195,0.1)]"
                      : "border border-black/[0.08] bg-[#f8fafc] hover:border-black/20"
                  }`}
                >
                  <div className="text-xl mb-1">{type.icon}</div>
                  <p
                    className={`text-[13px] sm:text-[14px] font-semibold ${selectedType === type.id ? "text-[#0086C3]" : "text-[#0c1e3a]"}`}
                  >
                    {type.title}
                  </p>
                  <p className="text-[11px] sm:text-[12px] text-slate-400 mt-0.5">
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
              <Select
                options={doctorOptions}
                placeholder="Search doctor..."
                styles={selectStyles}
                isDisabled={isDoctorFixed}
                value={
                  doctor
                    ? {
                        value: doctor.doctorId,
                        label: `${doctor.doctorName} — ${doctor.specialization}`,
                      }
                    : null
                }
                onChange={(sel) => {
                  if (isDoctorFixed) return;
                  setDoctor(doctors.find((d) => d.doctorId === sel.value));
                  setErrors((p) => ({ ...p, doctor: "" }));
                }}
              />
              <ErrMsg msg={errors.doctor} />
            </div>

            {/* Purpose */}
            <div className="mb-4">
              <FieldLabel>
                📌 Purpose of Certificate <Req />
              </FieldLabel>
              <StyledSelect
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  setErrors((p) => ({ ...p, purpose: "" }));
                }}
              >
                <option value="">Select Purpose</option>
                <option value="Employment / Job">Employment / Job</option>
                <option value="Sports / Athletic activity">
                  Sports / Athletic activity
                </option>
                <option value="Travel">Travel</option>
                <option value="School / Education">School / Education</option>
                <option value="Insurance">Insurance</option>
                <option value="Legal/ Court">Legal / Court</option>
                <option value="Other">Other</option>
              </StyledSelect>
              <ErrMsg msg={errors.purpose} />
            </div>

            {/* Notes */}
            <div className="mb-2">
              <FieldLabel>📝 Additional Notes for Doctor</FieldLabel>
              <StyledTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific medical conditions or notes for the doctor…"
              />
            </div>

            <ActionButtons
              onCancel={() => navigate(-1)}
              onNext={handleNext}
              isFirst
            />
          </StepCard>
        )}

        {/* ════════════════════════════════
            STEP 2 — MEDICAL DETAILS
        ════════════════════════════════ */}
        {currentStep === 1 && (
          <StepCard>
            <StepHeading>Step 2 — Medical Details</StepHeading>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <FieldBox label="👤 Full Name">
                <StyledInput
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <ErrMsg msg={errors.fullName} />
              </FieldBox>

              <FieldBox label="🎂 Date of Birth">
                <StyledInput
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <ErrMsg msg={errors.dob} />
              </FieldBox>

              <FieldBox label="⚧️ Gender">
                <StyledSelect
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </StyledSelect>
                <ErrMsg msg={errors.gender} />
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
                <ErrMsg msg={errors.height} />
              </FieldBox>

              <FieldBox label="⚖️ Weight (kg)">
                <StyledInput
                  type="number"
                  placeholder="e.g. 65"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                <ErrMsg msg={errors.weight} />
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

        {/* ════════════════════════════════
            STEP 3 — DOCUMENTS
        ════════════════════════════════ */}
        {currentStep === 2 && (
          <StepCard>
            <StepHeading>Step 3 — Upload Documents</StepHeading>

            <div className="space-y-4">
              {DOC_FIELDS.map((doc) => (
                <FileUploadCard
                  key={doc.field}
                  {...doc}
                  file={documents[doc.field]}
                  error={errors[doc.field]}
                  onUpload={handleFileChange}
                  onDelete={handleDeleteDoc}
                />
              ))}
            </div>

            <ActionButtons onBack={handleBack} onNext={handleNext} />
          </StepCard>
        )}

        {/* ════════════════════════════════
            STEP 4 — REVIEW
        ════════════════════════════════ */}
        {currentStep === 3 && (
          <StepCard>
            <StepHeading>Step 4 — Review & Submit</StepHeading>

            {/* Summary grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5">
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
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    {item.icon} {item.label}
                  </p>
                  <p className="text-[13px] sm:text-[14px] font-semibold text-[#0c1e3a] truncate">
                    {item.value || "—"}
                  </p>
                </div>
              ))}

              {notes && (
                <div className="sm:col-span-2 rounded-xl px-4 py-3 bg-[#f8fafc] border border-black/[0.05]">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    📝 Notes
                  </p>
                  <p className="text-[13px] sm:text-[14px] text-[#0c1e3a]">
                    {notes}
                  </p>
                </div>
              )}
            </div>

            {/* Uploaded documents preview */}
            {Object.values(documents).some(Boolean) && (
              <div className="mb-5">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-[#0c1e3a] mb-3">
                  📄 Uploaded Documents
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {Object.entries(documents).map(([key, file]) => {
                    if (!file) return null;
                    const isImage = file.type?.startsWith("image/");
                    const labels = {
                      profilePhoto: "Profile Photo",
                      idProof: "ID Proof",
                      medicalReports: "Medical Reports",
                      prescription: "Prescription",
                    };
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-black/[0.05] bg-[#f8fafc] p-3"
                      >
                        <p className="text-[10px] sm:text-xs font-semibold text-slate-400 mb-2 truncate">
                          {labels[key]}
                        </p>
                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={labels[key]}
                            className="w-full h-20 sm:h-24 object-cover rounded-lg mb-2"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-20 sm:h-24 rounded-lg bg-blue-50 mb-2 text-sm text-slate-500">
                            📄 PDF
                          </div>
                        )}
                        <button
                          onClick={() => window.open(URL.createObjectURL(file))}
                          className="text-[#0086C3] text-xs font-semibold hover:underline"
                        >
                          View
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-xl px-4 py-3 mb-2 bg-[rgba(0,134,195,0.06)] border border-[rgba(0,134,195,0.15)]">
              <p className="text-[11px] sm:text-[12px] text-[#0c1e3a] leading-relaxed">
                ℹ️ By submitting, you confirm that all information provided is
                accurate. The assigned doctor will review and issue the
                certificate.
              </p>
            </div>

            <ActionButtons
              onBack={handleBack}
              onSubmit={handleSubmit}
              submitting={isSubmitting}
              submitLabel="✅ Submit Request"
            />
          </StepCard>
        )}
      </div>
    </div>
  );
};

export default RequestCertificate;
