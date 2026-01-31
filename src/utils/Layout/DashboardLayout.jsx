// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../Sidebar";
// import PatientHeaderDashboard from "../PatientHeaderDashboard";
// import DoctorHeaderDashboard from "../DoctorHeaderDashboard";
// import { useState, useEffect } from "react";
// import HealthcareChatbot from "../../yodoctor_chatbot/HealthcareChatbot";

// const getStoredUser = () => {
//   try {
//     return JSON.parse(localStorage.getItem("loggedInUser"));
//   } catch {
//     return null;
//   }
// };

// const DashboardLayout = () => {
//   const navigate = useNavigate();
//   const [loggedInUser, setLoggedInUser] = useState(getStoredUser());
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const role = loggedInUser?.role; // ✅ PATIENT / DOCTOR

//   useEffect(() => {
//     const sync = () => setLoggedInUser(getStoredUser());
//     window.addEventListener("userLogin", sync);
//     window.addEventListener("userLogout", sync);
//     window.addEventListener("storage", sync);
//     return () => {
//       window.removeEventListener("userLogin", sync);
//       window.removeEventListener("userLogout", sync);
//       window.removeEventListener("storage", sync);
//     };
//   }, []);

//   useEffect(() => {
//     if (!localStorage.getItem("token")) navigate("/");
//   }, [navigate]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 h-screen z-40 transition-all
//         ${isSidebarOpen ? "w-64" : "w-20"}`}
//       >
//         <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
//       </aside>

//       {/* Header + Content */}
//       <div
//         className={`transition-all duration-300
//         ${isSidebarOpen ? "ml-60" : "ml-16"}`}
//       >
//         {/* ✅ ROLE BASED HEADER */}
//         {role === "PATIENT" && (
//           <PatientHeaderDashboard
//             toggleSidebar={() => setIsSidebarOpen((p) => !p)}
//             isSidebarOpen={isSidebarOpen}
//           />
//         )}

//         {role === "DOCTOR" && (
//           <DoctorHeaderDashboard
//             toggleSidebar={() => setIsSidebarOpen((p) => !p)}
//             isSidebarOpen={isSidebarOpen}
//           />
//         )}

//         <main className="pt-20 p-4">
//           <HealthcareChatbot />
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;



// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../Sidebar";
// import PatientHeaderDashboard from "../PatientHeaderDashboard";
// import DoctorHeaderDashboard from "../DoctorHeaderDashboard";
// import { useState, useEffect } from "react";
// import HealthcareChatbot from "../../yodoctor_chatbot/HealthcareChatbot";

// const getStoredUser = () => {
//   try {
//     return JSON.parse(localStorage.getItem("loggedInUser"));
//   } catch {
//     return null;
//   }
// };

// const DashboardLayout = () => {
//   const navigate = useNavigate();
//   const [loggedInUser, setLoggedInUser] = useState(getStoredUser());

//   // ✅ desktop = open, mobile = closed
//   const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

//   const role = loggedInUser?.role;

//   /* ===== USER SYNC ===== */
//   useEffect(() => {
//     const sync = () => setLoggedInUser(getStoredUser());
//     window.addEventListener("userLogin", sync);
//     window.addEventListener("userLogout", sync);
//     window.addEventListener("storage", sync);
//     return () => {
//       window.removeEventListener("userLogin", sync);
//       window.removeEventListener("userLogout", sync);
//       window.removeEventListener("storage", sync);
//     };
//   }, []);

//   /* ===== AUTH GUARD ===== */
//   useEffect(() => {
//     if (!localStorage.getItem("token")) navigate("/");
//   }, [navigate]);

//   /* ===== RESPONSIVE SIDEBAR STATE ===== */
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setIsSidebarOpen(false);
//       } else {
//         setIsSidebarOpen(true);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ================= DESKTOP / TABLET SIDEBAR ================= */}
//       <div className="hidden md:block">
//         <aside
//           className={`fixed top-0 left-0 h-screen z-40 transition-all
//           ${isSidebarOpen ? "w-64" : "w-20"}`}
//         >
//           <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
//         </aside>
//       </div>

