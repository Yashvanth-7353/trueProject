import React, { useState, useEffect } from "react";
import "./Projectlist.css";
import ClickSpark from '/src/components/ClickSpark';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
        console.log("API BASE URL =", API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/projects`);
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

  // --- 2. Search Logic ---
  const filteredProjects = projects.filter((project) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = project.title.toLowerCase().includes(term);
    const synopsisMatch = project.synopsis.toLowerCase().includes(term);
    return titleMatch || synopsisMatch;
  });

  if (error) return <div className="error">Error: {error}</div>;

  // --- Helper: Skeleton Row Component ---
  // Renders a single table row with animated bars
  const SkeletonRow = () => (
    <tr>
      <td><div className="skeleton skeleton-text skeleton-short"></div></td>
      <td><div className="skeleton skeleton-text skeleton-medium"></div></td>
      <td>
        <div className="skeleton skeleton-text skeleton-long"></div>
        <div className="skeleton skeleton-text skeleton-long" style={{ marginTop: '5px', width: '80%' }}></div>
      </td>
    </tr>
  );

  return (
    <ClickSpark
  sparkColor="#ff6ec7"
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
>
    <>
      <div className="project-list-container">
        
        <div className="list-header">
          <h3>All Submitted Projects</h3>

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
                <th style={{ width: '10%' }}>SL No</th>
                <th style={{ width: '30%' }}>Project Title</th>
                <th style={{ width: '60%' }}>Synopsis</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // --- LOADING STATE: Render 5 Skeleton Rows ---
                Array.from({ length: 7 }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : filteredProjects.length > 0 ? (
                // --- SUCCESS STATE: Render Real Data ---
                filteredProjects.map((project, index) => (
                  <tr key={project.project_id || index}>
                    <td>{index + 1}</td>
                    <td className="title-cell">{project.title}</td>
                    <td className="synopsis-cell">{project.synopsis}</td>
                  </tr>
                ))
              ) : (
                // --- EMPTY STATE ---
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
    </ClickSpark>
  );
};

export default ProjectList;