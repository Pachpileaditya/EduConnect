import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./Component/auth/Login";
import Register from "./Component/auth/Register";
import ResetPassword from "./Component/auth/ResetPassword";

// Student Components
import StudentDashboard from "./Component/Student/StudentDashboard";
import StudentContent from "./Component/Student/StudentContent";
import StudentQuestion from "./Component/Student/StudentQuestion";
import StudentProfile from "./Component/Student/StudentProfile"; // Added Profile component

// Teacher Components
import TeacherDashboard from "./Component/Teacher/TeacherDashboard";
import TeacherContent from "./Component/Teacher/TeacherContent";
import TeacherQuestion from "./Component/Teacher/TeacherQuestion";
import TeacherProfile from "./Component/Teacher/TeacherProfile"; // Added Profile component

// HOD Components
import HodDashboard from "./Component/Hod/HodDashboard";

// // Admin Components
// import AdminDashboard from "./Component/Admin/AdminDashboard"; // Added Admin Dashboard
// import AdminProfile from "./Component/Admin/AdminProfile"; // Added Admin Profile

import LandingPage from './Component/LandingPage';
import Chatbot from './Component/Chatbot';

const App = () => {
  return (
    <div className="app-root light-theme" style={{ minHeight: "100vh" }}>
    <Router>
      <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Redirect old HOD registration route to new unified registration */}
        <Route path="/register/hod" element={<Navigate to="/register" replace />} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher/content/:subjectId" element={<TeacherContent />} />
        <Route path="/teacher/queries/:teacherId/:subjectId" element={<TeacherQuestion />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/content/:studentId/:subjectId" element={<StudentContent />} />
        <Route path="/student/queries" element={<StudentQuestion />} />
        <Route path="/student/profile" element={<StudentProfile />} /> {/* Added Student Profile */}

        {/* HOD Routes */}
        <Route path="/hod" element={<HodDashboard />} />

        {/* Admin Routes */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> Admin Dashboard */}
        {/* <Route path="/admin/profile" element={<AdminProfile />} /> Admin Profile */}

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
      <Chatbot />
    </div>
  );
};

export default App;
