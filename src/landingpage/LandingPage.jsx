import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import landingImage from "../assets/images/landingimg.webp";
import labTesting from "../assets/images/labtesting.webp";
import medicineDelivery from "../assets/images/medicineDelhivery.webp";
import homeConsultation from "../assets/images/homeConsultation.webp";
import bloodDonor from "../assets/images/bloodDoner.webp";
import manualBooking from "../assets/images/manualbooking.webp";
import qrBooking from "../assets/images/qrbooking.webp";
import onlineBooking from "../assets/images/onlinebooking.webp";
import videoConsult from "../assets/images/videoconsult.webp";

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, lang } = useLanguage();
  const t = lang[language];

  // ✅ Already logged in → seedha dashboard
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const raw =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");

    if (token && raw) {
      try {
        const user = JSON.parse(raw);
        if (user.role === "ADMIN")        navigate("/admin/dashboard",   { replace: true });
        else if (user.role === "PATIENT") navigate("/client/dashboard",  { replace: true });
        else if (user.role === "DOCTOR")  navigate("/doctordashboard",   { replace: true });
      } catch {
        // corrupt data — ignore
      }
    }
  }, [navigate]);

  const services = [
    { img: manualBooking,    label: t.manualbooking,    link: "/clientloginpage" },
    { img: qrBooking,        label: t.Qrcode,           link: "/clientloginpage" },
    { img: onlineBooking,    label: t.onlinebooking,    link: "/clientloginpage" },
    { img: videoConsult,     label: t.Certificate,     link: "/clientloginpage" },
    { img: labTesting,       label: t.labTest,          link: "/lab-test" },
    { img: medicineDelivery, label: t.medicine,         link: "/medicine" },
    { img: homeConsultation, label: t.booknurse, link: "/home-service-booking" },
    { img: bloodDonor,       label: t.bloodDonor,       link: "/blood-donor" },
  ];

  return (
    <>
      <SEO
        title="Yo Doctor | Book Doctor Appointments Online"
        description="Book appointments with trusted doctors easily using our healthcare platform."
        keywords="doctor appointment, hospital, clinic booking"
        url="https://www.yodoctor.in/"
      />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col overflow-hidden "
        style={{ background: "linear-gradient(135deg,#060f1e 0%,#0c1e3a 45%,#0a3055 100%)" }}
      >
        {/* ── HERO INNER ── */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 px-6 sm:px-10 lg:px-20 pt-14 pb-8 flex-1  ">

          {/* LEFT */}
          <div className="w-full md:max-w-[560px] flex flex-col items-center md:items-start text-center md:text-left">

            {/* badge */}
            <div
              className=" mt-10 animate-[fadeUp_0.6s_cubic-bezier(0.22,1,0.36,1)_both] inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest"
              style={{
                background: "rgba(0,182,216,0.12)",
                border: "1px solid rgba(0,182,216,0.3)",
                color: "#5dd8f5",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-[pulseDot_2s_infinite]" />
              Your Official Doctor
            </div>

            {/* title */}
            <h1
              className="animate-[fadeUp_0.7s_0.08s_cubic-bezier(0.22,1,0.36,1)_both] font-[family-name:var(--font-playfair)] text-white font-extrabold leading-[1.08] mb-5"
              style={{ fontSize: "clamp(36px,4.5vw,64px)" }}
            >
              {t.heroTitleLine1}
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#00d4ff 0%,#2ecc71 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t.heroTitleLine2}
              </span>
            </h1>

            {/* subtitle */}
            <p
              className="animate-[fadeUp_0.7s_0.14s_cubic-bezier(0.22,1,0.36,1)_both] text-[17px] leading-relaxed mb-9"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {t.heroSubtitle}{" "}
              <strong className="font-semibold" style={{ color: "#5dd8f5" }}>
                Yo Doctor
              </strong>
              .
            </p>

            {/* CTA buttons */}
            <div className=" flex flex-wrap gap-3 justify-center md:justify-start">
              <button
                onClick={() => navigate("/clientloginpage")}
                className="px-9 py-3.5 rounded-full font-[family-name:var(--font-dm)] font-bold text-[15px] text-white bg-green-600 cursor-pointer transition-all duration-300 hover:-translate-y-1"
               
          
              >
                {t.forPatient}
              </button>

              <button
                onClick={() => navigate("/doctorloginpage")}
                className="px-9 py-3.5 rounded-full font-[family-name:var(--font-dm)] font-bold text-[15px] text-white cursor-pointer transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(93,216,245,0.45)",
                }}
                
              >
                {t.forDoctor}
              </button>
            </div>

       
          </div>

          <div className="hidden md:flex relative flex-shrink-0 w-[460px] h-[540px] animate-[fadeUp_1s_0.15s_cubic-bezier(0.22,1,0.36,1)_both] items-end justify-center">

            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
             
            />

            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] h-[60px] rounded-[50%] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse, rgba(0,212,255,0.18) 0%, transparent 70%)",
                
              }}
            />

            <img
              src={landingImage}
              loading="eager"
              fetchPriority="high"
              alt="Doctor"
              className="relative z-10 w-full h-full object-contain object-bottom"
              
            />

          </div>
        </div>

        {/* ── SERVICES GRID ── */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-20 pb-20">
          <div className="max-w-[1100px] mx-auto">

          <div className="animate-[fadeUp_0.8s_0.4s_cubic-bezier(0.22,1,0.36,1)_both] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 justify-items-center">
            {services.map((s, i) => (
              <Link
                key={i}
                to={s.link}
                className="group block w-full max-w-[240px] rounded-[18px] overflow-hidden no-underline transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.055)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
                  e.currentTarget.style.boxShadow = "0 18px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,212,255,0.15)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="overflow-hidden h-[130px]">
                  <img
                    src={s.img}
                    alt={s.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ filter: "brightness(0.82) saturate(0.85)" }}
                    loading="lazy"
                  />
                </div>
                <div
                  className="flex items-center justify-center text-center px-3.5 py-3.5 min-h-[52px] font-[family-name:var(--font-dm)] text-[13px] font-semibold leading-snug"
                  style={{ color: "rgba(255,255,255,0.88)" }}
                >
                  {s.label}
                </div>
              </Link>
            ))}
          </div>
          </div>
        </div>

        <style>{`
          @keyframes cardFloat {
            from { transform: translateY(0px); }
            to   { transform: translateY(-8px); }
          }
        `}</style>
      </section>
    </>
  );
};

export default LandingPage;