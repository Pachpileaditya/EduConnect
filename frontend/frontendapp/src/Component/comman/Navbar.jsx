import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // Get role from localStorage
    if (storedRole) {
      setRole(storedRole);
    } else {
      console.warn("Role not found in localStorage.");
    }
  }, []);

  const handleProfileClick = () => {
    if (role === "TEACHER") {
      navigate("/teacher/profile");
    } else if (role === "STUDENT") {
      navigate("/student/profile");
    } else if (role === "ADMIN") {
      navigate("/admin/profile");
    } else {
      alert("Invalid role. Please log in again.");
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleHomeClick = () => {
    if (role === "TEACHER") {
      navigate("/teacher");
    } else if (role === "STUDENT") {
      navigate("/student");
    } else if (role === "ADMIN") {
      navigate("/admin");
    }
  };
  
  

  // Determine if current path is a dashboard
  const isDashboardPath =
    (role === "TEACHER" && location.pathname === "/teacher") ||
    (role === "STUDENT" && location.pathname === "/student") ||
    (role === "ADMIN" && location.pathname === "/admin");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">LMS</a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto d-flex">
            {!isDashboardPath && (
              <button className="btn btn-primary me-2" onClick={handleHomeClick}>
                Home
              </button>
            )}
            <button className="btn btn-light me-2" onClick={handleProfileClick}>
              Profile
            </button>
            <button className="btn btn-danger" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
