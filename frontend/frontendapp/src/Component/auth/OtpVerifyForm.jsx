import React, { useState } from 'react';
import axios from 'axios';

const OtpVerifyForm = ({ email, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:8080/api/auth/verify-otp', { email, otp });
      setMessage('OTP verified successfully!');
      onVerified();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h2 className="text-center mb-4">Enter OTP</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="otp-input">OTP</label>
                  <input
                    id="otp-input"
                    type="text"
                    className="form-control"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
              {message && <div className="alert alert-success mt-3">{message}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyForm; 