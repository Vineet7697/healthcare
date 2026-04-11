import CountUp from "react-countup";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useRef, useState } from "react";

import lab_test_yo_doctorImg from "../assets/images/lab-test_yo_doctor.webp";
import trackerImg            from "../assets/images/tracker.webp";
import labtestImg            from "../assets/images/labtest.webp";
import medicineImg           from "../assets/images/medicine-new.webp";
import careProgramImg        from "../assets/images/care-program.webp";
import phoneImg              from "../assets/images/phone-1.webp";
import homeDiagnosisImg      from "../assets/images/home-diagnosis.webp";
import teamImg               from "../assets/images/yo_doctor_team.webp";

import SEO from "../components/SEO";
import { Link } from "react-router-dom";


/* ─── Icon ─── */
const Icon = ({ d, size = 20, color = "currentColor", sw = 1.8 }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24"
    stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  heart:  "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  users:  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  globe:  "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  check:  "M5 13l4 4L19 7",
  arrow:  "M17 8l4 4m0 0l-4 4m4-4H3",
  star:   "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  zap:    "M13 10V3L4 14h7v7l9-11h-7z",
  team:   "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
};


const FALLBACK_STATS = {
  doctors:  5000,
  patients: 1000,
  labs:     50,
  clinics:  100,
};



const getStatsFromCache = () => {
  try {
    const raw = localStorage.getItem("yo_public_stats");
    
    if (!raw) return FALLBACK_STATS;
    const parsed = JSON.parse(raw);

    if (parsed.labs > 100) {
  parsed.labs = 50; // safety cap
}

   return {
  doctors:  parsed.doctors  ?? FALLBACK_STATS.doctors,
  patients: parsed.patients ?? FALLBACK_STATS.patients,
  labs:     parsed.labs     ?? FALLBACK_STATS.labs,
  clinics:  parsed.doctors  ?? FALLBACK_STATS.clinics,
};
  } catch {
    return FALLBACK_STATS;
  }
};

/* ─── Fade-in on scroll ─── */
const FadeIn = ({ children, delay = 0, direction = "up" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const startY = direction === "up" ? 32 : 0;
  const startX = direction === "left" ? -32 : direction === "right" ? 32 : 0;
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translate(0,0)" : `translate(${startX}px,${startY}px)`,
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      width: "100%",
    }}>
      {children}
    </div>
  );
};

const SectionLabel = ({ text }) => (
  <div className="flex items-center gap-2 mb-3">
    <div style={{ width: 24, height: 2, background: "#0072BC", borderRadius: 2 }} />
    <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: "#0072BC" }}>
      {text}
    </span>
  </div>
);

