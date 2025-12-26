import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectList from "./ProjectList";
import "./Mentor_Dashboard.css";

// --- HELPER: Skeleton Component ---
const MentorDashboardSkeleton = () => {
  return (
    <div className="dashboard-container">
      {/* 1. Header Skeleton */}
      <div className="student-header mentor-header-bg">
        <div className="skeleton skeleton-header-title"></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '10px' }}>
          <div className="header-info-grid" style={{ display: 'flex', gap: '20px' }}>
            <div className="skeleton skeleton-header-info"></div>
            <div className="skeleton skeleton-header-info"></div>
            <div className="skeleton skeleton-header-info"></div>
          </div>
          <div className="skeleton skeleton-btn"></div>
        </div>
      </div>

      <div className="dashboard-body">
        {/* 2. Sidebar Skeleton */}
        <aside className="sidebar">
          <ul>
            <li className="skeleton skeleton-menu-item"></li>
            <li className="skeleton skeleton-menu-item"></li>
          </ul>
        </aside>

        {/* 3. Main Content Skeleton */}
        <main className="main-content">
          <div className="mentor-dashboard-view">
            <div className="skeleton skeleton-header-title" style={{ width: '200px' }}></div>
            
            {/* Table Skeleton */}
            <div className="table-responsive" style={{ marginTop: '20px', background: 'white', padding: '20px', borderRadius: '8px' }}>
              <table className="std-table mentor-table">
                <thead>
                  <tr>
                    <th><div className="skeleton skeleton-cell" style={{ width: '30px' }}></div></th>
                    <th><div className="skeleton skeleton-cell"></div></th>
                    <th><div className="skeleton skeleton-cell"></div></th>
                    <th><div className="skeleton skeleton-cell"></div></th>
                    <th><div className="skeleton skeleton-cell"></div></th>
                    <th><div className="skeleton skeleton-cell"></div></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render 5 dummy rows */}
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="skeleton-table-row">
                      <td><div className="skeleton skeleton-cell" style={{ width: '20px' }}></div></td>
                      <td><div className="skeleton skeleton-cell" style={{ width: '100px' }}></div></td>
                      <td><div className="skeleton skeleton-cell" style={{ width: '200px' }}></div></td>
                      <td><div className="skeleton skeleton-cell" style={{ width: '50px' }}></div></td>
                      <td><div className="skeleton skeleton-cell" style={{ width: '80px' }}></div></td>
                      <td><div className="skeleton skeleton-cell" style={{ width: '60px' }}></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedRow, setExpandedRow] = useState(null);

  // State for Real Data
  const [mentorData, setMentorData] = useState(null);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  // 1. Fetch Data on Load
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const email =
          localStorage.getItem("userEmail") || "kavita.patil@rvce.edu.in";

        if (!email) throw new Error("No user logged in.");

        const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/${email}`);

        if (!response.ok) throw new Error("Failed to fetch mentor details");

        const data = await response.json();

        if (data.role !== "teacher") {
          throw new Error("Access Denied: User is not a Mentor.");
        }

        setMentorData(data);
        setMyTeams(data.mentored_projects || []);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMentorData();
  }, []);

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login"); 
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Helper: Format JSON Report
  const renderSimilarityReport = (jsonString) => {
    if (!jsonString) return <p>No detailed analysis available.</p>;

    try {
      const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;

      return (
        <div className="report-container">
          {data.analysis && (
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '10px' }}>
                📝 Core Analysis
              </h5>
              <p style={{ color: '#444', lineHeight: '1.6', fontSize: '0.95rem' }}>
                {data.analysis}
              </p>
            </div>
          )}

          {data.comparison && data.comparison.length > 0 && (
            <div>
              <h5 style={{ color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '15px' }}>
                🔍 Similar Projects Found
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.comparison.map((item, index) => (
                  <div key={index} style={{
                    backgroundColor: '#f8f9fa',
                    borderLeft: '4px solid #6c5ce7',
                    padding: '12px',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '4px' }}>
                      Match #{index + 1}: {item.match_name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                      "{item.similarity_note}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } catch (e) {
      return <pre style={{ whiteSpace: "pre-wrap" }}>{jsonString}</pre>;
    }
  };

  // Actions
  const handleStatusChange = async (projectId, newStatus) => {
    const action = newStatus === "approved" ? "APPROVE" : "REJECT";
    const isConfirmed = window.confirm(
      `Are you sure you want to ${action} this project? This action cannot be undone.`
    );

    if (!isConfirmed) return;

    const payload = {
      submitted_project_id: projectId,
      status: newStatus,
    };

    try {
      const response = await fetch(
        "${import.meta.env.VITE_BACKEND_BASE_URL}/update-project-status",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update status");
      }

      const updatedTeams = myTeams.map((project) => {
        if (project.submitted_project_id === projectId) {
          let updatedPhases = project.project_phases;
          if (newStatus === "approved" && !updatedPhases) {
            updatedPhases = {
              phase1: { marks: 0, remarks: "" },
              phase2: { marks: 0, remarks: "" },
              phase3: { marks: 0, remarks: "" },
            };
          }
          return {
            ...project,
            status: newStatus,
            project_phases: updatedPhases,
          };
        }
        return project;
      });

      setMyTeams(updatedTeams);
      alert(`Project ${newStatus.toUpperCase()} successfully.`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleGradingChange = (projectId, phase, field, value) => {
    const updatedTeams = myTeams.map((project) => {
      if (
        project.submitted_project_id === projectId &&
        project.project_phases
      ) {
        return {
          ...project,
          project_phases: {
            ...project.project_phases,
            [phase]: {
              ...project.project_phases[phase],
              [field]: value,
            },
          },
        };
      }
      return project;
    });
    setMyTeams(updatedTeams);
  };

  const handleSaveMarks = async (projectId) => {
    const projectToUpdate = myTeams.find(
      (p) => p.submitted_project_id === projectId
    );

    if (!projectToUpdate || !projectToUpdate.project_phases) {
      alert("No grading data found to save.");
      return;
    }

    const phases = projectToUpdate.project_phases;

    const payload = {
      submitted_project_id: projectId,
      phase1_marks: phases.phase1.marks ? parseInt(phases.phase1.marks) : null,
      phase1_remarks: phases.phase1.remarks || null,
      phase2_marks: phases.phase2.marks ? parseInt(phases.phase2.marks) : null,
      phase2_remarks: phases.phase2.remarks || null,
      phase3_marks: phases.phase3.marks ? parseInt(phases.phase3.marks) : null,
      phase3_remarks: phases.phase3.remarks || null,
    };

    try {
      const response = await fetch(
        "${import.meta.env.VITE_BACKEND_BASE_URL}/update-project-phases",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save marks");
      }

      alert("✅ Marks and Remarks saved successfully!");
    } catch (error) {
      console.error("Error saving marks:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // --- UPDATED LOADING CHECK ---
  if (loading) return <MentorDashboardSkeleton />;
  
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {/* 1. Mentor Header */}
      <div className="student-header mentor-header-bg">
        <h2>Mentor Dashboard</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          
          <div className="header-info-grid">
            <span><strong>Name:</strong> {mentorData?.name}</span>
            <span><strong>Dept:</strong> {mentorData?.dept || "ECE"}</span>
            <span><strong>Email:</strong> {mentorData?.email}</span>
          </div>

          <button className="btn-logout" onClick={handleLogout}>
            Sign Out
          </button>
          
        </div>
      </div>

      <div className="dashboard-body">
        <aside className="sidebar">
          <ul>
            <li
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              My Teams (Dashboard)
            </li>
            <li
              className={activeTab === "all-projects" ? "active" : ""}
              onClick={() => setActiveTab("all-projects")}
            >
              All Project List
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {activeTab === "dashboard" && (
            <div className="mentor-dashboard-view">
              <h3>Assigned Teams & Projects</h3>

              {myTeams.length === 0 ? (
                <p className="no-data-msg">No teams assigned yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="std-table mentor-table">
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Team Name</th>
                        <th>Project Title</th>
                        <th>AI Similarity</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myTeams.map((project, index) => (
                        <React.Fragment key={project.submitted_project_id}>
                          <tr
                            className={
                              expandedRow === project.submitted_project_id
                                ? "active-row"
                                : ""
                            }
                          >
                            <td>{index + 1}</td>
                            <td>{project.team_details.team_name}</td>
                            <td className="title-cell">
                              {project.project_title}
                            </td>
                            <td>
                              <span
                                className={`sim-badge ${
                                  project.similarity_score > 30
                                    ? "high-risk"
                                    : "safe"
                                }`}
                              >
                                {project.similarity_score}%
                              </span>
                            </td>
                            <td>
                              <span className={`status-tag ${project.status}`}>
                                {project.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn-manage"
                                onClick={() =>
                                  toggleRow(project.submitted_project_id)
                                }
                              >
                                {expandedRow === project.submitted_project_id
                                  ? "Close"
                                  : "Manage"}
                              </button>
                            </td>
                          </tr>

                          {expandedRow === project.submitted_project_id && (
                            <tr className="expanded-row">
                              <td colSpan="6">
                                <div className="details-grid">
                                  {/* ROW 1 LEFT: Team Members */}
                                  <div className="detail-card">
                                    <h4>👥 Team Members</h4>
                                    <ul>
                                      {project.team_details.team_members.map(
                                        (m, i) => (
                                          <li key={i}>
                                            {m.name} ({m.usn})
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>

                                  {/* ROW 1 RIGHT: Similarity Score & ID List */}
                                  <div className="detail-card">
                                    <h4>📊 AI Score & Matches</h4>
                                    <div className="score-box">
                                      <p style={{ fontSize: "1.1rem" }}>
                                        Similarity Score:{" "}
                                        <span
                                          className={`sim-badge ${
                                            project.similarity_score > 30
                                              ? "high-risk"
                                              : "safe"
                                          }`}
                                          style={{ fontSize: "1rem" }}
                                        >
                                          {project.similarity_score}%
                                        </span>
                                      </p>
                                    </div>
                                    <div className="matches-list">
                                      <h5>Matched Projects:</h5>
                                      {project.similar_projects_id &&
                                      project.similar_projects_id.length > 0 ? (
                                        <ul style={{ paddingLeft: '20px', fontSize: '0.9rem' }}>
                                          {project.similar_projects_id.map((pid, k) => {
                                            const title = project.similar_project_titles && project.similar_project_titles[k]
                                              ? project.similar_project_titles[k]
                                              : "Title Not Available";
                                            
                                            return (
                                              <li key={k} style={{ marginBottom: '6px' }}>
                                                <span style={{ fontWeight: 'bold', color: '#555' }}>ID {pid}:</span> {title}
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      ) : (
                                        <p style={{ color: "#7f8c8d" }}>
                                          No direct matches found.
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* ROW 2: Synopsis */}
                                  <div className="detail-card full-width">
                                    <h4>📝 Project Synopsis</h4>
                                    <p style={{ lineHeight: "1.6" }}>
                                      {project.project_synopsis}
                                    </p>
                                  </div>

                                  {/* ROW 3: Formatted AI Report */}
                                  <div className="detail-card full-width">
                                    <h4>🤖 AI Similarity Analysis Report</h4>
                                    {renderSimilarityReport(project.similarity_description)}
                                  </div>

                                  {/* ROW 4: Actions */}
                                  <div className="detail-card full-width">
                                    <h4>✅ Actions & Grading</h4>
                                    <div className="approval-box">
                                      <span>Project Status: </span>
                                      {project.status === "pending" ||
                                      project.status === "not approved" ||
                                      project.status === "Not Approved" ? (
                                        <>
                                          <button
                                            className="btn-toggle"
                                            onClick={() =>
                                              handleStatusChange(
                                                project.submitted_project_id,
                                                "approved"
                                              )
                                            }
                                          >
                                            Approve
                                          </button>
                                          <button
                                            className="btn-toggle reject"
                                            style={{ marginLeft: "10px" }}
                                            onClick={() =>
                                              handleStatusChange(
                                                project.submitted_project_id,
                                                "rejected"
                                              )
                                            }
                                          >
                                            Reject
                                          </button>
                                        </>
                                      ) : (
                                        <span
                                          className={`status-locked ${project.status}`}
                                          style={{
                                            fontWeight: "bold",
                                            marginLeft: "10px",
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          {project.status} 🔒
                                        </span>
                                      )}
                                    </div>

                                    {project.status === "approved" &&
                                      project.project_phases && (
                                        <div className="grading-grid">
                                          {["phase1", "phase2", "phase3"].map(
                                            (phaseKey) => (
                                              <div
                                                key={phaseKey}
                                                className="phase-input-box"
                                              >
                                                <h5>
                                                  {phaseKey === "phase3"
                                                    ? "FINAL PHASE"
                                                    : phaseKey.toUpperCase()}
                                                </h5>
                                                <input
                                                  type="number"
                                                  placeholder="Marks"
                                                  value={
                                                    project.project_phases[
                                                      phaseKey
                                                    ].marks
                                                  }
                                                  onChange={(e) =>
                                                    handleGradingChange(
                                                      project.submitted_project_id,
                                                      phaseKey,
                                                      "marks",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                                <input
                                                  type="text"
                                                  placeholder="Remarks"
                                                  value={
                                                    project.project_phases[
                                                      phaseKey
                                                    ].remarks || ""
                                                  }
                                                  onChange={(e) =>
                                                    handleGradingChange(
                                                      project.submitted_project_id,
                                                      phaseKey,
                                                      "remarks",
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              </div>
                                            )
                                          )}
                                          <button
                                            className="btn-save-marks"
                                            onClick={() =>
                                              handleSaveMarks(
                                                project.submitted_project_id
                                              )
                                            }
                                          >
                                            Save Marks
                                          </button>
                                        </div>
                                      )}

                                    {project.status === "rejected" && (
                                      <p
                                        style={{
                                          color: "#e74c3c",
                                          marginTop: "10px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        ❌ This project has been rejected. No
                                        grading required.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "all-projects" && <ProjectList />}
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;