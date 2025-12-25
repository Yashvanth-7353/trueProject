import React from 'react';
import Navbar from '/src/components/Navbar.jsx';
import './Home.css';
import BlurText from "/src/components/BlurText";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">

          <div>
      {/* Example using your new fonts and the blur animation */}
      <BlurText
        text="AI-Powered Experiential Learning Management"
        delay={150}
        animateBy="words"
        direction="top"
        className="oswald-heading " // Apply your custom CSS class here
      />
      
      <p className="alan-sans-body">A centralized platform to manage student projects, detect duplication using AI, 
            and streamline mentor grading.</p>
    </div>

          {/* <h1>AI-Powered Experiential Learning Management</h1>
          <p>
            A centralized platform to manage student projects, detect duplication using AI, 
            and streamline mentor grading.
          </p> */}
          <button className="cta-button">Get Started</button>
          
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Use EL Manager?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="./AI-logo.png" alt="AI-logo" />
            <h3> AI Similarity Check</h3>
            <p>Automatically flags projects that are too similar to previous years' submissions.</p>
          </div>
          <div className="feature-card">
            <img src="./floder-logo.png" alt="folder-logo" />
            <h3> Centralized Repo</h3>
            <p>One place for all Phase 1, Phase 2, and Final reports and remarks.</p>
          </div>
          <div className="feature-card">
            <img src="./role-logo.png" alt="role-logo" />
            <h3> Role-Based Access</h3>
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

      <footer className="footer-section">
  <div className="footer-container">
    {/* Column 1: Project Info */}
    <div className="footer-col">
      <h3 className="oswald-heading">trueProject</h3>
      <p className="alan-sans-body">
        Streamlining experiential learning with AI-powered insights.
      </p>
      <a href="https://github.com/Yashvanth-7353/trueProject" target="_blank" rel="noreferrer" className="project-repo-link">
        View Project on GitHub →
      </a>
    </div>

    {/* Column 2: Developer 1 */}
    <div className="footer-col">
      <h4 className="oswald-heading">Yashvanth M U</h4>
      <div className="footer-links">
        <a href="https://github.com/Yashvanth-7353" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/yashvanth-m-u-720598282/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </div>

    {/* Column 3: Developer 2 */}
    <div className="footer-col">
      <h4 className="oswald-heading">Vishwa Panchal</h4>
      <div className="footer-links">
        <a href="https://github.com/vishwapanchal" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/thevishwapanchal" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2024 trueProject. All rights reserved.</p>
  </div>
</footer>
    </div>
  );
};

export default Home;