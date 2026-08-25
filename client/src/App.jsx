import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Protected from "./components/Protected";
import SelectRole from "./pages/SelectRole";

import Home from "./pages/Home.jsx";
// import Jobs from "./pages/Jobs";
// import JobDetails from "./pages/JobDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<Signup />} />

        <Route path="/select-role" element={<SelectRole />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />

        {/* <Route
          path="/jobs"
          element={
            <Protected>
              <Jobs />
            </Protected>
          }
        /> */}

        {/* <Route
          path="/jobs/:id"
          element={
            <Protected>
              <JobDetails />
            </Protected>
          }
        /> */}

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
