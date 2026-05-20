// import { BrowserRouter, Route, Routes,useLocation } from "react-router-dom";
// import { useEffect } from "react";

// import Layout from "../utils/Layout/Layout";
// // 🧩 Pages & Components

// import LandingPage from "../landingpage/LandingPage";
// import DoctorDetailPage from "../module/patient/pages/DoctorDetailPage";

// // Doctor Dashboard Section
// import CurrentQueuePage from "../module/doctor/pages/CurrentQueuePage";
// import PatientListPage from "../module/doctor/pages/PatientListPage";
// import PatientQueuePage from "../module/patient/pages/Today_Patient_QueuePage";
// import DoctorChangePassword from "../module/doctor/pages/DoctorChangePassword";
// import Notification from "../module/doctor/pages/Notification";
// import DoctorProfileSection from "../module/doctor/pages/DoctorProfileSection";
// import DoctorDashboard from "../module/doctor/DoctorDashboard";
// import TodaysQueue from "../module/doctor/pages/TodaysQueue";
// import DoctorQRCodePage from "../module/doctor/pages/DoctorQRCodePage";
// import ManualBookingPage from "../module/doctor/pages/ManualBookingPage";

// import ApprovalStatusPage from "../views/doctor/ApprovalStatusPage";
// import DoctorLoginPage from "../views/doctor/DoctorLoginPage";

// import ClientLoginPage from "../views/patients/PatientLoginPage";
// import ClientRegisterPage from "../views/patients/PatientRegisterPage";

// // Patients Dashboard Section

// import ProfileSection from "../module/patient/pages/ProfileSection";
// import PatientDashboard from "../module/patient/PatientDashboard";
// import FamilyMembers from "../module/patient/pages/FamilyMembers";
// import Cards from "../module/patient/pages/Cards";
// import BookAppointmentPage from "../module/patient/pages/BookAppointmentPage";
// import AddFamilyPage from "../module/patient/pages/AddFamilyPage";

// import About from "../landingpage/About";
// import Service from "../landingpage/Service";
// import Contact from "../landingpage/Contact";
// import Help from "../landingpage/Help";
// import ChangePassword from "../module/patient/pages/ChangePassword";

// // 🧭 New Dashboard Layout (for logged-in users)
// import DashboardLayout from "../utils/Layout/DashboardLayout";
// import LogoutModal from "../utils/LogoutModal";
// import AppointmentHistory from "../module/doctor/pages/AppointmentHistory";
// import Myappointmentpage from "../module/patient/pages/Myappointmentpage";
// import PatientbookAppointment from "../module/patient/pages/PatientbookAppointment";
// import IncomingAppointments from "../module/doctor/pages/IncomingAppointments";
// import AdminDashboard from "../admin/AdminDashboard";
// import ProtectedRoute from "../routes/ProtectedRoute";

// import AdminDoctor from "../admin/AdminDoctor";
// import AdminDoctorVerification from "../admin/AdminDoctorVerification";
// import Doctordetails from "../admin/Doctordetails";
// import DoctorRegistration from "../views/doctor/DoctorRegistration";
// import ComingSoon from "../landingpage/commingsoon/ComingSoon";
// import AddPrescription from "../module/doctor/pages/AddPrescription";
// import DoctorReviews from "../module/doctor/pages/DoctorReviews";
// import ForgotPassword from "../views/doctor/ForgotPassword";
// import ResetPassword from "../views/doctor/ResetPassword";
// import AdminHeaderDashboard from "../utils/AdminHeaderDashboard";
// import QRRedirect from "../module/doctor/pages/QRRedirect";
// import ContactRequests from "../admin/ContactRequests";
// import Mycertificate from "../module/patient/pages/Mycertificate";
// import RequestCertificate from "../module/patient/pages/RequestCertificate";
// import Certificaterequest from "../module/doctor/pages/Certificaterequest";
// import VerifyCertificate from "../utils/VerifyCertificate";
// import PatientBookHomeService from "../landingpage/PatientBookHomeService";
// import AdminHomeCareBookings from "../admin/AdminHomeCareBookings";

// const RouteHandler = () => {
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
// console.log("Checking token on route change:", token);
//     if (token) return;
//     console.log("No token found, clearing storage...");

