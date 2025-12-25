import React, { useState, useEffect } from "react";
import "./Home_page_projects.css";
import Navbar from '/src/components/Navbar.jsx';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Data from API on Component Mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://192.168.0.101:8000/projects"); // Your FastAPI URL
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 2. Optimized Search Logic
  // We filter the 'projects' array based on the searchTerm.
  // This runs instantly whenever searchTerm or projects change.
  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = project.title.toLowerCase().includes(term);
    const synopsisMatch = project.synopsis.toLowerCase().includes(term);
    return titleMatch || synopsisMatch;
  });

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
     <Navbar />
    <div className="project-list-container">
       
      <div className="list-header">
        <h3>All Submitted Projects</h3>

        {/* Search Bar */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by Title or Synopsis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="std-table project-table">
          <thead>
            <tr>
              <th>SL No</th>
              <th>Project Title</th>
              <th>Synopsis</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <tr key={project.project_id || index}>
                  <td>{index + 1}</td>
                  <td className="title-cell">{project.title}</td>
                  <td className="synopsis-cell">{project.synopsis}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No projects found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default ProjectList;
