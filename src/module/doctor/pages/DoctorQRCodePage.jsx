import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { getMyQR } from "../../../services/doctorService";

const DoctorQRCodePage = () => {
  const [qrValue, setQrValue] = useState("");
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await getMyQR();
        setQrValue(res.data.qrUrl);
        setDoctorId(res.data.doctorId);
      } catch {
        alert("Doctor not approved or unauthorized");
      } finally {
        setLoading(false);
      }
    };
    fetchQR();
  }, []);

  const downloadQR = () => {
    const canvas = document.getElementById("doctor-qr");
    if (!canvas || !doctorId) return;

    const pngUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `doctor-${doctorId}-qr.png`;
    a.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-6 rounded-xl shadow text-center">
        <h2 className="text-xl font-semibold text-teal-600 mb-3">
          Clinic Walk-In QR
        </h2>

        {loading ? (
          <p>Loading QR...</p>
        ) : (
          <div className="flex justify-center mb-4">
            <QRCodeCanvas
              id="doctor-qr"
              value={qrValue}
              size={320}
              level="H"
              includeMargin
            />
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Scan this QR to book appointment
        </p>

        <button
          onClick={downloadQR}
          disabled={!qrValue}
          className="bg-teal-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Download QR
        </button>
      </div>
    </div>
  );
};

export default DoctorQRCodePage;
