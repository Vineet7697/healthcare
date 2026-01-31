import CountUp from "react-countup";
import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const { language, lang } = useLanguage();
  const safeLang = lang[language] ? language : "en";
  return (
    <>
      {/* ================= SECTION 1 ================= */}
      <section
        id="about"
        className="bg-blue-50 py-16 sm:py-20 px-4 sm:px-8 md:px-16 "
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 ">
          {/* Left Image */}
          <div className="w-full md:flex-1 ">
            <img
              src="/images/lab-test_yo_doctor.png"
              alt="Digital Healthcare Illustration"
              className="w-full rounded-2xl shadow-md mt-2"
            />
          </div>

          {/* Right Text */}
          <div className="w-full md:flex-1 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl font-bold leading-snug mb-4">
               {lang[safeLang].about_title}
            </h1>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              <span className="text-gray-400">{lang[safeLang].about_desc}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2 - STATS ================= */}
      <section className="bg-blue-50 py-16 sm:py-20 px-4 sm:px-8 md:px-16 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-10">
            {lang[safeLang].stats_title}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 sm:gap-y-0 sm:divide-x divide-gray-300">
            {[
              { value: 5000, label: lang[safeLang].doctors },
              { value: 10000, label: lang[safeLang].patients },
              { value: 1000, label: lang[safeLang].labs },
              { value: 1000, label: lang[safeLang].hospitals },
            ].map((item, i) => (
              <div key={i} className="py-4">
                <span className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-[#2297BE]">
                  <CountUp end={item.value} duration={2.5} />+
                </span>
                <p className="text-gray-700 mt-2 font-medium text-sm sm:text-base">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3 ================= */}
      <section className="bg-blue-50 py-16 sm:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="w-full md:flex-1 text-center md:text-left">
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
              {lang[safeLang].belief_para}
              <span className="font-semibold text-blue-400">
                {" "}
                YoDoctor App{" "}
              </span>
            </p>

            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-blue-900">
              {lang[safeLang].with_app}
            </h3>

            {/* ✅ MOBILE = 2 cards per row */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-gray-700 font-medium">
              {[
                { img: "/images/tracker.png", text: lang[safeLang].f1 },
                { img: "/images/labtest.png", text: lang[safeLang].f3 },
                { img: "/images/medicine-new.png", text: lang[safeLang].f4 },
                { img: "/images/care-program.png", text: lang[safeLang].f5 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="min-h-37.5 flex flex-col gap-2 bg-blue-100 py-3 px-3 sm:px-4 rounded-xl shadow-sm hover:shadow-md transition border border-blue-100"
                >
                  <img
                    src={item.img}
                    alt=""
                    className="w-12 h-12 sm:w-14 sm:h-14 p-2 bg-blue-200 rounded-full"
                  />
                  <span className="text-xs sm:text-sm md:text-base">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone Image */}
          <div className="w-full md:flex-1 flex justify-center mt-8 md:mt-0">
            <img
              src="/images/phone-1.png"
              alt="Mobile App Preview"
              className="w-48 sm:w-60 md:w-80 lg:w-96 max-h-[70vh] object-contain drop-shadow-lg animate-float"
            />
          </div>
        </div>
      </section>

      {/* ================= SECTION 4 ================= */}
      <section className="bg-blue-50 py-16 px-4 sm:px-8 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:flex-1 flex justify-center">
            <img
              src="/images/home-diagnosis.webp.png"
              alt="Home diagnosis illustration"
              className="rounded-2xl shadow-lg w-full max-w-md"
            />
          </div>

          <div className="w-full md:flex-1 space-y-6 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              {lang[safeLang].tech_title}
            </h3>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              {lang[safeLang].tech_desc}
            </p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5 ================= */}
      <section className="bg-blue-50 py-16 sm:py-20 px-4 sm:px-8 md:px-16">
        <div className=" max-w-7xl mx-auto flex flex-col md:flex-row items-center rounded-2xl py-10 gap-10">
          <div className="w-full md:flex-1 flex justify-center">
            <img
              src="/images/yo_doctor_team.png"
              alt="Yo Doctor Team"
              className="rounded-2xl shadow-lg w-full max-w-md"
            />
          </div>

          <div className="w-full md:flex-1 text-center md:text-left space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
              {lang[safeLang].team_title}
            </h2>

            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              {lang[safeLang].team_desc}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
