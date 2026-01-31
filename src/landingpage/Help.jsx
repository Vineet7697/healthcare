import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const Help = () => {
  useEffect(() => {
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("help-search");

    const handleSearch = () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) return;
      const sections = document.querySelectorAll("article");
      let found = false;
      sections.forEach((s) => {
        const text = s.innerText.toLowerCase();
        if (text.includes(q)) {
          s.scrollIntoView({ behavior: "smooth", block: "start" });
          s.animate(
            [
              { background: "#ffffff" },
              { background: "#f0fdfa" },
              { background: "#ffffff" },
            ],
            { duration: 1000 }
          );
          found = true;
        }
      });
      if (!found)
        alert("No help articles matched your search. Try different keywords.");
    };

    const handleEnter = (e) => {
      if (e.key === "Enter") handleSearch();
    };

    searchBtn.addEventListener("click", handleSearch);
    searchInput.addEventListener("keydown", handleEnter);

    return () => {
      searchBtn.removeEventListener("click", handleSearch);
      searchInput.removeEventListener("keydown", handleEnter);
    };
  }, []);

  return (
    <section className="py-20 px-6 md:px-16 bg-blue-50 text-gray-800">
      <main className=" max-w-6xl mx-auto px-4 py-8  bg-blue-50  font-inter antialiased text-gray-800 mt-10">
        {/* Search card */}
        <section className="bg-white rounded-2xl shadow-md p-4 sm:p-5 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Content */}
            <div className="md:max-w-md">
              <h1 className="text-xl sm:text-2xl font-semibold">
                Help: Online Booking & Video Consultation
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Quick guides and troubleshooting for booking appointments and
                joining video consultations.
              </p>
            </div>

            {/* Search */}
            <div className="flex-1 md:flex md:justify-end">
              <label htmlFor="help-search" className="sr-only">
                Search help
              </label>

              <div className="flex w-full md:w-auto items-center gap-2">
                <input
                  id="help-search"
                  type="search"
                  placeholder="Search help (e.g. 'reschedule appointment', 'video not connecting')"
                  className="w-full md:w-72 lg:w-96 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
                <button
                  id="search-btn"
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Tip: Try keywords like <span className="italic">reschedule</span>,{" "}
            <span className="italic">prescription</span>,{" "}
            <span className="italic">camera</span>.
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Content */}
          <section className="md:col-span-3 space-y-6 ">
            {/* Getting Started */}
            <Article
              id="getting-started"
              title="1. Getting Started"
              desc="Quick overview of the platform and how to begin."
              details={[
                {
                  q: "What does our platform do?",
                  a: "We are a telemedicine platform where you can book appointments with doctors online and take video/phone consultations. You can also manage prescriptions, reports, and follow-ups.",
                },
                {
                  q: "How to create an account",
                  a: "On the signup page, enter your email/phone → verify OTP → complete your profile (name, age, gender, optional medical history). Social sign-in (Google/Apple) may also be available.",
                },
                {
                  q: "Login / logout process",
                  a: "Login using email/phone + password or OTP. Logout via Profile menu → Logout button. If OTP isn’t received, use the 'Forgot password' option.",
                },
                {
                  q: "Supported devices & usage",
                  a: "Website: modern browsers (Chrome/Firefox/Edge/Safari). Mobile: Android app (>= Android 8) & iOS app (>= iOS 13). For best video experience, use the latest browser or official app.",
                },
              ]}
            />

            {/* Booking */}
            <Article
              id="booking-appointments"
              title="2. Booking Appointments"
              desc="Step-by-step guide to search doctors and book appointments."
              details={[
                {
                  q: "How to search for doctors or specialties",
                  a: "Use the search bar to type specialty (e.g., Dermatology, Psychiatry) or doctor name. Use filters such as experience, fees, language, rating, and availability.",
                },
                {
                  q: "Step-by-step appointment booking",
                  a: "1) Choose doctor → 2) Select date & time slot → 3) Choose mode (Video/Phone/Chat) → 4) Enter reason for visit → 5) Make payment (if required) → 6) Receive confirmation email/SMS.",
                },
                {
                  q: "How to check doctor availability",
                  a: "Available slots are shown; green = available, grey = unavailable. Some doctors have weekly slots or specific clinic hours.",
                },
                {
                  q: "Booking confirmation",
                  a: "After booking, you’ll get confirmation via email/SMS and notification in the app. It also appears under 'My Appointments'.",
                },
                {
                  q: "How to reschedule or cancel an appointment",
                  a: "Go to My Appointments → Select appointment → Reschedule/Cancel. Refunds follow our cancellation policy.",
                },
                {
                  q: "Appointment reminders",
                  a: "Automatic reminders via SMS/Email/Push notifications (24 hours and 1 hour before). Ensure notifications are enabled.",
                },
              ]}
            />

            {/* Online Video Consultation */}
            <Article
              id="online-video-consultation"
              title="3. Online Video Consultation"
              desc="Guide to join, conduct, and troubleshoot online doctor video calls."
              details={[
                {
                  q: "How to join a video consultation",
                  a: "Go to My Appointments → Select your booked slot → Tap 'Join Video Call'. Allow camera and microphone access in your browser/app.",
                },
                {
                  q: "Internet and device requirements",
                  a: "Stable 4G/Wi-Fi, working front camera and microphone. Recommended browsers: Chrome (latest), Edge, Safari. Avoid multiple tabs during call.",
                },
                {
                  q: "Doctor connection wait time",
                  a: "Usually 1–5 minutes. The screen will show 'Doctor joining soon' if delayed.",
                },
                {
                  q: "If audio or video doesn’t work",
                  a: "Reload the page, check mic/camera permissions, and ensure they are 'Allowed' in settings. If the issue persists, contact support with a screenshot.",
                },
                {
                  q: "How to receive prescription after video consult",
                  a: "Within 10–15 minutes of the consultation, a digital prescription appears in the 'My Prescriptions' section.",
                },
                {
                  q: "How to schedule follow-up consultation",
                  a: "Doctors with 'Follow-up Available' tags offer discounted follow-up slots. You’ll also receive a direct video link.",
                },
              ]}
            />

            {/* Payments & Refunds */}
            <Article
              id="payments-refunds"
              title="4. Payments & Refunds"
              desc="Everything about payment methods, failed transactions, and refund policy."
              details={[
                {
                  q: "Available payment modes",
                  a: "Credit/Debit Cards, UPI, NetBanking, Paytm, PhonePe, and Wallets are supported. All payments are processed via secure gateways.",
                },
                {
                  q: "What if payment fails?",
                  a: "If the amount is deducted but booking is not confirmed, refunds are issued within 3–5 working days. Contact support for delays.",
                },
                {
                  q: "Refund policy",
                  a: "Full refund if the doctor cancels. Refunds for patient cancellations depend on timing and policy.",
                },
                {
                  q: "How to get invoice or receipt",
                  a: "You can download invoices from the My Payments section or via email.",
                },
                {
                  q: "How to apply coupons or discounts",
                  a: "On the payment screen, enter your coupon in 'Apply Coupon' field. Valid codes apply discounts automatically.",
                },
              ]}
            />

            {/* Prescriptions & Reports */}
            <Article
              id="prescriptions-reports"
              title="5. Prescriptions & Reports"
              desc="How to view, download and share your prescriptions and reports."
              details={[
                {
                  q: "When will I get my prescription?",
                  a: "Usually within 10–15 minutes after consultation. A downloadable PDF is available in 'My Prescriptions'.",
                },
                {
                  q: "Where can I find old prescriptions?",
                  a: "Go to Profile → Medical Records → Prescriptions tab to view all past prescriptions.",
                },
                {
                  q: "How to access lab reports",
                  a: "You’ll be notified once your lab report is uploaded. It can be downloaded from the 'My Reports' section.",
                },
                {
                  q: "How to share reports with doctor",
                  a: "During booking, use the 'Attach Report' option to upload a PDF visible to the doctor during consultation.",
                },
                {
                  q: "How long is a prescription valid?",
                  a: "Typically valid for 30 days for general medicines; special medicines may vary per doctor’s advice.",
                },
              ]}
            />

            {/* Technical Issues */}
            <Article
              id="technical-issues"
              title="6. Technical Issues"
              desc="Troubleshooting common technical problems like login errors, lagging video, or app crashes."
              details={[
                {
                  q: "Having login or OTP issues?",
                  a: "Ensure stable network and resend OTP. If it continues, clear browser cache or update the app.",
                },
                {
                  q: "Video lagging or disconnecting",
                  a: "Check internet speed (minimum 1.5 Mbps). Close background apps or switch Wi-Fi/mobile data.",
                },
                {
                  q: "Camera or microphone not detected",
                  a: "Go to Browser/App Settings → Permissions → Enable Camera/Mic. Then reload and test again.",
                },
                {
                  q: "App crashing or running slow",
                  a: "Update to latest version and close unused apps. If still an issue, use 'Report Bug' with details.",
                },
              ]}
            />

            {/* Privacy & Security */}
            <Article
              id="privacy-security"
              title="7. Privacy & Security"
              desc="How we protect your personal data and medical information."
              details={[
                {
                  q: "Is my data safe?",
                  a: "Yes, all data is protected with AES-256 encryption and follows HIPAA & GDPR compliance.",
                },
                {
                  q: "Can doctors access my medical records?",
                  a: "Only doctors you consult with can access your relevant medical records.",
                },
                {
                  q: "How to delete my account?",
                  a: "Go to Profile → Settings → Delete Account. Your data is permanently deleted within 7 days.",
                },
              ]}
            />

            {/* Contact & Support */}
            <Article
              id="contact-support"
              title="8. Contact & Support"
              desc="Reach our support team for any queries or urgent help."
              details={[
                {
                  q: "How to contact customer support?",
                  a: "Live chat (Mon–Sat, 9 AM–8 PM) or email support@yoDoctor.com or call +91-8839003275.",
                },
                {
                  q: "Is emergency support available?",
                  a: "For emergencies, please call 108 or visit the nearest hospital. We do not provide emergency diagnosis.",
                },
                {
                  q: "How to send feedback or complaints?",
                  a: "Use the 'Send Feedback' form at the bottom of the Help page to contact our team.",
                },
              ]}
            />

            {/* FAQs */}
            <Article
              id="faqs"
              title="9. FAQs (Frequently Asked Questions)"
              desc="Quick answers to common questions from users."
              details={[
                {
                  q: "Is online consultation legal?",
                  a: "Yes, as per India’s Telemedicine Practice Guidelines 2020, online consultation is legal if done by an MCI-registered doctor.",
                },
                {
                  q: "Are digital prescriptions valid in pharmacies?",
                  a: "Yes, all prescriptions are digitally signed and accepted at pharmacies.",
                },
                {
                  q: "When will I receive my refund?",
                  a: "Usually within 3–7 working days, credited to the same payment method.",
                },
                {
                  q: "Is the app free or paid?",
                  a: "App download and sign-up are free. Consultation charges vary by doctor’s fees.",
                },
              ]}
            />
          </section>
        </div>
      </main>
    </section>
  );
};

// Reusable Article component
const Article = ({ id, title, desc, details }) => (
  <article id={id} className="bg-white p-6 rounded-xl shadow-sm mt-10 ">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-sm text-gray-600 mt-2">{desc}</p>
    <div className="mt-4 space-y-3">
      {details.map((item, index) => (
        <details key={index} className="p-4 border rounded-lg">
          <summary className="font-medium cursor-pointer">{item.q}</summary>
          <div className="mt-2 text-sm text-gray-700">{item.a}</div>
        </details>
      ))}
    </div>
  </article>
);

export default Help;
