import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import Navbar from '/src/components/Navbar.jsx';
import './Login.css'; 

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading,SF_loading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    usn: '',     
    dept: '',
    year: '',    // Added
    sem: ''      // Added
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    SF_loading(true);

    const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
    const endpoint = role === 'student' ? '/register/student' : '/register/teacher';
    
    // Prepare payload based on role
    let payload = {};

    if (role === 'student') {
      payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        usn: formData.usn,
        dept: formData.dept,
        year: parseInt(formData.year), // Backend expects Integer
        sem: parseInt(formData.sem)    // Backend expects Integer
      };
    } else {
      payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        dept: formData.dept
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      console.log('Registration Success:', data);
      alert(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);
      navigate('/login'); // Redirect to login page

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      SF_loading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p>Join the EL Management Platform</p>
          
          {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

          <form onSubmit={handleSubmit}>
            
            {/* Role Selection */}
            <div className="form-group">
              <label>I am a...</label>
              <select value={role} onChange={handleRoleChange} className="role-select">
                <option value="student">Student</option>
                <option value="mentor">Mentor (Teacher)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Enter full name" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="Enter college email" onChange={handleChange} required />
            </div>

            {/* Student Specific Fields */}
            {role === 'student' && (
              <>
                <div className="form-group">
                  <label>USN</label>
                  <input type="text" name="usn" placeholder="e.g., 1RV23IS001" onChange={handleChange} required />
                </div>

                <div style={{display: 'flex', gap: '10px'}}>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Year</label>
                    <input type="number" name="year" placeholder="1-4" onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{flex: 1}}>
                    <label>Semester</label>
                    <input type="number" name="sem" placeholder="1-8" onChange={handleChange} required />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Department</label>
              <input type="text" name="dept" placeholder="e.g., ISE, CSE, AIML" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Create password" onChange={handleChange} required />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;