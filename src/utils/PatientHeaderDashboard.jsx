import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaBell,FaSignOutAlt  } from "react-icons/fa";
import LogoutModal from "../utils/LogoutModal";

/* ================= SAFE STORAGE ================= */
const getStoredUser = () => {
  const raw = localStorage.getItem("loggedInUser");
  if (!raw || raw === "undefined") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const PatientHeaderDashboard = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  /* 🔴 ALL HOOKS MUST BE HERE (TOP LEVEL) */
  const [loggedInUser, setLoggedInUser] = useState(getStoredUser);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || DEFAULT_AVATAR
  );

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  console.log("HEADER mounted, user 👉", loggedInUser);

  /* ================= SYNC PROFILE IMAGE ================= */
const handleNavigate = (path) => {
  setProfileOpen(false);
  setNotificationOpen(false);
  navigate(path);
};


  useEffect(() => {
    const syncImage = () => {
      const img = localStorage.getItem("profileImage");
      if (img) setProfileImage(img);
    };

    window.addEventListener("profileImageUpdated", syncImage);
    return () =>
      window.removeEventListener("profileImageUpdated", syncImage);
  }, []);

  /* ================= USER SYNC ================= */
  useEffect(() => {
    const syncUser = () => setLoggedInUser(getStoredUser());

    window.addEventListener("storage", syncUser);
    window.addEventListener("userLogin", syncUser);
    window.addEventListener("userLogout", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userLogin", syncUser);
      window.removeEventListener("userLogout", syncUser);
    };
  }, []);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current?.contains(e.target) ||
        notificationRef.current?.contains(e.target)
      )
        return;

      setProfileOpen(false);
      setNotificationOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  /* ================= HANDLERS ================= */
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("profileImage");

    setLoggedInUser(null);
    setProfileImage(DEFAULT_AVATAR);

    window.dispatchEvent(new Event("userLogout"));
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 z-50 h-20 bg-white border-b border-gray-200
      transition-all duration-300
      ${
        isSidebarOpen
          ? "md:left-64 md:w-[calc(100%-16rem)]"
          : "md:left-20 md:w-[calc(100%-5rem)]"
      }
      left-0 w-full`}
    >
      <div className="h-full px-4 flex items-center">
        {/* ⬅️ Sidebar Toggle */}
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-xl text-gray-700 hover:text-blue-600 transition"
          >
            <FaBars />
          </button>
        </div>

        {/* 🎯 Center */}
        <div className="flex-1 flex justify-center gap-4">
          <button
            onClick={() => navigate("/client/book-appointment")}
            className="hidden md:flex px-6 py-2 rounded-full
            bg-linear-to-br from-[#2277f7] to-[#52abd4]
            text-white text-sm font-medium"
          >
            Book Appointment
          </button>
        </div>

        {/* ➡️ Right */}
        <div className="flex items-center gap-3 relative">
          {/* 🔔 Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setNotificationOpen((p) => !p);
                setProfileOpen(false);
              }}
              className="relative text-xl text-gray-700 hover:text-blue-600"
            >
              <FaBell />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-lg border z-20">
                <div className="p-3 font-semibold border-b">Notifications</div>
                <ul className="max-h-64 overflow-y-auto">
                  {notifications.map((note) => (
                    <li
                      key={note.id}
                      className="px-4 py-2 text-sm border-b hover:bg-gray-50"
                    >
                      <p>{note.text}</p>
                      <p className="text-xs text-gray-400">{note.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 👤 Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setProfileOpen((p) => !p);
                setNotificationOpen(false);
              }}
              className="p-1 rounded-full hover:bg-gray-100 transition"
            >
              <img
                src={profileImage}
                alt="avatar"
                className="w-8 h-8 rounded-full border object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-20">
                <ul className="py-2 text-sm">
                  <li
                    onClick={() => handleNavigate("/client/profile")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    👤 My Profile
                  </li>
                  <li
                    onClick={() => handleNavigate("/client/changepassword")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    🔒 Change Password
                  </li>
                  <li
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center gap-3 w-full text-sm px-5 py-2  text-red-600 hover:bg-gray-100 cursor-pointer border-t"
                  >
                    <FaSignOutAlt /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
};

export default PatientHeaderDashboard;
