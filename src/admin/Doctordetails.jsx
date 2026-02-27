import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaIdCard } from "react-icons/fa";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Doctordetails = () => {
    const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <button className="flex items-center gap-2 text-blue-500 font-semibold">
            <HiOutlineArrowLeft size={20} /> Back
          </button>
          <h1 className="text-lg font-bold text-gray-900">Doctor Profile</h1>
          <button className="text-gray-500 text-2xl">⋮</button>
        </div>
      </div>

      {/* Profile */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow p-8 flex flex-col items-center">
          <div className="relative">
            <div className="h-36 w-36 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 p-1">
              <div className="h-full w-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="https://i.pravatar.cc/300?img=12"
                  alt="doctor"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            </div>
            <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white" />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Dr. Julian Thorne
          </h2>
          <p className="text-blue-600 font-semibold">
            Senior Cardiologist
          </p>

          <span className="mt-3 px-4 py-1 rounded-full bg-orange-100 text-red-600 text-xs font-bold tracking-wide">
            PENDING VERIFICATION
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              Personal Information
            </h3>

            <Info label="Gender" value="Male" />
            <Info label="Degree" value="MBBS, MD Cardiology" />
            <Info label="License Number" value="LIC-998234-X" highlight />
            <Info label="Experience" value="12 Years" />
            <Info label="Languages" value="English, Spanish, French" />
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              Contact & ID Details
            </h3>

            <IconInfo icon={<FaEnvelope />} value="j.thorne@clinic.com" />
            <IconInfo icon={<FaPhoneAlt />} value="+1 (234) 567-890" />
            <IconInfo
              icon={<FaMapMarkerAlt />}
              value="42nd Heart Care Center, Silicon Valley, CA 94025"
            />
            <IconInfo icon={<FaIdCard />} value="PAN: BRTKP1234S" />
            <IconInfo icon={<FaIdCard />} value="Aadhaar: **** **** 8912" />
          </div>
        </div>

        {/* Action */}
        <div 
        onClick={()=>navigate("/admin/doctorsverification")}
        className="mt-10 flex justify-center">
          <button className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg transition">
            Verify Documents
          </button>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value, highlight }) => (
  <div className="flex justify-between py-2 border-b last:border-b-0">
    <span className="text-gray-500">{label}</span>
    <span className={`font-semibold ${highlight ? "text-blue-600" : ""}`}>
      {value}
    </span>
  </div>
);

const IconInfo = ({ icon, value }) => (
  <div className="flex items-start gap-3 py-2 border-b last:border-b-0 text-gray-700">
    <span className="text-blue-500 mt-1">{icon}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default Doctordetails;

