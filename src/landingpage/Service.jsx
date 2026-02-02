import { useLanguage } from "../context/LanguageContext";

const Service = () => {
  const { language, lang } = useLanguage();
  const t = lang[language];
  return (
    <>
      <section className="py-20 px-6 md:px-16 bg-blue-50 text-gray-800">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            {t.services_title_main}{" "}
            <span className="text-[#0072BC]">
              {" "}
              {t.services_title_highlight}{" "}
            </span>{" "}
            {t.services_title_end}
          </h2>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* ✅ Core Services */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-[#0072BC]">
                {t.core_services}
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <img
                    src="/images/online_appointment_booking.png"
                    alt="Online Appointment Booking"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>{t.online_booking_title}:</strong>{" "}
                    {t.online_booking_desc}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="/images/video_consultation_telemedicine.png"
                    alt="Video Consultation"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>{t.video_consult_title}:</strong>{" "}
                    {t.video_consult_desc}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="/images/in_clinic_consultation.png"
                    alt="In-Clinic Consultation"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>{t.clinic_consult_title}:</strong>{" "}
                    {t.clinic_consult_desc}
                  </p>
                </li>
              </ul>
            </div>

            {/* ✅ Informational Services (fixed layout) */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-[#0072BC]">
                {t.info_services}
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <img
                    src="/images/doctor_profiles.png"
                    alt="Doctor Profiles"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>{t.doctor_profile_title}:</strong>{" "}
                    {t.doctor_profile_desc}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="/images/specialities_departments.png"
                    alt="Specialties and Departments"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>{t.specialties_title}:</strong> {t.specialties_desc}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="/images/treatment_offered.png"
                    alt="Treatments Offered"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>{t.treatment_title}:</strong> {t.treatment_desc}
                  </p>
                </li>
              </ul>
            </div>

            {/* Patient Conveniences */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-[#0072BC]">
                {t.patient_convenience}
                
              </h3>

              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <img
                    src="/images/view_lab_report.png"
                    alt="View Lab Reports"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>{t.lab_report_title}: </strong>{t.lab_report_desc}
                  
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/prescription_management.png"
                    alt="Prescription Management"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>{t.prescription_title}:</strong> {t.prescription_desc}
                    
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/health_package.png"
                    alt="Health Packages"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>{t.health_package_title}:</strong> {t.health_package_desc}
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/home_care_service.png"
                    alt="Home Care Services"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>{t.home_care_title}:</strong> {t.home_care_desc}
                  </p>
                </li>
              </ul>
            </div>

            {/* Additional Services */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-[#0072BC]">
                {t.additional_services}
              </h3>

              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <img
                    src="/images/emergency_service.png"
                    alt="Emergency Services"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>{t.emergency_title}: </strong> {t.emergency_desc}
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/health_blog_articles.png"
                    alt="Health Blog"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>{t.blog_title}: </strong> {t.blog_desc}
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/book_ambulance.png"
                    alt="Book Ambulance"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>{t.ambulance_title}: </strong> {t.ambulance_desc}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Service;
