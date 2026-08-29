import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import EmployerRegister from "./pages/auth/EmployerRegister";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

// Components & Route Protectors
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

// General & Discovery Pages
import SelectRole from "./pages/SelectRole";
import Home from "./pages/Home.jsx";
import InternshipDiscoveryPage from "./pages/internships/InternshipDiscoveryPage";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";

// Fresher Pages
import FresherDashboard from "./pages/fresher/FresherDashboard";
import FresherProfile from "./pages/fresher/FresherProfile";

// Professional Pages
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard";
import ProfessionalProfile from "./pages/professional/ProfessionalProfile";

// Employer Pages
import EmployerProfile from "./pages/employer/EmployerProfile";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import CompanyPublicProfile from "./pages/employer/CompanyPublicProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================= */}
        {/* PUBLIC & DISCOVERY ROUTES     */}
        {/* ============================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<Signup />} />
        <Route path="/register/employer" element={<EmployerRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/home" element={<Home />} />
        <Route path="/companies/:companyId" element={<CompanyPublicProfile />} />

        {/* Category-Based Internship Discovery Routes */}
        <Route path="/internships" element={<InternshipDiscoveryPage />} />
        <Route path="/internships/work-from-home" element={<InternshipDiscoveryPage />} />
        <Route path="/internships/international" element={<InternshipDiscoveryPage />} />
        <Route path="/internships/latest" element={<InternshipDiscoveryPage />} />
        <Route path="/internships/paid" element={<InternshipDiscoveryPage />} />
        <Route path="/internships/with-job-offer" element={<InternshipDiscoveryPage />} />
        <Route path="/internships/in/:city" element={<InternshipDiscoveryPage />} />
        <Route path="/internships/category/:category" element={<InternshipDiscoveryPage />} />

        {/* ============================= */}
        {/* ROLE PROTECTED: STUDENT       */}
        {/* ============================= */}
        <Route element={<RoleProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>

        {/* ============================= */}
        {/* ROLE PROTECTED: FRESHER       */}
        {/* ============================= */}
        <Route element={<RoleProtectedRoute allowedRoles={["fresher"]} />}>
          <Route path="/fresher/dashboard" element={<FresherDashboard />} />
          <Route path="/fresher/profile" element={<FresherProfile />} />
        </Route>

        {/* ============================= */}
        {/* ROLE PROTECTED: PROFESSIONAL  */}
        {/* ============================= */}
        <Route element={<RoleProtectedRoute allowedRoles={["professional"]} />}>
          <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
          <Route path="/professional/profile" element={<ProfessionalProfile />} />
        </Route>

        {/* ============================= */}
        {/* ROLE PROTECTED: EMPLOYER      */}
        {/* ============================= */}
        <Route element={<RoleProtectedRoute allowedRoles={["employer"]} />}>
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/profile" element={<EmployerProfile />} />
          <Route path="/employer/company" element={<CompanyPublicProfile />} />
        </Route>

        {/* ============================= */}
        {/* DEFAULT & FALLBACK ROUTES     */}
        {/* ============================= */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;