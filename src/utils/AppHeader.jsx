
import { useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaGlobe } from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

/* ================= SAFE USER FETCH ================= */
const getStoredUser = () => {
  const raw = localStorage.getItem("loggedInUser");

  if (!raw || raw === "undefined") return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Invalid loggedInUser JSON", err);
    localStorage.removeItem("loggedInUser");
    return null;
  }
};

const AppHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const loggedInUser = getStoredUser();
  const userRole = loggedInUser?.role;

  const { language, changeLanguage, lang } = useLanguage();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-3 flex items-center justify-between z-50">
      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <div className="md:hidden mr-2">
          {menuOpen ? (
            <FaTimes
              size={22}
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer text-gray-800"
            />
          ) : (
            <FaBars
              size={22}
              onClick={() => setMenuOpen(true)}
              className="cursor-pointer text-gray-800"
            />
          )}
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/yo.png" alt="Yo Doctor" className="h-10" />
        </Link>
      </div>

      {/* ================= CENTER (Desktop Nav) ================= */}
      <div className="hidden md:flex gap-8 font-medium">
        {[
          { name: lang[language].about, path: "/about" },
          { name: lang[language].services, path: "/service" },
          { name: lang[language].contact, path: "/contact" },
          { name: lang[language].help, path: "/help" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `text-black hover:text-blue-600 pb-1 transition
               ${
                 isActive
                   ? "border-b-2 border-[#14BEF0]"
                   : "border-b-2 border-transparent"
               }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <button
          onClick={() => changeLanguage(language === "en" ? "hi" : "en")}
          title={language === "en" ? "Switch to Hindi" : "Switch to English"}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <FaGlobe size={18} className="text-gray-700" />
        </button>

        {/* Download Button */}
        <button className="px-5 py-2 rounded-full bg-[#00b3ff] text-white hover:bg-[#009ee0] transition">
          {lang[language].download}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <FaTimes
            size={22}
            className="cursor-pointer text-gray-700"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        <ul className="flex flex-col mt-4 space-y-3 px-5 text-gray-700 font-medium">
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            {lang[language].about}
          </Link>
          <Link to="/service" onClick={() => setMenuOpen(false)}>
            {lang[language].services}
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            {lang[language].contact}
          </Link>
          <Link to="/help" onClick={() => setMenuOpen(false)}>
            {lang[language].help}
          </Link>
        </ul>
      </div>
    </nav>
  );
};

export default AppHeader;
