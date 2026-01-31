import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0072BC] text-white pt-10 pb-6">
      {/* TOP GRID SECTION */}
      <div className="
        max-w-7xl mx-auto px-6
        grid grid-cols-2 gap-6
        sm:grid-cols-3
        lg:grid-cols-5
        text-sm sm:text-base
      ">
        {/* Yo Doctor */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-base sm:text-lg">Yo Doctor</span>
          <a href="/about" className="hover:text-gray-300">About</a>
          <a href="/service" className="hover:text-gray-300">Services</a>
          <a href="/contact" className="hover:text-gray-300">Contact</a>
          <a href="/help" className="hover:text-gray-300">Help</a>
        </div>

        {/* For Patients */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-base sm:text-lg">For Patients</span>
          <a href="#" className="hover:text-gray-300">Ask Free Health Questions</a>
          <a href="#" className="hover:text-gray-300">Search for Doctors</a>
          <a href="#" className="hover:text-gray-300">Search for Clinics</a>
          <a href="#" className="hover:text-gray-300">Search for Hospitals</a>
        </div>

        {/* For Doctors */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-base sm:text-lg">For Doctors</span>
          <a href="#" className="hover:text-gray-300">Yo Doctor Consult</a>
          <a href="#" className="hover:text-gray-300">Yo Doctor Health Feed</a>
          <a href="#" className="hover:text-gray-300">Yo Doctor Profile</a>
          <a href="#" className="hover:text-gray-300">For Clinics</a>
        </div>

        {/* For Hospitals */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-base sm:text-lg">For Hospitals</span>
          <a href="#" className="hover:text-gray-300">Insta by Yo Doctor</a>
          <a href="#" className="hover:text-gray-300">Yo Doctor Profile</a>
          <a href="#" className="hover:text-gray-300">Yo Doctor Reach</a>
        </div>

        {/* Social */}
        <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
          <span className="font-semibold text-base sm:text-lg">Social</span>
          <a href="#" className="hover:text-gray-300">Facebook</a>
          <a href="#" className="hover:text-gray-300">LinkedIn</a>
          <a href="#" className="hover:text-gray-300">YouTube</a>
          <a href="#" className="hover:text-gray-300">Instagram</a>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-400 mt-8 mb-6 mx-6"></div>

      {/* BOTTOM SECTION */}
      <div className="flex flex-col items-center text-center gap-2 px-4">
        <span className="text-sm sm:text-base">
          🩺 Yo Doctor — Smart care with a human touch
        </span>
        <p className="text-[#B8BBD9] text-xs sm:text-sm">
          © 2026 <span className="font-semibold">Yo Doctor</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