//     const isDoctorRegistrationRoute =
//       location.pathname.startsWith("/doctorregistration");

//     if (!isDoctorRegistrationRoute) {
//       localStorage.removeItem("doctorFormData");
//       sessionStorage.clear();
//       localStorage.clear();
//     }
//   }, [location.pathname]);
// };
// const Router = () => {


//   return (
//     <BrowserRouter>
//     <RouteHandler />
//       <Routes>
//         {/* 🌐 Public Layout */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<LandingPage />} />

//           <Route path="clientloginpage" element={<ClientLoginPage />} />
//           <Route path="clientregisterpage" element={<ClientRegisterPage />} />
//           <Route path="/qr-redirect" element={<QRRedirect />} />
//           <Route path="about" element={<About />} />
//           <Route path="service" element={<Service />} />
//           <Route path="contact" element={<Contact />} />
//           <Route path="help" element={<Help />} />
//           <Route path="doctorloginpage" element={<DoctorLoginPage />} />

//           <Route path="doctorregistration" element={<DoctorRegistration />} />
//           <Route path="approvalstatuspage" element={<ApprovalStatusPage />} />

//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/home-service-booking" element={<PatientBookHomeService />} />

//           <Route
//             path="/verify/:certificateId"
//             element={<VerifyCertificate />}
//           />
//         </Route>

//         {/* comming soon section */}
//         <Route path="/lab-test" element={<ComingSoon />} />
//         <Route path="/medicine" element={<ComingSoon />} />
//         <Route path="/blood-donor" element={<ComingSoon />} />

//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute allowedRoles={["ADMIN"]}>
//               <DashboardLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<AdminDashboard />} />
//           <Route path="dashboard" element={<AdminDashboard />} />

//           <Route path="doctors" element={<AdminDoctor />} />
//           <Route
//             path="doctorsverification/:id"
//             element={<AdminDoctorVerification />}
//           />
//           <Route path="doctorsdetails/:id" element={<Doctordetails />} />
//           <Route path="changepassword" element={<AdminHeaderDashboard />} />
//           <Route path="contact-requests" element={<ContactRequests />} />
//           <Route path="homecare-bookings" element={<AdminHomeCareBookings />} />
//         </Route>

//         {/* 🩺 Doctor Dashboard Layout (with HeaderDashboard + Sidebar) */}
//         <Route
//           path="/doctordashboard"
//           element={
//             <ProtectedRoute allowedRoles={["DOCTOR"]}>
//               <DashboardLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<DoctorDashboard />} />
//           <Route path="dashboard" element={<DoctorDashboard />} />
//           <Route path="patients" element={<PatientListPage />} />
//           <Route path="queue" element={<CurrentQueuePage />} />
//           <Route path="incoming" element={<IncomingAppointments />} />
//           <Route path="notifications" element={<Notification />} />
//           <Route
//             path="doctorprofilesection"
//             element={<DoctorProfileSection />}
//           />
//           <Route
//             path="doctorchangepassword"
//             element={<DoctorChangePassword />}
//           />
//           <Route path="livequeue" element={<TodaysQueue />} />
//           <Route path="qrcode" element={<DoctorQRCodePage />} />
//           <Route path="manualbooking" element={<ManualBookingPage />} />
//           <Route path="appointment" element={<AppointmentHistory />} />
//           <Route path="prescription/:id" element={<AddPrescription />} />
//           <Route path="certificaterequest" element={<Certificaterequest />} />

//           <Route path="reviews" element={<DoctorReviews />} />
//         </Route>

//         {/* 👩‍🦰 Client Dashboard Layout (Sidebar) */}

//         <Route
//           path="/client"
//           element={
//             <ProtectedRoute allowedRoles={["PATIENT"]}>
//               <DashboardLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route index element={<PatientDashboard />} />
//           <Route path="dashboard" element={<PatientDashboard />} />

//           <Route path="profile" element={<ProfileSection />} />
//           <Route path="family" element={<FamilyMembers />} />
//           <Route path="changepassword" element={<ChangePassword />} />
//           <Route path="cards" element={<Cards />} />
//           <Route path="apply-certificate" element={<RequestCertificate />} />

