import React from 'react';
import Navbar from '/src/components/Navbar.jsx';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>AI-Powered Experiential Learning Management</h1>
          <p>
            A centralized platform to manage student projects, detect duplication using AI, 
            and streamline mentor grading.
          </p>
          <button className="cta-button">Get Started</button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Use EL Manager?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🤖 AI Similarity Check</h3>
            <p>Automatically flags projects that are too similar to previous years' submissions.</p>
          </div>
          <div className="feature-card">
            <h3>📂 Centralized Repo</h3>
            <p>One place for all Phase 1, Phase 2, and Final reports and remarks.</p>
          </div>
          <div className="feature-card">
            <h3>👨‍🏫 Role-Based Access</h3>
            <p>Dedicated dashboards for Students to submit and Mentors to grade.</p>
          </div>
        </div>
      </section>

      {/* Project Archive Section
      <section id="projects" className="projects-section">
        <h2>Past Projects Archive</h2>
        <table className="project-table">
          <thead>
            <tr>
              <th>Project Title</th>
              <th>Year</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {pastProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.year}</td>
                <td>{project.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section> */}

      <section className='footer'>
        <div>
          
        </div>
      </section>
    </div>
  );
};

export default Home;