import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '/src/pages/Home';
import Login from '/src/pages/Login';   // Import Login
import Signup from '/src/pages/Signup'; // Import Signup
import StudentDashboard from '/src/pages/Student_Dashboard';
import MentorDashboard from '/src/pages/Mentor_Dashboard';
import ProjectList from "/src/pages/Home_page_projects.jsx";



// Placeholder for Dashboard (we will build this next)
const Dashboard = () => <h2>Dashboard (Coming Soon)</h2>;

function App() {
  return (
    <>
    
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/projects" element={<ProjectList />} />
        </Routes>
      </div>
    </Router></>
    
  );
}

export default App;