//           <Route path="book-appointment" element={<PatientbookAppointment />} />
//           <Route
//             path="bookappointmentpage/:doctorId"
//             element={<BookAppointmentPage />}
//           />

//           <Route path="myappointment" element={<Myappointmentpage />} />
//           <Route path="mycertificate" element={<Mycertificate />} />
//           <Route path="addfamilypage" element={<AddFamilyPage />} />
//           <Route path="edit-family/:id" element={<AddFamilyPage />} />

//           <Route path="patientqueuepage" element={<PatientQueuePage />} />

//           <Route path="doctor-profile/:id" element={<DoctorDetailPage />} />
//         </Route>

//         {/* Misc */}
//         <Route path="logoutmodal" element={<LogoutModal />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default Router;



import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../utils/Layout/Layout";

// 🧩 Pages & Components

import LandingPage from "../landingpage/LandingPage";
import DoctorDetailPage from "../module/patient/pages/DoctorDetailPage";

// Doctor Dashboard Section
import PatientListPage from "../module/doctor/pages/PatientListPage";
import PatientQueuePage from "../module/patient/pages/Today_Patient_QueuePage";
import DoctorChangePassword from "../module/doctor/pages/DoctorChangePassword";
import Notification from "../module/doctor/pages/Notification";
import DoctorProfileSection from "../module/doctor/pages/DoctorProfileSection";
import DoctorDashboard from "../module/doctor/DoctorDashboard";
import TodaysQueue from "../module/doctor/pages/TodaysQueue";
import DoctorQRCodePage from "../module/doctor/pages/DoctorQRCodePage";
import ManualBookingPage from "../module/doctor/pages/ManualBookingPage";

import ApprovalStatusPage from "../views/doctor/ApprovalStatusPage";
import DoctorLoginPage from "../views/doctor/DoctorLoginPage";

import ClientLoginPage from "../views/patients/PatientLoginPage";
import ClientRegisterPage from "../views/patients/PatientRegisterPage";

// Patients Dashboard Section

import ProfileSection from "../module/patient/pages/ProfileSection";
import PatientDashboard from "../module/patient/PatientDashboard";
import FamilyMembers from "../module/patient/pages/FamilyMembers";
import Cards from "../module/patient/pages/Cards";
import BookAppointmentPage from "../module/patient/pages/BookAppointmentPage";
import AddFamilyPage from "../module/patient/pages/AddFamilyPage";

import About from "../landingpage/About";
import Service from "../landingpage/Service";
import Contact from "../landingpage/Contact";
import Help from "../landingpage/Help";
import ChangePassword from "../module/patient/pages/ChangePassword";

// 🧭 New Dashboard Layout (for logged-in users)
import DashboardLayout from "../utils/Layout/DashboardLayout";
import LogoutModal from "../utils/LogoutModal";
import AppointmentHistory from "../module/doctor/pages/AppointmentHistory";
import Myappointmentpage from "../module/patient/pages/Myappointmentpage";
import PatientbookAppointment from "../module/patient/pages/PatientbookAppointment";
import IncomingAppointments from "../module/doctor/pages/IncomingAppointments";
import AdminDashboard from "../admin/AdminDashboard";
import ProtectedRoute from "../routes/ProtectedRoute";

