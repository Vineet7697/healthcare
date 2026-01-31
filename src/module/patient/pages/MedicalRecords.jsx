import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../utils/api";

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("All");
  const [preview, setPreview] = useState(null);

  /* ================= LOAD RECORDS ================= */
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get("/medicalRecords");
        setRecords(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecords();
  }, []);

  /* ================= UPLOAD ================= */
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newRecord = {
      id: Date.now(),
      name: file.name,
      type: "Lab Report",
      uploadedBy: "Patient",
      fileUrl: URL.createObjectURL(file),
      date: new Date().toLocaleDateString(),
    };

    try {
      await api.post("/medicalRecords", newRecord);
      setRecords((prev) => [newRecord, ...prev]);

      // also add to timeline
      await api.post("/healthTimeline", {
        id: Date.now(),
        type: "Medical Record",
        title: newRecord.name,
        date: newRecord.date,
      });

      toast.success("Medical record uploaded");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const filteredRecords =
    filter === "All"
      ? records
      : records.filter((r) => r.type === filter);

  return (
    <>
    <section className="min-h-screen bg-gray-50 py-10 px-4  bg-linear-to-b from-[#cfeeff] to-[#e9f8ff]">
    <div className="bg-white p-6 rounded-2xl shadow mt-20 max-w-5xl mx-auto ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          Medical Records
        </h2>

        <div className="flex gap-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className=" px-2 py-2 bg-gray-200 rounded-lg font-semibold"
          >
            <option value="All">All</option>
            <option value="Lab Report">Lab Reports</option>
            <option value="Prescription">Prescriptions</option>
            <option value="Scan">Scans</option>
            <option value="Other">Other</option>
          </select>

          <label className=" px-4 py-2 rounded-lg cursor-pointer bg-linear-to-br from-[#2277f7] to-[#52abd4] text-white font-bold">
            Upload
            <input type="file" hidden onChange={handleUpload} />
          </label>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <p className="text-gray-500">No medical records found.</p>
      ) : (
        <div className="space-y-6 gap-4 ">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className=" p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 shadow-sm hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-gray-700">{rec.name}</p>
                <p className="text-sm text-gray-500">
                  {rec.type} • {rec.date}
                </p>
                <p className="text-xs text-gray-400">
                  Uploaded by {rec.uploadedBy}
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <button
                  onClick={() => setPreview(rec)}
                  className="px-4 py-1 bg-gray-200 rounded-lg font-semibold "
                >
                  👁 Preview
                </button>

                <a
                  href={rec.fileUrl}
                  download={rec.name}
                  className="px-4 py-1 bg-green-600 text-white rounded-lg font-semibold"
                >
                   Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-white/30"
            onClick={() => setPreview(null)}
          />

          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl z-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">{preview.name}</h3>
              <button
                onClick={() => setPreview(null)}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {preview.fileUrl.endsWith(".pdf") ? (
              <iframe
                src={preview.fileUrl}
                title="preview"
                className="w-full h-125"
              />
            ) : (
              <img
                src={preview.fileUrl}
                alt="record"
                className="max-h-125 mx-auto"
              />
            )}
          </div>
        </div>
      )}
    </div>
    </section>
    </>
  );
};

export default MedicalRecords;
