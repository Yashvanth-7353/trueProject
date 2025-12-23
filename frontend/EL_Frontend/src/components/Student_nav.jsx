import React from 'react'
import './Student_nav.css'
import { Link } from 'react-router-dom';

const Student_nav = () => {
  return (
    <nav className="student_nav">
      <div className="nav_logo">
        <h2>EL</h2>
      </div>
      <div className="nav_links">
        <Link to="/student/dashboard">Dashboard</Link>
        <Link to="/student/profile">Profile</Link>
      </div>
    </nav>
  )
}

export default Student_nav