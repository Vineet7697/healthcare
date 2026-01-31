// Sidebar.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoutModal from "../utils/LogoutModal";

const Sidebar = ({ isOpen, setIsOpen, activeNav, setActiveNav }) => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  /* ================= SAFE USER ================= */
  let loggedInUser = null;
  try {
    loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  } catch {
    loggedInUser = null;
  }

  const role = loggedInUser?.role; // ✅ DOCTOR / PATIENT

  /* ================= NAV CONFIG ================= */
  const doctorNav = [
    { key: "dashboard", label: "Dashboard", icon: "🏠"  },
    { key: "appointment", label: "Appointments", icon: "📅"  },
    { key: "manualbooking", label: "Manual Booking", icon: "✍️" },
    { key: "doctornotes", label: "Doctor Notes", icon: "📝"  },
  ];

  const patientNav = [
    { key: "dashboard", label: "Dashboard", icon: "🏠"  },
    { key: "family", label: "Family Members", icon: "👨‍👩‍👧"  },
    { key: "myappointment", label: "My Appointments", icon: "📅"  },
    { key: "medicalrecords", label: "Medical Records", icon: "📄" },
    { key: "timeline", label: "Health Timeline", icon: "⏱️" },
  ];

  const navItems = role === "DOCTOR" ? doctorNav : patientNav;

 

  /* ================= HANDLERS ================= */
  const handleNavClick = (item) => {
    setActiveNav?.(item.key);

    // mobile me sidebar close
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }

    if (role === "DOCTOR") {
      navigate(`/doctordashboard/${item.key}`);
    } else {
      navigate(`/client/${item.key}`);
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ================= UI ================= */
  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-screen
          bg-[#0072BC] p-4 overflow-y-auto
          transition-all duration-300
          z-50 md:z-40
          ${isOpen ? "w-64" : "w-20"}
        `}
      >
        {/* ===== LOGO ===== */}
        <div className="mb-6 text-xl font-bold text-[#22C55E] text-center">
          {isOpen ? (
            <span>{role === "DOCTOR" ? "Yo Doctor" : "Yo Client"}</span>
          ) : (
            <span className="flex justify-center">
              <img
                src={
                  role === "DOCTOR"
                    ? "/images/yo_doctor.png"
                    : "/images/yo_client.png"
                }
                alt="logo"
                className="h-8"
              />
            </span>
          )}
        </div>

        {/* ===== NAV ===== */}
        <nav className="space-y-2 px-2">
          {navItems.map((item) => (
            <div
              key={item.key}
              onClick={() => handleNavClick(item)}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                ${
                  activeNav === item.key
                    ? "bg-teal-500 text-white"
                    : "text-white hover:bg-blue-500"
                }
                ${!isOpen && "justify-center"}
              `}
            >
              <div className="text-lg">{item.icon}</div>
              {isOpen && (
                <div className="font-medium whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* ===== LOGOUT MODAL ===== */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Sidebar;
