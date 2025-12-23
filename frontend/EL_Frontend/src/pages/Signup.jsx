import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '/src/components/Navbar.jsx';
// We can reuse the Login CSS since the layout is identical!
import './Login.css'; 

const Signup = () => {
  const [role, setRole] = useState('student'); // Default to student
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    usn: '',     // Only for students
    dept: ''     // For both (or specific to mentor)
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Data:', { ...formData, role });
    // Connect to backend later
  };

  return (
    <div>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p>Join the EL Management Platform</p>
          
          <form onSubmit={handleSubmit}>
            
            {/* Role Selection */}
            <div className="form-group">
              <label>I am a...</label>
              <select value={role} onChange={handleRoleChange} className="role-select">
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
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

            {/* Conditional Field: Show USN only if Student */}
            {role === 'student' && (
              <div className="form-group">
                <label>USN</label>
                <input type="text" name="usn" placeholder="e.g., 1RV23IS001" onChange={handleChange} required />
              </div>
            )}

            <div className="form-group">
              <label>Department</label>
              <input type="text" name="dept" placeholder="e.g., ISE, CSE, AIML" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Create password" onChange={handleChange} required />
            </div>

            <button type="submit" className="auth-btn">Sign Up</button>
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