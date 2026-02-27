import React, { useState } from "react";
import { FiMail, FiEye, FiCheck, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminDoctorVerification = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [note, setNote] = useState("");
  const [actionConfirm, setActionConfirm] = useState(null); 
  // { id, status } ya null

  const [docs, setDocs] = useState([
    {
      id: 1,
      title: "Medical License",
      date: "Oct 12, 2023",
      status: "VERIFIED",
      icon: "license",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 2,
      title: "Identity Proof",
      date: "Oct 14, 2023",
      status: "PENDING",
      icon: "fingerprint",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 3,
      title: "Degree Certificate",
      date: "Oct 14, 2023",
      status: "PENDING",
      icon: "degree",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  ]);

  const navigate = useNavigate();

  const updateStatus = (id, status) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  const handleSubmitAll = () => {
    console.log("Final statuses:", docs);
    console.log("Admin note:", note);

    setConfirmOpen(false);
    navigate("/admin/doctors");
  };

  const handleConfirmAction = () => {
    if (!actionConfirm) return;
    updateStatus(actionConfirm.id, actionConfirm.status);
    setActionConfirm(null);
  };

  return (
    <div className="min-h-screen bg-[#faf7f5] p-6">
      {/* Doctor Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="doctor"
              className="h-16 w-16 rounded-full object-cover"
            />
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white" />
          </div>

          <div>
            <h2 className="text-xl font-bold">Dr. Julian Thorne</h2>
            <div className="flex gap-3 text-sm text-gray-500 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                Cardiologist
              </span>
              <span>ID: #VET-9920</span>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 border rounded-lg px-4 py-2 text-sm hover:bg-gray-50">
          <FiMail />
          Contact Doctor
        </button>
      </div>

      {/* Required Documents */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Required Documents</h3>
        <span className="text-sm text-gray-500">{docs.length} Total Files</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {docs.map((doc) => (
          <DocCard
            key={doc.id}
            {...doc}
            onApprove={() => setActionConfirm({ id: doc.id, status: "VERIFIED" })}
            onReject={() => setActionConfirm({ id: doc.id, status: "REJECTED" })}
          />
        ))}
      </div>

      {/* Notes */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2">📝 Notes for Doctor</h4>
        <textarea
          rows={4}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Provide details if any document is rejected..."
          className="w-full rounded-xl border p-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <p className="text-xs text-gray-400 text-right mt-1">
          {note.length}/500 characters
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/admin/doctors")}
          className="px-5 py-2 rounded-lg border hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => setConfirmOpen(true)}
          className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
        >
          Submit All Verifications →
        </button>
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Submit Verification?"
          description="Are you sure you want to submit all document verifications? This action cannot be undone."
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleSubmitAll}
        />
      )}

      {actionConfirm && (
        <ConfirmModal
          title={
            actionConfirm.status === "VERIFIED"
              ? "Approve Document?"
              : "Reject Document?"
          }
          description={
            actionConfirm.status === "VERIFIED"
              ? "Are you sure you want to approve this document?"
              : "Are you sure you want to reject this document?"
          }
          onCancel={() => setActionConfirm(null)}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
};

export default AdminDoctorVerification;

/* ================= DOCUMENT CARD ================= */

const DocCard = ({ title, date, status, icon, fileUrl, onApprove, onReject }) => {
  const isVerified = status === "VERIFIED";
  const isRejected = status === "REJECTED";

  const handleViewFile = () => {
    if (!fileUrl) return alert("File not available");
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-2xl p-5 border shadow-sm bg-white">
      <div className="flex justify-between items-center mb-3">
        <Icon icon={icon} />
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isVerified
              ? "bg-green-100 text-green-700"
              : isRejected
              ? "bg-red-100 text-red-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {isVerified ? "VERIFIED" : isRejected ? "REJECTED" : "PENDING REVIEW"}
        </span>
      </div>

      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-500 mb-6">Uploaded: {date}</p>

      <button
        onClick={handleViewFile}
        className="flex items-center gap-2 text-sm text-blue-600 mb-3 hover:underline"
      >
        <FiEye /> View File
      </button>

      {status === "PENDING" && (
        <div className="flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 text-white py-2 text-sm hover:bg-green-700"
          >
            <FiCheck /> Approve
          </button>
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-500 text-red-600 py-2 text-sm hover:bg-red-50"
          >
            <FiX /> Reject
          </button>
        </div>
      )}
    </div>
  );
};

/* ================= ICON ================= */

const Icon = ({ icon }) => {
  const map = {
    license: "📄",
    fingerprint: "🆔",
    degree: "🎓",
  };

  return (
    <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
      {map[icon] || "📁"}
    </div>
  );
};

/* ================= CONFIRM MODAL (Reusable) ================= */

const ConfirmModal = ({ title, description, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            Yes, Confirm
          </button>
        </div>
      </div>
    </div>
  );
};