import AdminDoctor from "../admin/AdminDoctor";
import AdminDoctorVerification from "../admin/AdminDoctorVerification";
import Doctordetails from "../admin/Doctordetails";
import DoctorRegistration from "../views/doctor/DoctorRegistration";
import ComingSoon from "../landingpage/commingsoon/ComingSoon";
import AddPrescription from "../module/doctor/pages/AddPrescription";
import DoctorReviews from "../module/doctor/pages/DoctorReviews";
import ForgotPassword from "../views/doctor/ForgotPassword";
import ResetPassword from "../views/doctor/ResetPassword";
import AdminHeaderDashboard from "../utils/AdminHeaderDashboard";
import QRRedirect from "../module/doctor/pages/QRRedirect";
import ContactRequests from "../admin/ContactRequests";
import Mycertificate from "../module/patient/pages/Mycertificate";
import RequestCertificate from "../module/patient/pages/RequestCertificate";
import Certificaterequest from "../module/doctor/pages/Certificaterequest";
import VerifyCertificate from "../utils/VerifyCertificate";
import PatientBookHomeService from "../landingpage/PatientBookHomeService";
import AdminHomeCareBookings from "../admin/AdminHomeCareBookings";
import RazorpayPaymentPage from "../pages/RazorpayPaymentPage";
import PaymentPage from "../pages/PaymentPage";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed";
import MySubscription from "../pages/MySubscription";
import LabRegistration from "../views/lab/LabRegistration";
import BookLabTest from "../views/lab/BookLabTest";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="payment" element={<RazorpayPaymentPage />} />
          <Route path="subscription" element={<PaymentPage/>} />
         
          
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-failed" element={<PaymentFailed />} />

          <Route path="clientloginpage" element={<ClientLoginPage />} />
          <Route path="clientregisterpage" element={<ClientRegisterPage />} />
          <Route path="/qr-redirect" element={<QRRedirect />} />
          <Route path="about" element={<About />} />
          <Route path="service" element={<Service />} />
          <Route path="contact" element={<Contact />} />
          <Route path="help" element={<Help />} />
          <Route path="doctorloginpage" element={<DoctorLoginPage />} />

          <Route path="doctorregistration" element={<DoctorRegistration />} />
          <Route path="approvalstatuspage" element={<ApprovalStatusPage />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home-service-booking" element={<PatientBookHomeService />} />
           <Route path="labregister" element={<LabRegistration />} />
            <Route path="book-labtest" element={<BookLabTest />} />


          <Route
            path="/verify/:certificateId"
            element={<VerifyCertificate />}
          />
        </Route>
       
        {/* comming soon section */}
        <Route path="/medicine" element={<ComingSoon />} />
        <Route path="/blood-donor" element={<ComingSoon />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="doctors" element={<AdminDoctor />} />
          <Route
            path="doctorsverification/:id"
            element={<AdminDoctorVerification />}
          />
          <Route path="doctorsdetails/:id" element={<Doctordetails />} />
          <Route path="changepassword" element={<AdminHeaderDashboard />} />
          <Route path="contact-requests" element={<ContactRequests />} />
          <Route path="homecare-bookings" element={<AdminHomeCareBookings />} />
        </Route>

        {/* 🩺 Doctor Dashboard Layout (with HeaderDashboard + Sidebar) */}
        <Route
          path="/doctordashboard"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DoctorDashboard />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<PatientListPage />} />
          <Route path="incoming" element={<IncomingAppointments />} />
          <Route path="notifications" element={<Notification />} />
          <Route
            path="doctorprofilesection"
            element={<DoctorProfileSection />}
          />
          <Route
            path="doctorchangepassword"
            element={<DoctorChangePassword />}
          />
          <Route path="livequeue" element={<TodaysQueue />} />
          <Route path="qrcode" element={<DoctorQRCodePage />} />
          <Route path="manualbooking" element={<ManualBookingPage />} />
          <Route path="appointment" element={<AppointmentHistory />} />
          <Route path="prescription/:id" element={<AddPrescription />} />
          <Route path="certificaterequest" element={<Certificaterequest />} />
           <Route path="mysubscription" element={<MySubscription />} />

          <Route path="reviews" element={<DoctorReviews />} />
        </Route>

        {/* 👩‍🦰 Client Dashboard Layout (Sidebar) */}

        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PatientDashboard />} />
          <Route path="dashboard" element={<PatientDashboard />} />

          <Route path="profile" element={<ProfileSection />} />
          <Route path="family" element={<FamilyMembers />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="cards" element={<Cards />} />
          <Route path="apply-certificate" element={<RequestCertificate />} />

          <Route path="book-appointment" element={<PatientbookAppointment />} />
          <Route
            path="bookappointmentpage/:doctorId"
            element={<BookAppointmentPage />}
          />

          <Route path="myappointment" element={<Myappointmentpage />} />
          <Route path="mycertificate" element={<Mycertificate />} />
          <Route path="addfamilypage" element={<AddFamilyPage />} />
          <Route path="edit-family/:id" element={<AddFamilyPage />} />

          <Route path="patientqueuepage" element={<PatientQueuePage />} />

          <Route path="doctor-profile/:id" element={<DoctorDetailPage />} />
        </Route>

        {/* Misc */}
        <Route path="logoutmodal" element={<LogoutModal />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
