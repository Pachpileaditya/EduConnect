import axios from "axios";
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OtpVerifyForm from './OtpVerifyForm';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { registerTeacher, registerStudent, registerAdmin } from "../../service/api";

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    expertise: '',
    years: [],
    year: '',
    dob: '',
    gender: '',
    address: '',
    pincode: '',
    state: '',
    department: '', // Added department field for HOD
  });
  const [error, setError] = useState('');
  const [step, setStep] = useState('form'); // form, otp, success
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleYearChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      years: Array.from(e.target.selectedOptions, (option) => parseInt(option.value)),
    }));
  }, []);

  const registerTeacher = (data) => axios.post('http://localhost:8080/api/auth/register/teacher', data);
  const registerStudent = (data) => axios.post('http://localhost:8080/api/auth/register/student', data);
  const registerAdmin = (data) => axios.post('http://localhost:8080/api/auth/register/admin', data);
  const registerHod = (data) => axios.post('http://localhost:8080/api/auth/register/hod', data);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
        let apiCall;
        const formattedData = {
            ...formData,
        dob: new Date(formData.dob).toISOString().split('T')[0],
        years: formData.role === 'teacher' ? formData.years : [],
        year: formData.role === 'student' ? formData.year : '',
        };
        
        // For HOD registration, map dob to date field
        if (formData.role === 'hod') {
            const hodData = {
                name: formattedData.name,
                email: formattedData.email,
                password: formattedData.password,
                department: formattedData.department,
                date: formattedData.dob, // Map dob to date
                gender: formattedData.gender,
                address: formattedData.address,
                pincode: parseInt(formattedData.pincode),
                state: formattedData.state
            };
            console.log('Sending HOD data:', hodData); // Debug log
            apiCall = registerHod(hodData);
        } else {
            switch (formData.role) {
            case 'teacher':
                    apiCall = registerTeacher(formattedData);
                    break;
            case 'student':
                    apiCall = registerStudent(formattedData);
                    break;
            case 'admin':
                    apiCall = registerAdmin(formattedData);
                    break;
                default:
              throw new Error('Invalid role selection');
            }
        }
      await apiCall;
      // After successful registration, send OTP
      await axios.post('http://localhost:8080/api/auth/send-otp', { email: formData.email });
      setVerifiedEmail(formData.email);
      setStep('otp');
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      if (error.response) {
        console.error('Error response:', error.response.data); // Debug log
        setError(error.response.data?.message || error.response.data || 'Registration failed. Please try again.');
      } else if (error.request) {
        console.error('No response received:', error.request); // Debug log
        setError('No response from server. Please check if the backend is running.');
      } else {
        console.error('Error setting up request:', error.message); // Debug log
        setError('Registration failed. Please try again.');
      }
    }
  };

  const handleOtpVerified = () => {
    setSuccessMsg('Registration complete! You can now log in.');
    setStep('success');
    setTimeout(() => navigate('/'), 2000);
  };

  if (step === 'otp') {
    return <OtpVerifyForm email={verifiedEmail} onVerified={handleOtpVerified} />;
  }
  if (step === 'success') {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h2 className="mb-4">Success!</h2>
                <div className="alert alert-success">{successMsg}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Registration form step
  return (
    <div className="container mt-5 position-relative">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h2 className="text-center mb-4" style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}>Register</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                {[
                  { label: 'Full Name', type: 'text', name: 'name' },
                  { label: 'Email', type: 'email', name: 'email' },
                  // Remove password from here, handle separately below
                  { label: 'Date of Birth', type: 'date', name: 'dob' },
                  { label: 'Address', type: 'textarea', name: 'address' },
                  { label: 'Pincode', type: 'text', name: 'pincode' },
                  { label: 'State', type: 'text', name: 'state' },
                ].map(({ label, type, name }) => (
                  <div className="mb-3" key={name}>
                    <label className="form-label" htmlFor={`register-${name}`}>{label}</label>
                    {type === 'textarea' ? (
                      <textarea className="form-control neon-input" id={`register-${name}`} name={name} value={formData[name]} onChange={handleChange} required />
                    ) : (
                      <input type={type} className="form-control neon-input" id={`register-${name}`} name={name} value={formData[name]} onChange={handleChange} required />
                    )}
                  </div>
                ))}
                {/* Password field with eye button */}
                <div className="mb-3 position-relative">
                  <label className="form-label" htmlFor="register-password">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control neon-input"
                    id="register-password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ position: 'absolute', right: '15px', top: '38px', cursor: 'pointer', zIndex: 2 }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="register-role">Register As</label>
                  <select className="form-control neon-input" id="register-role" name="role" value={formData.role} onChange={handleChange} required>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                    <option value="hod">HOD (Head of Department)</option>
                  </select>
                </div>
                {formData.role === 'teacher' && (
                  <div className="mb-3">
                    <label className="form-label" htmlFor="register-expertise">Expertise</label>
                    <input type="text" className="form-control neon-input" id="register-expertise" name="expertise" value={formData.expertise} onChange={handleChange} required />
                  </div>
                )}
                {formData.role === 'hod' && (
                  <div className="mb-3">
                    <label className="form-label" htmlFor="register-department">Department</label>
                    <input type="text" className="form-control neon-input" id="register-department" name="department" value={formData.department} onChange={handleChange} required />
                  </div>
                )}
                {formData.role === 'student' && (
                  <div className="mb-3">
                    <label className="form-label" htmlFor="register-year">Year</label>
                    <select className="form-control neon-input" id="register-year" name="year" value={formData.year} onChange={handleChange} required>
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                )}
                {formData.role === 'teacher' && (
                  <div className="mb-3">
                    <label className="form-label" htmlFor="register-years">Years</label>
                    <select className="form-control neon-input" id="register-years" name="years" multiple value={formData.years} onChange={handleYearChange} required>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label" htmlFor="register-gender">Gender</label>
                  <select className="form-control neon-input" id="register-gender" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button type="submit" className="btn neon-btn w-100" style={{ fontFamily: 'Orbitron, Poppins, Arial, sans-serif' }}>Register</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;