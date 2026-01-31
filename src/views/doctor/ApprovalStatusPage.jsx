import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; // ✅ axios instance

const ApprovalStatusPage = () => {
  const [status, setStatus] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        // 🔹 logged-in doctor
        const doctor = JSON.parse(localStorage.getItem("loggedInDoctor"));

        if (!doctor?.doctorId) return;

        const res = await api.get("/doctors", {
          params: { doctorId: doctor.doctorId },
        });

        if (res.data.length > 0) {
          setStatus(res.data[0].status || "pending");

          // auto redirect if approved
          if (res.data[0].status === "approved") {
            setTimeout(() => {
              navigate("/doctordashboard");
            }, 2000);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchApprovalStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white to-blue-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center relative">
        {/* Header */}
        <div className="absolute top-4 left-6 text-teal-500 font-bold text-lg">
          Yo Doctor
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-8 mt-6">
          Admin Approval Status
        </h1>

        {/* Pending */}
        {status === "pending" && (
          <div>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 mb-6">
              Your registration is under review by the admin team.
            </p>
          </div>
        )}

        {/* Approved */}
        {status === "approved" && (
          <div>
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-700 mb-6">
              Your clinic has been approved! Redirecting to your Doctor
              Dashboard...
            </p>
          </div>
        )}

        {/* Rejected */}
        {status === "rejected" && (
          <div>
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-gray-700 mb-6">
              Your registration was not approved. Please contact support for
              assistance.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => navigate("/doctorloginpage")}
            className="text-teal-600 hover:text-teal-700 font-medium transition"
          >
            Back to Home
          </button>
          <button className="text-gray-500 hover:text-teal-500 font-medium transition">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalStatusPage;
