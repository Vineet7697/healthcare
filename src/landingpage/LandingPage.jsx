import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import landingImage from "../assets/images/landingimg.webp";
import labTesting from "../assets/images/lab-test.png";
import medicineDelivery from "../assets/images/medicine_delivery.png";
import homecareservices from "../assets/images/home_care_services.png";
import qrBooking from "../assets/images/qr-booking.png";
import onlineBooking from "../assets/images/online-booking.png";
import certificate from "../assets/images/certificate.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const { language, lang } = useLanguage();
  const t = lang[language];

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const raw =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");

    if (token && raw) {
      try {
        const user = JSON.parse(raw);
        if (user.role === "ADMIN")
          navigate("/admin/dashboard", { replace: true });
        else if (user.role === "PATIENT")
          navigate("/client/dashboard", { replace: true });
        else if (user.role === "DOCTOR")
          navigate("/doctordashboard", { replace: true });
      } catch {
        // corrupt data — ignore
      }
    }
  }, [navigate]);
  const heroCards = [
    
    {
      img: medicineDelivery,
      label: t.medicine || "24/7 Medicines",
      sub: "Essentials at your doorstep",
      link: "/medicine",
      tagBg: "bg-amber-500",
      tag: "24 / 7",
      accentColor: "#f5a623",
    },
    {
      img: labTesting,
      label: t.labTest || "Lab Tests",
      sub: "Sample Pickup at Your Door",
      link: "/lab-test",
      tagBg: "bg-sky-500",
      tag: "HOME",
      accentColor: "#0099ee",
    },
    {
      img: qrBooking,
      label: t.Qrcode || "QR Booking",
      sub: "Scan & Book Instantly",
      link: "/clientloginpage?redirect=/client/book-appointment?autoScan=true",
      tag: "FAST",
      tagBg: "bg-cyan-500",
      accentColor: "#00D4FF",
    },
    {
      img: onlineBooking,
      label: t.onlinebooking || "Online Booking",
      sub: "Book from anywhere",
      link: "/clientloginpage?redirect=/client/book-appointment",
      tag: "ONLINE",
      tagBg: "bg-indigo-500",
      accentColor: "#6366F1",
    },
    {
      img: certificate,
      label: t.Certificate || "Video Consult",
      sub: "Consult from home",
      link: "/clientloginpage?redirect=/client/apply-certificate",
      tag: "VIDEO",
      tagBg: "bg-pink-500",
      accentColor: "#ec4899",
    },
    {
      img: homecareservices,
      label: t.booknurse || "Book Nurse",
      sub: "Care at your home",
      link: "/home-service-booking",
      tag: "HOME CARE",
      tagBg: "bg-green-500",
      accentColor: "#22c55e",
    },
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
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#060f1e 0%,#0c1e3a 45%,#0a3055 100%)",
        }}
      >
        {/* ── HERO INNER ── */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 px-6 sm:px-10 lg:px-20 pt-14 pb-8 flex-1">
          {/* LEFT */}
          <div className="w-full md:max-w-[560px] flex flex-col items-center md:items-start text-center md:text-left">
            {/* badge */}
            <div
              className="mt-10 animate-[fadeUp_0.6s_cubic-bezier(0.22,1,0.36,1)_both] inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest"
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
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
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

          {/* RIGHT — doctor image */}
          <div className="hidden md:flex relative flex-shrink-0 w-[460px] h-[540px] animate-[fadeUp_1s_0.15s_cubic-bezier(0.22,1,0.36,1)_both] items-end justify-center">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full pointer-events-none" />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] h-[60px] rounded-[50%] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(0,212,255,0.18) 0%, transparent 70%)",
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

        {/* ── SERVICES SECTION ── */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-20 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* <div className="animate-[fadeUp_0.8s_0.4s_cubic-bezier(0.22,1,0.36,1)_both] grid grid-cols-1 sm:grid-cols-3 gap-10 mb-5">
              {heroCards.map((card, i) => (
                <Link
                  key={i}
                  to={card.link}
                  className="group relative block rounded-[22px] overflow-hidden no-underline transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                  style={{
                    aspectRatio: "3/4",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 28px 64px rgba(0,0,0,0.55), 0 0 0 1px ${card.accentColor}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                 
                  <img
                    src={card.img}
                    alt={card.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ filter: "brightness(0.6) saturate(0.8)" }}
                    loading="lazy"
                  />

                
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(4,8,15,0.95) 0%, rgba(4,8,15,0.45) 45%, transparent 100%)",
                    }}
                  />

                 
                  <span
                    className={`absolute top-4 right-4 z-10 ${card.tagBg} text-white text-[10px] font-bold tracking-[0.16em] px-3 py-1 rounded-full`}
                  >
                    {card.tag}
                  </span>

                 
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
                    <p
                      className="text-white font-extrabold leading-tight mb-2"
                      style={{ fontSize: "clamp(20px,2.2vw,28px)" }}
                    >
                      {card.label}
                    </p>
                    <p
                      className="text-[13px] font-medium mb-5"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {card.sub}
                    </p>
                    <span
                      className="inline-flex items-center justify-center w-11 h-11 rounded-full transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      style={{
                        border: `1.5px solid ${card.accentColor}66`,
                        background: `${card.accentColor}18`,
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={card.accentColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div> */}

            <div className=" md:grid-cols-3  grid grid-cols-1 sm:grid-cols-2 gap-10 mb-5">
              {heroCards.map((card, i) => (
                <Link
                  key={i}
                  to={card.link}
                  className="group relative rounded-[28px] p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  style={{
                    background: card.accentColor,
                    minHeight: "380px",
                  }}
                >
                  {/* TEXT */}
                  <div>
                    <h2 className="text-white font-bold text-[28px] leading-tight mb-2">
                      {card.label}
                    </h2>

                    {card.sub && (
                      <p className="text-white/80 text-[14px]">{card.sub}</p>
                    )}
                  </div>

                  {/* IMAGE (illustration) */}
                  <img
                    src={card.img}
                    alt={card.label}
                    className="absolute bottom-0 right-0 w-[55%] object-contain pointer-events-none select-none"
                  />

                  {/* ARROW BUTTON */}
                  <div className="absolute bottom-5 left-5">
                    <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
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
