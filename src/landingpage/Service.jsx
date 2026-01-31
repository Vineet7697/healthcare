import { useLanguage } from "../context/LanguageContext";


const Service = () => {
  return (
    <>
      <section className="py-20 px-6 md:px-16 bg-blue-50 text-gray-800">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            Our <span className="text-[#0072BC]">Core & Support</span> Services
          </h2>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* ✅ Core Services */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-[#0072BC]">
                Core Services
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <img
                    src="/images/online_appointment_booking.png"
                    alt="Online Appointment Booking"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>Online Appointment Booking:</strong> View a calendar
                    and choose your preferred date and time.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="/images/video_consultation_telemedicine.png"
                    alt="Video Consultation"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>Video Consultation / Telemedicine:</strong> Consult
                    with a doctor online from your home.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="/images/in_clinic_consultation.png"
                    alt="In-Clinic Consultation"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>In-Clinic Consultation:</strong> Visit the clinic or
                    hospital to meet your doctor in person.
                  </p>
                </li>
              </ul>
            </div>

            {/* ✅ Informational Services (fixed layout) */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-[#0072BC]">
                Informational Services
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <img
                    src="/images/doctor_profiles.png"
                    alt="Doctor Profiles"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>Doctor Profiles:</strong> View qualifications,
                    experience, and specializations.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="/images/specialities_departments.png"
                    alt="Specialties and Departments"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>Specialties/Departments:</strong> Cardiology,
                    Dermatology, Pediatrics, General Medicine, and more.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <img
                    src="/images/treatment_offered.png"
                    alt="Treatments Offered"
                    className="w-8 h-8 mt-1 rounded"
                  />
                  <p>
                    <strong>Treatments Offered:</strong> Health check-ups, minor
                    surgeries, and other procedures.
                  </p>
                </li>
              </ul>
            </div>

            {/* Patient Conveniences */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-[#0072BC]">
                Patient Conveniences
              </h3>

              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <img
                    src="/images/view_lab_report.png"
                    alt="View Lab Reports"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>View Lab Reports:</strong> Access your test results
                    online.
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/prescription_management.png"
                    alt="Prescription Management"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>Prescription Management:</strong> View past
                    prescriptions or request refills easily.
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/health_package.png"
                    alt="Health Packages"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>Health Packages:</strong> Full-body check-ups and
                    preventive care bundles.
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/home_care_service.png"
                    alt="Home Care Services"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>Home Care Services:</strong> At-home sample
                    collection and nursing care.
                  </p>
                </li>
              </ul>
            </div>

            {/* Additional Services */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-[#0072BC]">
                Additional Services
              </h3>

              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <img
                    src="/images/emergency_service.png"
                    alt="Emergency Services"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>Emergency Services:</strong> 24/7 emergency care
                    contacts.
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/health_blog_articles.png"
                    alt="Health Blog"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>Health Blog & Articles:</strong> Helpful tips and
                    wellness information.
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <img
                    src="/images/book_ambulance.png"
                    alt="Book Ambulance"
                    className="w-8 h-8 rounded"
                  />
                  <p>
                    <strong>Book Ambulance:</strong> Request an ambulance
                    instantly.
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
