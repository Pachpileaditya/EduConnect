import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  
  // Test function to verify routing
  const testRouting = () => {
    console.log('Testing routing...');
    navigate('/register');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #00f2ff 0%, #bb86fc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, #bb86fc88 0%, transparent 70%)',
        zIndex: 0,
        animation: 'float1 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-120px',
        right: '-120px',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, #00f2ff88 0%, transparent 70%)',
        zIndex: 0,
        animation: 'float2 10s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(30px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
      <div className="container text-center" style={{ zIndex: 1 }}>
        <div
          className="mx-auto p-5 shadow-lg rounded-4"
          style={{
            background: 'rgba(255,255,255,0.97)',
            maxWidth: 520,
            borderRadius: '2rem',
            boxShadow: '0 8px 32px #bb86fc33',
            width: '100%',
          }}
        >
          {/* Hero Illustration */}
          <div className="mb-4 d-flex justify-content-center">
            <svg width="90%" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: 120, width: '100%', height: 'auto' }}>
              <circle cx="60" cy="60" r="58" stroke="#bb86fc" strokeWidth="4" fill="#f8f9fa" />
              <rect x="35" y="40" width="50" height="40" rx="10" fill="#00f2ff" fillOpacity="0.15" />
              <rect x="45" y="50" width="30" height="20" rx="5" fill="#bb86fc" fillOpacity="0.25" />
              <circle cx="60" cy="60" r="8" fill="#00f2ff" fillOpacity="0.7" />
            </svg>
          </div>
          <h1
            className="mb-2"
            style={{
              fontFamily: 'Orbitron, Poppins, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '2.6rem',
              letterSpacing: '2px',
              color: '#0d1117',
              textShadow: '0 2px 16px #bb86fc44',
              wordBreak: 'break-word',
            }}
          >
            Teacher Student Platform
          </h1>
          <div className="mb-3" style={{ fontSize: '1.1rem', color: '#444', fontWeight: 500 }}>
            <span style={{ color: '#00bcd4', fontWeight: 700 }}>Connect. Learn. Grow.</span>
          </div>
          <p className="mb-5" style={{ fontSize: '1.15rem', color: '#333', wordBreak: 'break-word' }}>
            Empowering learning and teaching with modern tools.<br />
            Please login or register to continue.
          </p>
          <div className="d-flex flex-column gap-3 justify-content-center align-items-center">
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center">
              <button
                className="btn neon-btn btn-lg fw-bold w-100 w-md-auto"
                style={{ fontSize: '1.3rem', borderRadius: '2rem', background: 'linear-gradient(90deg, #00f2ff 0%, #bb86fc 100%)', color: '#fff', boxShadow: '0 4px 16px #00f2ff44', minWidth: 120 }}
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="btn neon-btn btn-lg fw-bold w-100 w-md-auto"
                style={{ fontSize: '1.3rem', borderRadius: '2rem', background: 'linear-gradient(90deg, #bb86fc 0%, #00f2ff 100%)', color: '#fff', boxShadow: '0 4px 16px #bb86fc44', minWidth: 120 }}
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
            <div className="mt-3">
              <small style={{ color: '#666', fontSize: '0.9rem' }}>
                All users (Student, Teacher, Admin, HOD) can register and login through the same forms
              </small>
            </div>
            {/* Debug button for testing */}
            <div className="mt-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={testRouting}
                style={{ fontSize: '0.8rem' }}
              >
                Test Registration Route
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 