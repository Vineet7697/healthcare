
import { FaLocationDot } from "react-icons/fa6";
import { FaEnvelope, FaMobileAlt } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const Contact = () => {

  const { language, lang } = useLanguage();
  const t = lang[language];
  return (
    <>
      {/* -------- SUPPORT FORM SECTION -------- */}
      <section className="bg-[#0072BC] text-white py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">
          {/* Left Section */}
          <div className="text-center md:text-left">
            <img
              src="/images/svg.png"
              alt="Customer Support"
              className="mx-auto md:mx-0 mb-6 w-64 md:w-80"
            />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.contact_support_title}
            </h2>
            <p className="text-blue-100 text-lg">
              {t.contact_support_desc}
            </p>
          </div>

          {/* Right Section (Form) */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-gray-800 mt-5">
            <h1 className="text-2xl font-semibold mb-6">
             {t.contact_form_title}
            </h1>

            <form className="space-y-5">
              {/* Concern Dropdown */}
              <div>
                <select
                  id="concern"
                  name="concern"
                  required
                  className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                >
                  <option value="">{t.choose_concern}</option>
                  <option value="healthcheck">{t.health_services}</option>
                  <option value="lab">{t.lab_booking}</option>
                  <option value="medicine">{t.medicine_purchase}</option>
                  <option value="consultation">{t.doctor_consultation}</option>
                  <option value="app">{t.app_support}</option>
                  <option value="coupons">{t.offers}</option>
                  <option value="subscription">{t.plans}</option>
                  <option value="security">{t.privacy}</option>
                </select>
              </div>

              {/* Sub-Concern Dropdown */}
              <div>
                <select
                  id="subConcern"
                  name="subConcern"
                  required
                  className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                >
                  <option value="">{t.select_issue}</option>
                  <option value="order">{t.track_order}r</option>
                  <option value="cancellation">{t.cancel_order}</option>
                  <option value="reschedule">{t.reschedule}</option>
                  <option value="prize">{t.reward_issue}</option>
                  <option value="app">{t.app_not_working}</option>
                  <option value="reports">{t.report_delay}</option>
                  <option value="cancel">{t.request_cancel}</option>
 </select>
      
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  {t.full_name} <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium mb-1"
                >
                 {t.mobile_number} <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="number"
                  id="number"
                  required
                  className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  {t.email_optional}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="text"
                  className="block text-sm font-medium mb-1"
                >
                  {t.describe_issue}
                </label>
                <textarea
                  name="text"
                  id="text"
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-[#0072BC] focus:outline-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#0072BC] text-white font-semibold py-2 rounded-lg hover:bg-[#005a99] transition duration-300"
              >
                {t.submit_request}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* -------- CONTACT INFO SECTION -------- */}
      <section className="bg-blue-50 py-16 px-6 md:px-16 text-center">
        <div className="max-w-5xl mx-auto space-y-12 flex flex-col items-center">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.wellbeing_title}
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              {t.wellbeing_desc}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            <div className="flex flex-col items-center bg-white shadow-2xl rounded-xl p-6 w-56 hover:scale-105 transition-transform">
              <FaLocationDot className="text-[#0072BC] text-4xl mb-3" />
              <span className="font-bold text-gray-800 text-lg">{t.location}</span>
              <p className="text-gray-600">Bhopal, MP</p>
            </div>

            <div className="flex flex-col items-center bg-white shadow-2xl rounded-xl p-6 w-56 hover:scale-105 transition-transform">
              <FaEnvelope className="text-[#0072BC] text-4xl mb-3" />
              <span className="font-bold text-gray-800 text-lg">{t.email_us}</span>
              <p className="text-gray-600">support@yodoctor.com</p>
            </div>

            <div className="flex flex-col items-center bg-white shadow-2xl rounded-xl p-6 w-56 hover:scale-105 transition-transform">
              <FaMobileAlt className="text-[#0072BC] text-4xl mb-3" />
              <span className="font-bold text-gray-800 text-lg">{t.call_us}</span>
              <p className="text-gray-600">+91 88390 03275</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------- MAP & CONSULT SECTION -------- */}
      <section className="py-16 px-6 md:px-16 bg-blue-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-snug">
              {t.talk_doctor_title}{" "}
              <span className="text-[#0072BC] font-bold">Yo</span>
              <span className="text-green-500 font-bold">Doctor</span>
            </h3>

            <p className="text-gray-700 leading-relaxed">
               {/* <strong>YoDoctor</strong>,  */}
               {t.talk_doctor_desc1}
            </p>

            <p className="text-gray-700 leading-relaxed">
              {t.talk_doctor_desc2}
            </p>
          </div>

          <div className="flex-1 w-full h-80 md:h-96 shadow-lg rounded-xl overflow-hidden">
            <iframe
              title="YoDoctor Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.142269234603!2d77.41261507534563!3d23.25468830868316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c43d2f9e3c7c5%3A0x7f513915d6e03d!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1695812345678!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
