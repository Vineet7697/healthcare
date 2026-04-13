import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchVisitDoctors } from "../../../services/patientService";
import { notify } from "../../../utils/notify";
const BASE_URL = import.meta.env.VITE_API_URL || "";

const getImageUrl = (imagePath) => {
  if (!imagePath)
    return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${BASE_URL}/${imagePath}`.replace(/([^:])\/\//g, "$1/");
};

export default function Cards() {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("city") || "";
    const search = params.get("search") || "";

    const loadDoctors = async () => {
      setLoading(true);
      try {
        const res = await searchVisitDoctors({ city, search });
        const data = res.data.data?.doctors || [];
        setDoctors(data);
      } catch (err) {
        console.error("Doctor fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [location.search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0086C3] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-[family-name:var(--font-dm)]">
            Finding doctors...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8"
      style={{ background: "#f0f4f8" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-baseline justify-between mb-6 animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
          <h1 className="font-[family-name:var(--font-playfair)] text-[22px] font-extrabold text-[#0c1e3a]">
            Find Your Doctor
          </h1>
          {doctors.length > 0 && (
            <span
              className="text-[13px] font-semibold px-3 py-1 rounded-full"
              style={{ color: "#0086C3", background: "rgba(0,134,195,0.1)" }}
            >
              {doctors.length} available
            </span>
          )}
        </div>

        {doctors.length > 0 ? (
          <div className="flex flex-col gap-3.5">
            {doctors.map((doctor, idx) => (
              <div
                key={doctor.doctorId}
                className="bg-white rounded-2xl px-5 py-4 flex items-center gap-5 transition-all duration-250 hover:-translate-y-[3px] relative overflow-hidden group"
                style={{
                  boxShadow: "0 2px 12px rgba(12,30,58,0.07)",
                  border: "1px solid rgba(12,30,58,0.06)",
                  animation: `fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) ${idx * 0.06}s both`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(12,30,58,0.12)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 2px 12px rgba(12,30,58,0.07)")
                }
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-250"
                  style={{
                    background: "linear-gradient(180deg,#0086C3,#2ecc71)",
                  }}
                />

                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="relative">
                    <img
                      src={getImageUrl(doctor.profile_image)}
                      alt={doctor.doctorName}
                      className="w-[72px] h-[72px] rounded-2xl object-cover"
                      style={{ border: "2px solid rgba(0,134,195,0.15)" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                      }}
                    />
                    <span
                      className="absolute bottom-1 right-1 w-[11px] h-[11px] rounded-full bg-emerald-400"
                      style={{ border: "2px solid #fff" }}
                    />
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/client/doctor-profile/${doctor.doctorId}`, {
                        state: { doctor },
                      })
                    }
                    className="font-[family-name:var(--font-dm)] font-bold text-[11px] px-3 py-1 rounded-full cursor-pointer transition-all duration-250 hover:bg-[rgba(0,134,195,0.07)] whitespace-nowrap w-full text-center"
                    style={{
                      color: "#0086C3",
                      background: "transparent",
                      border: "1.5px solid rgba(0,134,195,0.35)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#0086C3")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(0,134,195,0.35)")
                    }
                  >
                    View Profile
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h2 className="font-[family-name:var(--font-playfair)] text-[16px] font-bold text-[#0c1e3a] truncate">
                      {doctor.doctorName}
                    </h2>
                    {doctor.rating && (
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ color: "#b45309", background: "#fef3c7" }}
                      >
                        ⭐ {doctor.rating}
                      </span>
                    )}
                  </div>

                  <p
                    className="font-[family-name:var(--font-dm)] text-[13px] font-semibold mb-2"
                    style={{ color: "#0086C3" }}
                  >
                    {doctor.specialization}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {doctor.clinicName && (
                      <span
                        className="font-[family-name:var(--font-dm)] text-[12px] font-medium px-2.5 py-0.5 rounded-full"
                        style={{ color: "#4b5e7a", background: "#f0f4f8" }}
                      >
                        🏥 {doctor.clinicName}
                      </span>
                    )}
                    <span
                      className="font-[family-name:var(--font-dm)] text-[12px] font-medium px-2.5 py-0.5 rounded-full"
                      style={{ color: "#4b5e7a", background: "#f0f4f8" }}
                    >
                      📍 {doctor.city}
                    </span>
                    {doctor.experience && (
                      <span
                        className="font-[family-name:var(--font-dm)] text-[12px] font-medium px-2.5 py-0.5 rounded-full"
                        style={{ color: "#4b5e7a", background: "#f0f4f8" }}
                      >
                        🩺 {doctor.experience} yrs
                      </span>
                    )}
                  </div>

                  {doctor.consultationFee && (
                    <p
                      className="font-[family-name:var(--font-dm)] text-[12px]"
                      style={{ color: "#64748b" }}
                    >
                      Consultation Fee —{" "}
                      <strong className="text-[#0c1e3a] font-bold">
                        ₹{doctor.consultationFee}
                      </strong>
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() =>
                      navigate(
                        `/client/bookappointmentpage/${doctor.doctorId}`,
                        {
                          state: { doctor },
                        },
                      )
                    }
                    className="font-[family-name:var(--font-dm)] font-bold text-[13px] text-white px-5 py-2.5 rounded-full cursor-pointer transition-all duration-250 hover:-translate-y-0.5 whitespace-nowrap"
                    style={{
                      background: "linear-gradient(135deg,#0086C3,#00b4d8)",
                      boxShadow: "0 4px 14px rgba(0,134,195,0.35)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0,134,195,0.5)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 4px 14px rgba(0,134,195,0.35)")
                    }
                  >
                    📅 Book Appointment
                  </button>
                  <button
                    onClick={() => {
                      if (doctor.phone) {
                        const phone = doctor.phone.replace(/\D/g, "");
                        window.open(`tel:${phone}`, "_self");
                      } else {
                        notify("Doctor's phone number is not available");
                      }
                    }}
                    className="font-[family-name:var(--font-dm)] font-bold text-[13px] px-5 py-2.5 rounded-full cursor-pointer transition-all duration-250 whitespace-nowrap"
                    style={{
                      color: "#fff",
                      background: "linear-gradient(135deg,#2ecc71,#1aab5a)",
                      boxShadow: "0 4px 14px rgba(46,204,113,0.35)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(46,204,113,0.5)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 4px 14px rgba(46,204,113,0.35)")
                    }
                  >
                    📞 Call Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-[family-name:var(--font-playfair)] text-[18px] font-bold text-[#0c1e3a] mb-1">
              No doctors found
            </p>
            <p
              className="font-[family-name:var(--font-dm)] text-[14px]"
              style={{ color: "#94a3b8" }}
            >
              Try a different city or specialty
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
