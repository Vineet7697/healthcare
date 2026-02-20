// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/autoplay";
// import { Autoplay } from "swiper/modules";

// const LandingPage = () => {
//   const navigate = useNavigate();

//   return (
//     <>
//       {/* ================= HERO SECTION ================= */}
//       <section className="min-h-screen bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] flex flex-col pt-20">
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 sm:px-10 lg:px-16 grow">
          
//           {/* LEFT CONTENT */}
//           <div className="w-full md:w-1/2 space-y-5 text-center md:text-left md:ml-10">
//             <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#002855] leading-tight">
//               Always here when <br className="hidden sm:block" /> you need care
//             </h2>

//             <p className="text-[#4a5c6a] text-base sm:text-lg lg:text-2xl">
//               Get care, feel better, live brighter — with{" "}
//               <strong>Yo Doctor</strong>.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
//               <button
//                 className="px-6 py-3 bg-linear-to-br from-[#2277f7] to-[#52abd4] font-bold text-white rounded-full cursor-pointer"
//                 onClick={() => navigate("/clientloginpage")}
//               >
//                 For Patient
//               </button>

//               <button
//                 className="px-6 py-3 bg-linear-to-br from-[#2277f7] to-[#52abd4] font-bold text-white rounded-full cursor-pointer"
//                 onClick={() => navigate("/doctorloginpage")}
//               >
//                 For Doctor
//               </button>
//             </div>
//           </div>

//           {/* RIGHT IMAGE */}
//           <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
//             <img
//               src="/images/landingimage.png"
//               alt="Doctor Illustration"
//               className="w-65 sm:w-[320px] md:w-95 lg:w-105 drop-shadow-lg"
//             />
//           </div>
//         </div>

//         {/* ================= SERVICES SECTION ================= */}
//         <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-16 px-4">
//           {[
//             { img: "/images/labtesting.png", label: "Lab Test", link: "/lab-test" },
//             { img: "/images/orderMedicine.png", label: "Medicine Delivery", link: "/medicine" },
//             { img: "/images/homeConsulation.png", label: "Home Consultation", link: "/home-consultation" },
//             { img: "/images/BookonlineAppointment.png", label: "Online Book Appointment", link: "/book-appointment" },
//             { img: "/images/FindBloodDonores.png", label: "Find Blood Doner", link: "/blood-donor" },
//           ].map((service, index) => (
//             <a
//               key={index}
//               href={service.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-center w-28 sm:w-32 md:w-36 cursor-pointer"
//             >
//               <img
//                 src={service.img}
//                 alt={service.label}
//                 className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto object-contain hover:scale-105 transition"
//               />
//               <p className="text-gray-600 font-medium mt-2 text-sm sm:text-base">
//                 {service.label}
//               </p>
//             </a>
//           ))}
//         </div>
//       </section>

//       {/* ================= SWIPER SECTION ================= */}
//       <Swiper
//         className="w-full max-w-7xl mx-auto my-6 px-4"
//         modules={[Autoplay]}
//         autoplay={{ delay: 2000, disableOnInteraction: false }}
//         loop
//       >
//         <SwiperSlide>
//           <img
//             src="/images/download1.png"
//             alt="Download App"
//             className="rounded-2xl w-full"
//           />
//         </SwiperSlide>

//         <SwiperSlide>
//           <img
//             src="/images/download2.png"
//             alt="Download App"
//             className="rounded-2xl w-full"
//           />
//         </SwiperSlide>

//         <SwiperSlide>
//           <img
//             src="/images/download3.png"
//             alt="Download App"
//             className="rounded-2xl w-full"
//           />
//         </SwiperSlide>
//       </Swiper>
//     </>
//   );
// };

// export default LandingPage;



import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useLanguage } from "../context/LanguageContext";

const LandingPage = () => {
  const navigate = useNavigate();
    const { language, lang } = useLanguage();
    const t = lang[language];

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="min-h-screen bg-linear-to-b from-[#cfeeff] to-[#e9f8ff] flex flex-col pt-20">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 sm:px-10 lg:px-16 grow">
          
          {/* LEFT CONTENT */}
          <div className="w-full md:w-1/2 space-y-5 text-center md:text-left md:ml-10">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#002855] leading-tight">
                {t.heroTitleLine1} <br className="hidden sm:block" /> {t.heroTitleLine2}
            </h2>

            <p className="text-[#4a5c6a] text-base sm:text-lg lg:text-2xl">
               {t.heroSubtitle}{" "}
              <strong>Yo Doctor</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <button
                className="px-6 py-3 bg-linear-to-br from-[#2277f7] to-[#52abd4] font-bold text-white rounded-full cursor-pointer"
                onClick={() => navigate("/clientloginpage")}
              >
                 {t.forPatient}
              </button>

              <button
                className="px-6 py-3 bg-linear-to-br from-[#2277f7] to-[#52abd4] font-bold text-white rounded-full cursor-pointer"
                onClick={() => navigate("/doctorloginpage")}
              >
                {t.forDoctor}
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <img
              src="/images/landingimage.png"
              alt="Doctor Illustration"
              className="w-65 sm:w-[320px] md:w-95 lg:w-105 drop-shadow-lg"
            />
          </div>
        </div>

        {/* ================= SERVICES SECTION ================= */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-16 px-4">
          {[
            { img: "/images/labtesting.png", label: `${t.labTest}`, link: "/lab-test" },
            { img: "/images/orderMedicine.png", label: `${t.medicine}`, link: "/medicine" },
            { img: "/images/homeConsulation.png", label: `${t.homeConsultation}`, link: "/home-consultation" },
            { img: "/images/BookonlineAppointment.png", label: `${t.onlineAppointment}`, link: "/book-appointment" },
            { img: "/images/FindBloodDonores.png", label: `${t.bloodDonor}`, link: "/blood-donor" },
          ].map((service, index) => (
            <a
              key={index}
              href={service.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center w-28 sm:w-32 md:w-36 cursor-pointer"
            >
              <img
                src={service.img}
                alt={service.label}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto object-contain hover:scale-105 transition"
              />
              <p className="text-gray-600 font-medium mt-2 text-sm sm:text-base">
                {service.label}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ================= SWIPER SECTION ================= */}
      <Swiper
        className="w-full max-w-7xl mx-auto my-6 px-4"
        modules={[Autoplay]}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop
      >
        <SwiperSlide>
          <img
            src="/images/download1.png"
            alt="img"
            className="rounded-2xl w-full"
          />
        </SwiperSlide>

        <SwiperSlide>
          <img
            src="/images/download4.png"
            alt="img"
            className="rounded-2xl w-full"
          />
        </SwiperSlide>

        {/* <SwiperSlide>
          <img
            src="/images/download3.png"
            alt="img"
            className="rounded-2xl w-full"
          />
        </SwiperSlide> */}
      </Swiper>
    </>
  );
};

export default LandingPage;
