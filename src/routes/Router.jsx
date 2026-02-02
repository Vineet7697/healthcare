import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../utils/Layout/Layout";

// 🧩 Pages & Components

import LandingPage from "../landingpage/LandingPage";
import DoctorDetailPage from "../module/patient/pages/DoctorDetailPage";

// Doctor Dashboard Section
import CurrentQueuePage from "../module/doctor/pages/CurrentQueuePage";
import PatientListPage from "../module/doctor/pages/PatientListPage";
import PatientQueuePage from "../module/patient/pages/Today_Patient_QueuePage";
import DoctorChangePassword from "../module/doctor/pages/DoctorChangePassword";
import Notification from "../module/doctor/pages/Notification";
import DoctorProfileSection from "../module/doctor/pages/DoctorProfileSection";
import DoctorDashboard from "../module/doctor/DoctorDashboard";
import LiveQueuePage from "../module/doctor/pages/LiveQueuePage";
import DoctorQRCodePage from "../module/doctor/pages/DoctorQRCodePage";
import ManualBookingPage from "../module/doctor/pages/ManualBookingPage";

import ApprovalStatusPage from "../views/doctor/ApprovalStatusPage";
import ForgotPasswordPage from "../views/doctor/ForgotPasswordPage";
import DoctorLoginPage from "../views/doctor/DoctorLoginPage";
import DoctorRegistrationPage from "../views/doctor/DoctorRegistrationPage";

import ClientLoginPage from "../views/patients/PatientLoginPage";
import ClientRegisterPage from "../views/patients/PatientRegisterPage";

// Patients Dashboard Section

import ProfileSection from "../module/patient/pages/ProfileSection";
import PatientDashboard from "../module/patient/PatientDashboard";
import FamilyMembers from "../module/patient/pages/FamilyMembers";
import Cards from "../module/patient/pages/Cards";
import BookAppointmentPage from "../module/patient/pages/BookAppointmentPage";
import AddFamilyPage from "../module/patient/pages/AddFamilyPage";
import HealthTimeline from "../module/patient/pages/HealthTimeline";
import MedicalRecords from "../module/patient/pages/MedicalRecords";

import About from "../landingpage/About";
import Service from "../landingpage/Service";
import Contact from "../landingpage/Contact";
import Help from "../landingpage/Help";
import ChangePassword from "../module/patient/pages/ChangePassword";

// 🧭 New Dashboard Layout (for logged-in users)
import DashboardLayout from "../utils/Layout/DashboardLayout";
import AdminLayout from "../utils/Layout/AdminLayout";
import LogoutModal from "../utils/LogoutModal";
import AppointmentsPage from "../module/doctor/pages/AppointmentsPage";
import DoctorNotesPage from "../module/doctor/pages/DoctorNotesPage";
import Myappointmentpage from "../module/patient/pages/Myappointmentpage";
// import OnlineConsultation from "../module/patient/pages/OnlineConsultation";
import PatientbookAppointment from "../module/patient/pages/PatientbookAppointment";
import IncomingAppointments from "../module/doctor/pages/IncomingAppointments";
import AdminDashboard from "../admin/AdminDashboard";
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminPatients from "../admin/AdminPatients";
import AdminAppointments from "../admin/AdminAppointments";
import VisitSummaryPage from "../module/doctor/pages/VisitSummaryPage";
// import ConsultationTabs from "../module/patient/pages/ConsultationTabs";

import AdminDoctor from "../admin/AdminDoctor";
// import ProtectedRoute from "../routes/ProtectedRoute";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Public Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />

          <Route path="clientloginpage" element={<ClientLoginPage />} />
          <Route path="clientregisterpage" element={<ClientRegisterPage />} />

          <Route path="about" element={<About />} />
          <Route path="service" element={<Service />} />
          <Route path="contact" element={<Contact />} />
          <Route path="help" element={<Help />} />
          <Route path="doctorloginpage" element={<DoctorLoginPage />} />
          <Route
            path="doctorregistrationpage"
            element={<DoctorRegistrationPage />}
          />
          <Route path="approvalstatuspage" element={<ApprovalStatusPage />} />
          <Route path="forgotpassword" element={<ForgotPasswordPage />} />
        </Route>

        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="appointments" element={<AdminAppointments />} />
        </Route> */}

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
          <Route path="patients" element={<AdminPatients />} />
          <Route path="appointments" element={<AdminAppointments />} />
           <Route path="doctors" element={<AdminDoctor />} />

        </Route>

        {/* 🩺 Doctor Dashboard Layout (with HeaderDashboard + Sidebar) */}
        <Route path="/doctordashboard" element={<DashboardLayout />}>
          <Route index element={<DoctorDashboard />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="patients" element={<PatientListPage />} />
          <Route path="queue" element={<CurrentQueuePage />} />
          <Route path="visit-summary/:id" element={<VisitSummaryPage />} />
          <Route
            path="/doctordashboard/incoming"
            element={<IncomingAppointments />}
          />
          <Route path="notifications" element={<Notification />} />
          <Route
            path="doctorprofilesection"
            element={<DoctorProfileSection />}
          />
          <Route
            path="doctorchangepassword"
            element={<DoctorChangePassword />}
          />
          <Route path="livequeue" element={<LiveQueuePage />} />
          <Route path="qrcode" element={<DoctorQRCodePage />} />
          <Route path="manualbooking" element={<ManualBookingPage />} />
          <Route path="appointment" element={<AppointmentsPage />} />
          <Route path="doctornotes" element={<DoctorNotesPage />} />
        </Route>

        {/* 👩‍🦰 Client Dashboard Layout (Sidebar) */}

        <Route path="/client" element={<DashboardLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="book-appointment" element={<PatientbookAppointment />} />
          <Route path="myappointment" element={<Myappointmentpage />} />
          <Route path="addfamilypage" element={<AddFamilyPage />} />
          <Route path="edit-family/:id" element={<AddFamilyPage />} />
          <Route path="medicalrecords" element={<MedicalRecords />} />
          <Route path="patientqueuepage" element={<PatientQueuePage />} />
          <Route path="timeline" element={<HealthTimeline />} />
        </Route>

        {/* 👩‍🦰 Client Dashboard Layout (with HeaderDashboard*/}
        <Route path="/client" element={<DashboardLayout />}>
          <Route index element={<ProfileSection />} />
          <Route path="profile" element={<ProfileSection />} />
          <Route path="family" element={<FamilyMembers />} />
          <Route path="changepassword" element={<ChangePassword />} />
          <Route path="cards" element={<Cards />} />
          <Route
            path="bookappointmentpage/:id"
            element={<BookAppointmentPage />}
          />

          <Route path="doctor-profile/:id" element={<DoctorDetailPage />} />
        </Route>

        {/* Misc */}
        <Route path="logoutmodal" element={<LogoutModal />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
