import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>trueProject</h2>
        <span>Because originality deserves a fair chance</span>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/login" className="btn-login">Sign In</Link></li>
        <li><Link to="/signup" className="btn-signup">Sign Up</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;