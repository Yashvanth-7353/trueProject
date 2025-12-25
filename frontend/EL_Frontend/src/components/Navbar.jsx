import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import BlurText from "./BlurText";


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>trueProject</h2>

        <div>
      {/* Example using your new fonts and the blur animation */}
      <BlurText
        text="Because originality deserves a fair chance"
        delay={150}
        animateBy="words"
        direction="top"
        className="oswald-heading text-4xl font-bold" // Apply your custom CSS class here
      />
    </div>
        


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