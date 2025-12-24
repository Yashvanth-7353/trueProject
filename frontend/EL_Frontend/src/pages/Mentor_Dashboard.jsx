import React, { useState, useEffect } from "react";

import ProjectList from "./ProjectList";
import "./Mentor_Dashboard.css";

const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedRow, setExpandedRow] = useState(null);

  // State for Real Data
  const [mentorData, setMentorData] = useState(null);
  const [myTeams, setMyTeams] = useState([]); // This will hold 'mentored_projects'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Data on Load
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        // Retrieve email from localStorage (simulated login)
        // OR hardcode for testing: const email = "kavita.patil@rvce.edu.in";
        const email =
          localStorage.getItem("userEmail") || "kavita.patil@rvce.edu.in";

        if (!email) throw new Error("No user logged in.");

        const response = await fetch(`http://10.237.126.15:8000/user/${email}`);

        if (!response.ok) throw new Error("Failed to fetch mentor details");

        const data = await response.json();

        // Security Check: Ensure this user is actually a teacher
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

  // Toggle Row Expansion
  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // ---------------------------------------------------------
  // HANDLE STATUS CHANGE (Connects to Backend API)
  // ---------------------------------------------------------
  const handleStatusChange = async (projectId, newStatus) => {
    // 1. Prepare the Payload matching your Pydantic Model
    const payload = {
      submitted_project_id: projectId,
      status: newStatus,
    };

    try {
      // 2. Make the API Call
      const response = await fetch(
        "http://10.237.126.15:8000/update-project-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update status");
      }

      // 3. If API success, Update UI State
      const updatedTeams = myTeams.map((project) => {
        if (project.submitted_project_id === projectId) {
          // Logic: If approving, ensure phases structure exists so grading inputs appear
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
      alert(`Project marked as ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle Grading Input (UI Update Only)
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

  // ---------------------------------------------------------
  // SAVE MARKS (Connects to Backend API)
  // ---------------------------------------------------------
  const handleSaveMarks = async (projectId) => {
    // 1. Find the specific project in our state to get current values
    const projectToUpdate = myTeams.find(
      (p) => p.submitted_project_id === projectId
    );

    if (!projectToUpdate || !projectToUpdate.project_phases) {
      alert("No grading data found to save.");
      return;
    }

    const phases = projectToUpdate.project_phases;

    // 2. Prepare Payload (Convert strings to Integers where needed)
    // We use ternary operators to handle empty strings "" as null
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
      // 3. Make the API Call
      const response = await fetch(
        "http://10.237.126.15:8000/update-project-phases",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save marks");
      }

      const data = await response.json();
      alert("✅ Marks and Remarks saved successfully!");
    } catch (error) {
      console.error("Error saving marks:", error);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading)
    return <div className="dashboard-loading">Loading Mentor Dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {/* 1. Mentor Header */}
      <div className="student-header mentor-header-bg">
        <h2>Mentor Dashboard</h2>
        <div className="header-info-grid">
          <span>
            <strong>Name:</strong> {mentorData.name}
          </span>
          <span>
            <strong>Dept:</strong> {mentorData.dept || "ISE"}
          </span>
          <span>
            <strong>Email:</strong> {mentorData.email}
          </span>
        </div>
      </div>

      <div className="dashboard-body">
        {/* 2. Sidebar */}
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

        {/* 3. Main Content */}
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
                          {/* MAIN ROW */}
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

                          {/* EXPANDED DETAILS ROW */}
                          {expandedRow === project.submitted_project_id && (
                            <tr className="expanded-row">
                              <td colSpan="6">
                                <div className="details-grid">
                                  {/* A. Team Members */}
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

                                  {/* B. AI Analysis */}
                                  <div className="detail-card">
                                    <h4>🤖 AI Analysis</h4>
                                    <p>
                                      <strong>Synopsis:</strong>{" "}
                                      {project.project_synopsis}
                                    </p>

                                    {/* Handle Similarity Description/List */}
                                    {project.similarity_score > 0 ? (
                                      <div className="ai-matches">
                                        <h5>Analysis Report:</h5>
                                        <p>
                                          {project.similarity_description ||
                                            "Similarity detected with previous year projects."}
                                        </p>
                                      </div>
                                    ) : (
                                      <p
                                        style={{
                                          color: "green",
                                          marginTop: "10px",
                                        }}
                                      >
                                        ✅ Unique Project Idea
                                      </p>
                                    )}
                                  </div>

                                  {/* C. Actions & Grading */}
                                  <div className="detail-card full-width">
                                    <h4>✅ Actions & Grading</h4>

                                    {/* Approval Toggle */}
                                    <div className="approval-box">
                                      <span>Project Status: </span>
                                      <button
                                        className={`btn-toggle ${
                                          project.status === "approved"
                                            ? "active"
                                            : ""
                                        }`}
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
                                        className={`btn-toggle reject ${
                                          project.status === "rejected"
                                            ? "active"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          handleStatusChange(
                                            project.submitted_project_id,
                                            "rejected"
                                          )
                                        }
                                      >
                                        Reject
                                      </button>
                                    </div>

                                    {/* CONDITIONAL RENDERING: Only Show Marks if APPROVED */}
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

                                    {project.status !== "approved" && (
                                      <p className="info-text">
                                        <em>
                                          Grading is disabled until the project
                                          is <strong>Approved</strong>.
                                        </em>
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
