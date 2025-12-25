import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '/src/components/Navbar.jsx';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student'); // Default role
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const API_BASE_URL = "http://localhost:8000";
    const endpoint = role === 'student' ? '/login/student' : '/login/teacher';

    try {
      const qh = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await qh.json();

      if (!qh.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      console.log('Login Success:', data);
      
      // Store user info (optional, but good for session management)
      localStorage.setItem('userEmail', formData.email);

      // Redirect based on role
      if (role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/mentor-dashboard'); // Assuming teacher goes to the main dashboard
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your dashboard</p>
          
          {error && <div style={{color: 'red', marginBottom: '15px', background: '#ffe6e6', padding: '10px', borderRadius: '4px'}}>{error}</div>}

          <form onSubmit={handleSubmit}>
            
            {/* Added Role Selection for Login */}
            <div className="form-group">
              <label>Login as</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                className="role-select"
                style={{
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '15px', 
                  borderRadius: '5px', 
                  border: '1px solid #ddd'
                }}
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor (Teacher)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Enter your college email" 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter your password" 
                onChange={handleChange} 
                required 
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;