//       {/* ================= MOBILE SIDEBAR DRAWER ================= */}
//       {isSidebarOpen && (
//         <>
//           {/* overlay */}
//           <div
//             className={`
//     fixed inset-0 z-40 md:hidden
//     bg-black/40
//     transition-opacity duration-300
//     ${isSidebarOpen ? "opacity-100" : "opacity-0"}
//   `}
//             onClick={() => setIsSidebarOpen(false)}
//           />

//           {/* drawer */}
//           <div
//             className={`
//     fixed top-0 left-0 z-50 md:hidden
//     transform transition-transform duration-300 ease-in-out
//     ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
//   `}
//           >
//             <Sidebar isOpen={true} setIsOpen={setIsSidebarOpen} />
//           </div>
//         </>
//       )}

//       {/* ================= HEADER + CONTENT ================= */}
//       <div
//         className={`
//           transition-all duration-300
//           ml-0
//           md:${isSidebarOpen ? "ml-60" : "ml-16"}
//         `}
//       >
//         {/* HEADER */}
//         {role === "PATIENT" && (
//           <PatientHeaderDashboard
//             toggleSidebar={() => setIsSidebarOpen((p) => !p)}
//             isSidebarOpen={isSidebarOpen}
//           />
//         )}

//         {role === "DOCTOR" && (
//           <DoctorHeaderDashboard
//             toggleSidebar={() => setIsSidebarOpen((p) => !p)}
//             isSidebarOpen={isSidebarOpen}
//           />
//         )}

//         {/* CONTENT */}
//         <main className="pt-20 p-4">
//           <HealthcareChatbot />
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import PatientHeaderDashboard from "../PatientHeaderDashboard";
import DoctorHeaderDashboard from "../DoctorHeaderDashboard";
import HealthcareChatbot from "../../yodoctor_chatbot/HealthcareChatbot";

/* ================= SAFE STORAGE ================= */
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser"));
  } catch {
    return null;
  }
};

const DashboardLayout = () => {
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState(getStoredUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const role = loggedInUser?.role;

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/");
  }, [navigate]);

  /* ================= USER SYNC ================= */
  useEffect(() => {
    const sync = () => setLoggedInUser(getStoredUser());
    window.addEventListener("userLogin", sync);
    window.addEventListener("userLogout", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("userLogin", sync);
      window.removeEventListener("userLogout", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  /* ================= RESPONSIVE HANDLER ================= */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile); // mobile = closed, desktop = open
    };

    handleResize(); // initial run
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      {!isMobile && (
        <aside
          className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300
          ${isSidebarOpen ? "w-64" : "w-20"}`}
        >
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </aside>
      )}

      {/* ================= MOBILE DRAWER ================= */}
      {isMobile && isSidebarOpen && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* drawer */}
          <div className="fixed top-0 left-0 z-50 w-64 h-screen bg-white">
            <Sidebar isOpen={true} setIsOpen={setIsSidebarOpen} />
          </div>
        </>
      )}

      {/* ================= CONTENT ================= */}
      <div
        className={`transition-all duration-300
        ${!isMobile ? (isSidebarOpen ? "ml-60" : "ml-16") : "ml-0"}`}
      >
        {/* HEADER */}
        {role === "PATIENT" && (
          <PatientHeaderDashboard
            toggleSidebar={() => setIsSidebarOpen((p) => !p)}
            isSidebarOpen={isSidebarOpen}
          />
        )}

        {role === "DOCTOR" && (
          <DoctorHeaderDashboard
            toggleSidebar={() => setIsSidebarOpen((p) => !p)}
            isSidebarOpen={isSidebarOpen}
          />
        )}

        {/* MAIN */}
        <main className="pt-20 p-4">
          <HealthcareChatbot />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
