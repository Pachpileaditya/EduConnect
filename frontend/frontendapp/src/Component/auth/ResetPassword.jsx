import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ResetPassword() {
  const [step, setStep] = useState('email'); // email, otp, newPassword, success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      await axios.post('http://localhost:8080/api/auth/request-password-reset', { email });
      setStep('otp');
      setInfo('If the email exists, an OTP has been sent.');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      await axios.post('http://localhost:8080/api/auth/verify-reset-otp', { email, otp });
      setStep('newPassword');
    } catch (err) {
      if (err.response?.status === 410) {
        setError('OTP expired. Please request a new one.');
        setStep('email');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }
  };

  // Step 3: Reset Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      await axios.post('http://localhost:8080/api/auth/reset-password', { email, otp, newPassword });
      setStep('success');
    } catch (err) {
      if (err.response?.status === 410) {
        setError('OTP expired. Please request a new one.');
        setStep('email');
      } else if (err.response?.status === 401) {
        setError('Invalid OTP. Please try again.');
        setStep('otp');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    }
  };

  if (step === 'success') {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h2 className="mb-4">Password Reset Successful!</h2>
                <div className="alert alert-success">You can now log in with your new password.</div>
                <button className="btn neon-btn" onClick={() => navigate('/')}>Go to Login</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 position-relative">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h2 className="text-center mb-4" style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}>Reset Password</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {info && <div className="alert alert-info">{info}</div>}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="reset-email">Email</label>
                    <input
                      id="reset-email"
                      type="email"
                      className="form-control neon-input"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn neon-btn w-100">Send OTP</button>
                </form>
              )}
              {step === 'otp' && (
                <form onSubmit={handleOtpSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="reset-otp">Enter OTP</label>
                    <input
                      id="reset-otp"
                      type="text"
                      className="form-control neon-input"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn neon-btn w-100">Verify OTP</button>
                </form>
              )}
              {step === 'newPassword' && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3 position-relative">
                    <label className="form-label" htmlFor="reset-new-password">New Password</label>
                    <input
                      id="reset-new-password"
                      type={showPassword ? "text" : "password"}
                      className="form-control neon-input"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{ position: 'absolute', right: '15px', top: '38px', cursor: 'pointer', zIndex: 2 }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  <button type="submit" className="btn neon-btn w-100">Reset Password</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword; 