import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

import {
  getPublicDoctor,
  generateWalkInToken,
} from "../../../services/doctorService";

const WalkInBookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ticketRef = useRef();

  /* ================= STATE ================= */
  const [doctor, setDoctor] = useState({});
  const [tokenData, setTokenData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    reason: "",
  });

  /* ================= READ QR ================= */
  useEffect(() => {
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      toast.error("Invalid QR code");
      return;
    }

    setDoctor({ doctorId: Number(doctorId) });
  }, [searchParams]);

  /* ================= FETCH DOCTOR INFO ================= */
  useEffect(() => {
    if (!doctor?.doctorId) return;

    const fetchDoctor = async () => {
      try {
        const res = await getPublicDoctor(doctor.doctorId);
        setDoctor((p) => ({
          ...p,
          doctorName: res.data.doctorName,
        }));
      } catch {
        toast.error("Doctor not found");
      }
    };

    fetchDoctor();
  }, [doctor?.doctorId]);

  /* ================= FORM HANDLER ================= */
  const handleChange = (e) =>
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        doctorId: doctor.doctorId,
        name: form.name,
        phone: form.phone,
        reason: form.reason,
      };

      const res = await generateWalkInToken(payload);

      setTokenData(res.data);
      setForm({ name: "", phone: "", reason: "" });

      toast.success(`Token Generated: #${res.data.token}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Token generation failed");
    }
  };

  /* ================= PDF DOWNLOAD ================= */
  const downloadTicketPDF = async () => {
    const canvas = await html2canvas(ticketRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("portrait", "pt", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 20, 20, width - 40, height);
    pdf.save(`token_${tokenData.token}.pdf`);
  };

  /* ================= PRINT ================= */
  const printTicket = () => {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Token #${tokenData.token}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            .ticket {
              border: 2px dashed #0ea5a4;
              padding: 20px;
              width: 300px;
            }
            .big {
              font-size: 26px;
              font-weight: bold;
              color: #0f766e;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="big">Token #${tokenData.token}</div>
            <p>${doctor.doctorName}</p>
            <p>Patient: ${tokenData.name}</p>
            <p>Phone: ${tokenData.phone}</p>
            <p>Reason: ${tokenData.reason || "-"}</p>
            <p>Est. wait: ${tokenData.estimatedTime}</p>
          </div>
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-teal-600 text-center mb-4">
          Walk-In Appointment
        </h2>

        <div className="p-3 rounded border mb-4 bg-gray-50">
          <div className="font-medium">{doctor.doctorName}</div>
          <div className="text-sm text-gray-600">Clinic walk-in token</div>
        </div>

        {tokenData ? (
          <>
            <div ref={ticketRef} className="p-4 border rounded mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">
                  #{tokenData.token}
                </div>
                <div className="text-sm">{doctor.doctorName}</div>
                <div className="text-sm">
                  Est. wait: <strong>{tokenData.estimatedTime}</strong>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <div><strong>Name:</strong> {tokenData.name}</div>
                <div><strong>Phone:</strong> {tokenData.phone}</div>
                <div><strong>Reason:</strong> {tokenData.reason || "-"}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadTicketPDF}
                className="flex-1 py-2 bg-teal-500 text-white rounded"
              >
                Download PDF
              </button>
              <button
                onClick={printTicket}
                className="flex-1 py-2 border rounded"
              >
                Print
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Patient Name"
              required
              className="w-full border p-2 rounded"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Mobile Number"
              required
              className="w-full border p-2 rounded"
            />
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Reason (optional)"
              className="w-full border p-2 rounded"
            />
            <button className="w-full bg-teal-500 text-white py-2 rounded">
              Get Token
            </button>
          </form>
        )}

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-3 text-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default WalkInBookingPage;