/* ══════════════════════════════════════════ */
const About = () => {
  const { language, lang } = useLanguage();
  const safeLang = lang[language] ? language : "en";
  const t = lang[safeLang];

  
  const cachedStats = getStatsFromCache();

  const stats = [
    { value: cachedStats.doctors,  suffix: "+", label: t.doctors,  icon: ICONS.users,  color: "#0072BC" },
    { value: cachedStats.patients, suffix: "+", label: t.patients,  icon: ICONS.heart,  color: "#0891b2" },
    { value: cachedStats.labs,     suffix: "+", label: t.labs,      icon: ICONS.shield, color: "#7c3aed" },
    { value: cachedStats.clinics,  suffix: "+", label: t.clinics,   icon: ICONS.globe,  color: "#059669" },
  ];

  const appFeatures = [
    { img: trackerImg,     text: t.f1, color: "#0072BC" },
    { img: labtestImg,     text: t.f3, color: "#0891b2" },
    { img: medicineImg,    text: t.f4, color: "#7c3aed" },
    { img: careProgramImg, text: t.f5, color: "#059669" },
  ];

  return (
    <>
      <SEO
        title="About Yo Doctor | Digital Healthcare Platform in India"
        description="Learn about Yo Doctor, a digital healthcare platform providing online doctor appointments, lab tests, medicines, and home healthcare services across India."
        keywords="about yo doctor, digital healthcare platform, online doctor appointment india"
        url="https://www.yodoctor.in/about"
      />

     
      <div className="relative overflow-hidden" style={{ background: "#050f24", padding: "64px 0 60px" }}>
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.07 }}>
          <defs><pattern id="adots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#adots)" />
        </svg>
        <div className="absolute" style={{
          width: 500, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,114,188,0.22) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
        }} />
        <div className="relative z-10 text-center px-6 mt-10">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="text-lg font-extrabold uppercase tracking-widest" style={{ color: "#0072BC" }}>Yo</span>
            <span className="text-lg font-extrabold uppercase tracking-widest" style={{ color: "#16a34a" }}>Doctor</span>
          </div>
          <h1 className="font-black text-white mb-4" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", letterSpacing: "-0.01em" }}>
            About <span style={{ color: "#0072BC" }}>Us</span>
          </h1>
          <div className="flex items-center gap-3 justify-center mb-5">
            <div style={{ width: 56, height: 2, background: "#0072BC", borderRadius: 2 }} />
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0072BC" }} />
            <div style={{ width: 56, height: 2, background: "#0072BC", borderRadius: 2 }} />
          </div>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "rgba(180,210,255,0.72)", lineHeight: 1.85 }}>
            India's trusted digital healthcare platform — connecting patients with verified doctors, labs, and home care services.
          </p>
        </div>
      </div>

      {/* ══════════════════════
          2. ABOUT INTRO
      ══════════════════════ */}
      <section style={{ background: "#f4f7fb", padding: "88px 0" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <FadeIn direction="left">
              <div className="relative w-full">
                <div className="absolute rounded-2xl"
                  style={{ inset: 0, top: 16, left: 16, background: "#0072BC18", zIndex: 0, borderRadius: 20 }} />
                <img
                  src={lab_test_yo_doctorImg}
                  alt="Yo Doctor digital healthcare platform"
                  loading="lazy"
                  style={{
                    position: "relative", zIndex: 1, width: "100%", height: "auto",
                    borderRadius: 20, boxShadow: "0 16px 56px rgba(0,114,188,0.16)", display: "block",
                  }}
                />
                <div className="absolute flex items-center gap-3 rounded-2xl px-5 py-3"
                  style={{ bottom: -20, right: 20, zIndex: 2, background: "#0072BC", boxShadow: "0 8px 32px rgba(0,114,188,0.4)" }}>
                  <Icon d={ICONS.star} size={18} color="#f5c518" sw={2} />
                  <div>
                    <p className="text-white text-xs font-extrabold leading-none">Trusted Platform</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(200,230,255,0.85)" }}>Verified by NABH</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div>
                <SectionLabel text="Who We Are" />
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-5 leading-tight">
                  {t.about_title}
                </h2>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base mb-7">
                  {t.about_desc}
                </p>
                {[
                  "Online doctor appointments in minutes",
                  "Verified & experienced healthcare professionals",
                  "Home care, lab tests & medicine delivery",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3.5">
                    <span className="flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ width: 28, height: 28, background: "#0072BC15" }}>
                      <Icon d={ICONS.check} size={14} color="#0072BC" sw={2.5} />
                    </span>
                    <span className="text-sm text-gray-600 font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════
          3. STATS
      ══════════════════════ */}
      <section style={{ background: "#050f24", padding: "80px 0", position: "relative", overflow: "hidden" }}>
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }}>
          <defs><pattern id="sdots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
          </pattern></defs>
          <rect width="100%" height="100%" fill="url(#sdots)" />
        </svg>
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-xs font-extrabold uppercase tracking-widest inline-block mb-3"
                style={{ color: "#f5c518", letterSpacing: "0.3em" }}>Our Impact</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">{t.stats_title}</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex flex-col items-center text-center rounded-2xl p-7 transition-all duration-300 h-full"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${stat.color}22`;
                    e.currentTarget.style.border     = `1.5px solid ${stat.color}55`;
                    e.currentTarget.style.transform  = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.border     = "1.5px solid rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform  = "translateY(0)";
                  }}
                >
                  <div className="flex items-center justify-center rounded-xl mb-5"
                    style={{ width: 52, height: 52, background: `${stat.color}28` }}>
                    <Icon d={stat.icon} size={24} color={stat.color} />
                  </div>
                  <div className="font-black text-white" style={{ fontSize: "2.4rem", lineHeight: 1 }}>
                    <CountUp end={stat.value} duration={2.5} separator="," />
                    <span style={{ color: "#f5c518" }}>{stat.suffix}</span>
                  </div>
                  <p className="text-lg font-semibold mt-3" style={{ color: "rgba(180,210,255,0.72)" }}>
                    {stat.label}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════
          4. APP FEATURES
      ══════════════════════ */}
      <section style={{ background: "#f4f7fb", padding: "88px 0" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <FadeIn direction="left">
              <div>
                <SectionLabel text="The App" />
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-2">
                  {t.belief_para}
                  <span className="font-bold" style={{ color: "#0072BC" }}> YoDoctor App</span>
                </p>
                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-8 leading-snug">
                  {t.with_app}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {appFeatures.map((item, i) => (
                    <div key={i}
                      className="flex flex-col gap-3 rounded-2xl p-5 transition-all duration-300"
                      style={{ background: "#fff", border: "1.5px solid #e8eef8", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", cursor: "default" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.border     = `1.5px solid ${item.color}55`;
                        e.currentTarget.style.boxShadow  = `0 10px 32px ${item.color}20`;
                        e.currentTarget.style.transform  = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.border    = "1.5px solid #e8eef8";
                        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div className="rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ width: 52, height: 52, background: `${item.color}14` }}>
                        <img src={item.img} alt={item.text} className="w-9 h-9 object-contain" loading="lazy" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 leading-snug">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={120}>
              <div className="flex justify-center items-center relative">
                <div className="absolute" style={{
                  width: 340, height: 340, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(0,114,188,0.13) 0%, transparent 70%)",
                  top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                }} />
                <img
                  src={phoneImg}
                  alt="Yo Doctor mobile app"
                  loading="lazy"
                  style={{
                    position: "relative",
                    width: "min(100%, 380px)",
                    maxHeight: "72vh",
                    objectFit: "contain",
                    filter: "drop-shadow(0 24px 48px rgba(0,114,188,0.22))",
                    animation: "floatPhone 3.5s ease-in-out infinite",
                  }}
                />
                <style>{`@keyframes floatPhone { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }`}</style>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════
          5. TECHNOLOGY
      ══════════════════════ */}
      <section style={{ background: "#ffffff", padding: "88px 0" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <FadeIn direction="left">
              <div>
                <SectionLabel text="Technology" />
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-5 leading-tight">
                  {t.tech_title}
                </h3>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-7">
                  {t.tech_desc}
                </p>
                <div className="flex items-center gap-2">
                  <div style={{ width: 44, height: 3, background: "#0072BC", borderRadius: 2 }} />
                  <div style={{ width: 14, height: 3, background: "#f5c518", borderRadius: 2 }} />
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div className="relative w-full">
                <img
                  src={homeDiagnosisImg}
                  alt="Home diagnosis"
                  loading="lazy"
                  style={{
                    width: "100%", height: "auto", borderRadius: 20,
                    boxShadow: "0 16px 56px rgba(0,0,0,0.11)", display: "block",
                  }}
                />
                <div className="absolute flex items-center gap-3 rounded-2xl px-5 py-3"
                  style={{ bottom: -20, left: 20, background: "#050f24", boxShadow: "0 8px 32px rgba(0,0,0,0.32)" }}>
                  <Icon d={ICONS.zap} size={18} color="#f5c518" sw={2} />
                  <div>
                    <p className="text-white text-xs font-extrabold leading-none">AI-Powered</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(180,220,255,0.8)" }}>Smart Diagnostics</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════
          6. TEAM
      ══════════════════════ */}
      <section style={{ background: "#f4f7fb", padding: "88px 0 100px" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <FadeIn direction="left">
              <div className="relative w-full">
                <img
                  src={teamImg}
                  alt="Yo Doctor Team"
                  loading="lazy"
                  style={{
                    width: "100%", height: "auto", borderRadius: 20,
                    boxShadow: "0 16px 56px rgba(0,0,0,0.11)", display: "block",
                  }}
                />
                <div className="absolute flex items-center gap-3 rounded-2xl px-5 py-3"
                  style={{ bottom: -20, right: 20, background: "#0072BC", boxShadow: "0 8px 32px rgba(0,114,188,0.38)" }}>
                  <Icon d={ICONS.team} size={18} color="#fff" sw={1.8} />
                  <div>
                    <p className="text-white text-xs font-extrabold leading-none">Expert Team</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(200,230,255,0.88)" }}>Healthcare Professionals</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={100}>
              <div>
                <SectionLabel text="Our Team" />
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-5 leading-tight">
                  {t.team_title}
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
                  {t.team_desc}
                </p>

                 <Link
            to="/service"
             className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200"
                  style={{ background: "#0072BC" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#005fa3"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#0072BC"}
          >
          Explore Our Services
                  <Icon d={ICONS.arrow} size={15} color="#fff" sw={2.2} />
          </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;