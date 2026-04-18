import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchVisitDoctors } from "../../../services/patientService";
import { validateStep } from "../../../controllers/FormValidation";
import { notify } from "../../../utils/notify";
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

const RequestCertificate = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passedDoctor = state?.doctor || null;

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
    idProof: null,
    medicalReports: null,
    prescription: null,
  });

  const DOC_FIELDS = [
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

    const validationErrors = validateStep(currentStep, formData, validateFile);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (passedDoctor && doctors.length > 0) {
      const matchedDoctor = doctors.find(
        (doc) => doc.doctorId === passedDoctor.doctorId,
      );

      if (matchedDoctor) {
        setDoctor(matchedDoctor);
      } else {
        // fallback: agar list mein match na mile
        setDoctor(passedDoctor);
      }
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
    } catch (error) {
      console.error(
        "Error fetching doctors:",
        error.response?.data || error.message,
      );
    }
  };

  const validateFile = (file) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, JPG, and PNG files are allowed.";
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB.";
    }

    return null;
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
      return;
    }

    setDocuments((prev) => ({
      ...prev,
      [field]: file,
    }));

    // Clear previous error
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

const handleSubmit = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  console.log("Submit button clicked");

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

    // Step 1: Create Request
    const payload = {
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
    };

    const res = await createRequest(payload);
    console.log("✅ Request Created:", res.data);

    const requestId = res.data.requestId;

    // Step 2: Upload Documents (Only if files exist)
    const hasDocuments = Object.values(documents).some(
      (file) => file !== null
    );

    if (hasDocuments) {
      const docData = new FormData();
      docData.append("request_id", requestId);

      Object.values(documents).forEach((file) => {
        if (file) {
          docData.append("documents", file);
        }
      });

      console.log("📤 Uploading Documents...");
      const uploadRes = await uploadDocuments(docData);
      console.log("📄 Upload Response:", uploadRes.data);
    }

    // Step 3: Success Notification
    notify.success("Certificate request submitted successfully!");
    console.log("🎉 Success Notification Triggered");

    // Step 4: Navigation
    navigate("/client/mycertificate", { state: { success: true } });
    console.log("➡️ Navigation Triggered");
  } catch (error) {
    console.error("❌ Submission Error:", error);
    notify.error(
      error.response?.data?.message || "Failed to submit request."
    );
  } finally {
    setIsSubmitting(false);
  }
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
          <label className="block text-[12px] font-semibold uppercase tracking-widest text-slate-500">
            {label} {required && <span className="text-red-500">*</span>}
          </label>

          {file && (
            <button
              onClick={() => onDelete(field)}
              className="text-xs font-semibold text-red-500 hover:underline"
            >
              Remove
            </button>
          )}
        </div>

        {!file ? (
          <label className="flex items-center gap-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              📤
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Click to upload
              </p>
              <p className="text-xs text-slate-400">{hint}</p>
            </div>
            <input
              type="file"
              accept={accept}
              onChange={(e) => onUpload(e, field)}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-center gap-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4">
            {isImage ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                📄
              </div>
            )}

            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-800 truncate">
                {file.name}
              </p>
              <p className="text-xs text-emerald-600">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>

            <button
              onClick={() => window.open(URL.createObjectURL(file))}
              className="text-blue-600 text-xs font-semibold hover:underline"
            >
              View
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
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
              <StyledSelect
                value={doctor?.doctorId || ""}
                onChange={(e) => {
                  const selected = doctors.find(
                    (doc) => doc.doctorId === Number(e.target.value),
                  );
                  setDoctor(selected);
                  setErrors((prev) => ({ ...prev, doctor: "" }));
                }}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.doctorId} value={doc.doctorId}>
                    {doc.doctorName} — {doc.specialization}
                  </option>
                ))}
              </StyledSelect>

              {errors.doctor && (
                <p className="text-red-500 text-xs mt-1">{errors.doctor}</p>
              )}
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
                  setErrors((prev) => ({ ...prev, purpose: "" }));
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
                <option value="Legal/ Court">Legal/ Court</option>
                <option value="Other">Other</option>
              </StyledSelect>

              {errors.purpose && (
                <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>
              )}
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
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </FieldBox>

              <FieldBox label="Date of Birth">
                <StyledInput
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                )}
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
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                )}
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
                {errors.height && (
                  <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                )}
              </FieldBox>
              <FieldBox label="⚖️ Weight (kg)">
                <StyledInput
                  type="number"
                  placeholder="e.g. 65"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
                {errors.weight && (
                  <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
                )}
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
            <h2 className="text-[17px] font-bold text-[#0c1e3a] mb-4">
              Step 3 — Upload Documents
            </h2>

            <div className="space-y-4">
              {DOC_FIELDS.map((doc) => (
                <FileUploadCard
                  key={doc.field}
                  {...doc}
                  file={documents[doc.field]}
                  error={errors[doc.field]}
                  onUpload={handleFileChange}
                  onDelete={(field) =>
                    setDocuments((prev) => ({
                      ...prev,
                      [field]: null,
                    }))
                  }
                />
              ))}
            </div>

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

            {/* Uploaded Documents */}
            {Object.values(documents).some((doc) => doc) && (
              <div className="mb-5">
                <h3 className="text-[15px] font-bold text-[#0c1e3a] mb-3">
                  📄 Uploaded Documents
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(documents).map(([key, file]) => {
                    if (!file) return null;

                    const isImage = file.type?.startsWith("image/");
                    const labels = {
                      idProof: "ID Proof",
                      medicalReports: "Medical Reports",
                      prescription: "Prescription",
                    };

                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-black/[0.05] bg-[#f8fafc] p-3"
                      >
                        <p className="text-xs font-semibold text-slate-400 mb-2">
                          {labels[key]}
                        </p>

                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={labels[key]}
                            className="w-full h-24 object-cover rounded-lg mb-2"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-24 rounded-lg bg-blue-100 mb-2">
                            📄 PDF Document
                          </div>
                        )}

                        <button
                          onClick={() => window.open(URL.createObjectURL(file))}
                          className="text-blue-600 text-xs font-semibold hover:underline"
                        >
                          View Document
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                disabled={isSubmitting}
                className={`font-bold text-[14px] text-white px-8 py-2.5 rounded-xl
    ${
      isSubmitting
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-br from-[#0086C3] to-[#00b4d8] hover:-translate-y-0.5"
    }
  `}
              >
                {isSubmitting ? "Submitting..." : "✅ Submit Request"}
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
