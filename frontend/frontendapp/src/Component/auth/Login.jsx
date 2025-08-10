import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: formData.email,
        password: formData.password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const receivedData = response.data;
      if (!receivedData) {
        throw new Error('No token received from server');
      }

      const token = receivedData.token;
      const id = receivedData.id;
      const role = receivedData.role;

      localStorage.setItem('token', token);
      localStorage.setItem('id', id);
      localStorage.setItem('role', role);

      if (role === 'TEACHER') {
        navigate('/teacher');
      } else if (role === 'STUDENT') {
        navigate('/student');
      } else if (role === 'ADMIN') {
        navigate('/admin');
      } else if (role === 'HOD') {
        navigate('/hod');
      } else {
        setError('Invalid role. Please contact support.');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="container mt-5 position-relative">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h2 className="text-center mb-4" style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}>Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-control neon-input"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="mb-3 position-relative">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="form-control neon-input"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    autoComplete="current-password"
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ position: 'absolute', right: '15px', top: '38px', cursor: 'pointer', zIndex: 2 }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button type="submit" className="btn neon-btn w-100" style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}>
                  Login
                </button>
                <hr />
                <p className="text-center">
                  Don&apos;t have an account?{' '}
                  <a href="#" onClick={() => navigate('/register')}>Register here</a>
                </p>
                <p className="text-center">
                  <a href="#" onClick={() => navigate('/reset-password')}>Forgot Password?</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
