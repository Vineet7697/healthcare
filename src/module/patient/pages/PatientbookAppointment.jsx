import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import QrScanner from "qr-scanner";
import Typewriter from "typewriter-effect";
import { useNavigate } from "react-router-dom";
import { getCities, getDiseases } from "../../../services/patientService";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaUserMd,
  FaShoppingCart,
  FaFileMedical,
  FaFlask,
  FaBriefcase,
  FaQrcode,
  FaBaby,
  FaHeartbeat,
  FaBrain,
} from "react-icons/fa";
import { GiTooth } from "react-icons/gi";

// 👇 ADD THIS ABOVE PatientbookAppointment component
function extractDoctorId(scannedData) {
  if (!scannedData) return null;

  const cleanData = scannedData.trim();

  try {
    // Absolute URL
    const url = new URL(cleanData);
    return url.searchParams.get("doctorId");
  } catch {
    // Relative URL fallback
    try {
      const url = new URL(cleanData, window.location.origin);
      return url.searchParams.get("doctorId");
    } catch {
      return null;
    }
  }
}

const PatientbookAppointment = () => {
  const webcamRef = useRef(null);
  const qrScannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [datas, setDatas] = useState("");

  const [cityQuery, setCityQuery] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cities, setCities] = useState([]);

  const [diseaseQuery, setDiseaseQuery] = useState("");
  const [showDiseaseDropdown, setShowDiseaseDropdown] = useState(false);
  const [diseases, setDiseases] = useState([]);

  const navigate = useNavigate();
  const locationRef = useRef();
  const diseaseRef = useRef();

  /* ================= LOAD CITIES & DISEASES ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const cityRes = await getCities();
        const diseaseRes = await getDiseases();

        console.log("Cities 👉", cityRes.data);
        console.log("Diseases 👉", diseaseRes.data);

        setCities(Array.isArray(cityRes.data) ? cityRes.data : []);
        setDiseases(Array.isArray(diseaseRes.data) ? diseaseRes.data : []);
      } catch (error) {
        console.error("Failed to load cities/diseases", error);
      }
    };

    loadData();
  }, []);

  /* ================= DROPDOWN CLOSE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
      if (diseaseRef.current && !diseaseRef.current.contains(e.target)) {
        setShowDiseaseDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = cities.filter((c) =>
    c.name?.toLowerCase().includes(cityQuery.toLowerCase()),
  );

  const filteredDiseases = diseases.filter((d) =>
    d.name?.toLowerCase().includes(diseaseQuery.toLowerCase()),
  );

  /* ================= HANDLERS ================= */
  const handleCitySelect = (city) => {
    setCityQuery(city.name);
    setShowCityDropdown(false);
  };

  const handleDiseaseSelect = (disease) => {
    setDiseaseQuery(disease.name);
    setShowDiseaseDropdown(false);
  };

  const handleSearch = () => {
    navigate(
      `/client/cards?city=${encodeURIComponent(
        cityQuery,
      )}&search=${encodeURIComponent(diseaseQuery)}`,
    );
  };

  /* ================= QR SCAN ================= */
  useEffect(() => {
    if (!scanning) return;
    if (qrScannerRef.current) return;

    const video = webcamRef.current?.video;
    if (!video) return;

    const scanner = new QrScanner(
      video,
      (result) => {

        scanner.stop();
        qrScannerRef.current = null;
        setScanning(false);

        setDatas(result.data);

        const doctorId = extractDoctorId(result.data);
        if (!doctorId) {
          alert("Invalid QR code");
          return;
        }

        navigate(`/client/bookappointmentpage/${doctorId}`);
      },
      { returnDetailedScanResult: true },
    );

    qrScannerRef.current = scanner;
    scanner.start();

    return () => {
      scanner.stop();
      qrScannerRef.current = null;
    };
  }, [scanning, navigate]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });

      const doctorId = extractDoctorId(result.data);
      setDatas(result.data);
      if (!doctorId) {
        alert("Invalid QR code");
        return;
      }

      navigate(`/client/bookappointmentpage/${doctorId}`);
    } catch (err) {
      alert("Invalid QR code");
    }
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative z-0 w-full min-h-screen  flex flex-col items-center justify-center text-white overflow-hidden px-4 sm:px-6 lg:px-12 bg-linear-to-b from-[#cfeeff] to-[#e9f8ff]">
        <div
          className="absolute inset-0 w-full  bg-cover bg-center z-[-1] "
          style={{ backgroundImage: "url(/images/hero.png)" }}
        ></div>

        <div className="text-center space-y-6 w-full max-w-4xl ">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Your Doctor Your health
          </h1>

          <h5 className="text-2xl sm:text-3xl lg:text-5xl font-bold flex justify-center items-center gap-2">
            Search For,
            <span className="text-red-600">
              <Typewriter
                options={{
                  strings: ["Clinics", "Doctors", "Diseases"],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                  deleteSpeed: 50,
                }}
              />
            </span>
          </h5>

          {/* ================= SEARCH ================= */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-0.5 mt-6">
            <div ref={locationRef} className="relative w-full sm:w-68">
              <div className="flex items-center bg-white text-black px-4 py-2 rounded-lg  outline-none">
                <FaMapMarkerAlt className="mr-2 text-blue-600" />
                <input
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  onFocus={() => setShowCityDropdown(true)}
                  placeholder="Location"
                  className="outline-none bg-transparent w-full"
                />
              </div>

              {showCityDropdown && (
                <ul className="absolute w-full bg-white border mt-1 shadow z-20 max-h-40 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => (
                      <li
                        key={city.id || city.name || index}
                        onClick={() => handleCitySelect(city)}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-black"
                      >
                        {city.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No results found
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div className="flex w-full sm:w-auto">
              <div ref={diseaseRef} className="relative w-full sm:w-64 ">
                <div className="flex items-center bg-white text-black px-4 py-2 rounded-l-lg ">
                  <FaSearch className="mr-2 text-blue-600" />
                  <input
                    value={diseaseQuery}
                    onChange={(e) => setDiseaseQuery(e.target.value)}
                    onFocus={() => setShowDiseaseDropdown(true)}
                    placeholder="Search diseases, doctors, clinics..."
                    className="outline-none bg-transparent w-full"
                  />
                </div>

                {showDiseaseDropdown && (
                  <ul className="absolute w-full bg-white border mt-1 shadow z-20 max-h-40 overflow-y-auto">
                    {filteredDiseases.length > 0 ? (
                      filteredDiseases.map((disease, index) => (
                        <li
                          key={disease.id || disease.name || index}
                          onClick={() => handleDiseaseSelect(disease)}
                          className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-black"
                        >
                          {disease.name}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">
                        No results found
                      </li>
                    )}
                  </ul>
                )}
              </div>

              <div className="flex items-center bg-green-700 px-4 py-2 rounded-r-lg">
                <button
                  className="text-white font-semibold cursor-pointer"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* ================= QR ================= */}
          <div className="flex flex-col items-center justify-center text-center gap-3 py-6">
            <p className="text-gray-100 font-semibold text-xl sm:text-3xl">
              OR
            </p>
            <h2 className="text-base sm:text-lg font-bold">Scan any QR code</h2>

            <div
              onClick={() => {
                if (!scanning) setScanning(true);
              }}
              className="flex items-center justify-center p-4 bg-gray-100 rounded-full w-16 h-16 shadow-md hover:scale-105 transition cursor-pointer"
            >
              <FaQrcode size={40} color="green" />
            </div>

            {scanning && (
              <div className="mt-2 bg-white p-4 rounded-xl shadow-lg flex flex-col items-center gap-3">
                <Webcam
                  ref={webcamRef}
                  videoConstraints={{ facingMode: "environment" }}
                  className="rounded-lg w-72 h-72 object-cover"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setScanning(false)}
                    className="px-4 py-1.5 bg-red-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded-lg"
                  >
                    Upload from Gallery
                  </button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {datas && (
              <p className="text-green-600 mt-3 font-semibold break-all">
                ✅ QR Code: {datas}
              </p>
            )}
          </div>

          {/* ================= POPULAR ================= */}
          {/* ================= POPULAR ================= */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-white text-sm md:text-base mt-4">
            <span className="font-semibold text-gray-200">
              Trending Specialities:
            </span>
            <FaBrain /> Neurologist |
            <FaHeartbeat /> Cardiologist |
            <FaBaby /> Child Specialist |
            <GiTooth /> Dental Care
          </div>
        </div>
      </section>

      {/* ================= SECURITY ================= */}

      <section className="bg-[#f5f6fa] py-16 px-6 md:px-20 min-h-screen">
        <div className="flex flex-col md:flex-row justify-around items-center gap-10">
          <div className="text-center md:text-left max-w-lg">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 leading-snug">
              Your privacy and safety
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              is always our priority.
            </h2>

            <ul className="space-y-3 text-gray-600 mb-8">
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-green-500 text-lg">✔</span>
                Advanced data encryption & secure access
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-green-500 text-lg">✔</span>
                Trusted by doctors & healthcare partners
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-green-500 text-lg">✔</span>
                Compliant with global healthcare standards
              </li>
            </ul>

            <button className="bg-green-500 text-white px-6 py-2 rounded font-medium hover:bg-green-600 cursor-pointer">
              Learn how we protect you
            </button>
          </div>

          <div className="flex justify-center md:w-1/2">
            <img
              src="/images/security-healthcare.png"
              alt="Healthcare Security Illustration"
              className="w-64 sm:w-80 md:w-96"
            />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap justify-center items-center gap-10 text-center">
          {[
            { src: "/images/secure-server.png", text: "Secure Cloud Servers" },
            {
              src: "/images/trusted-doctors.png",
              text: "Verified Medical Experts",
            },
            {
              src: "/images/privacy-shield.png",
              text: "Strong Privacy Protection",
            },
            { src: "/images/support.png", text: "24×7 Customer Support" },
          ].map((item, i) => (
            <div key={i}>
              <img
                src={item.src}
                alt={item.text}
                className="mx-auto w-12 h-12 sm:w-14 sm:h-14 mb-2"
              />
              <p className="text-gray-800 text-sm font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default PatientbookAppointment;
