import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProjectList from './ProjectList'; 
import './Mentor_Dashboard.css';

const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedRow, setExpandedRow] = useState(null);
  const [mentorData, setMentorData] = useState(null);
  const [myTeams, setMyTeams] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Data on Load
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const email = localStorage.getItem('userEmail') || "kavita.patil@rvce.edu.in";
        if (!email) throw new Error("No user logged in.");

        const response = await fetch(`http://localhost:8000/user/${email}`);
        if (!response.ok) throw new Error('Failed to fetch mentor details');

        const data = await response.json();
        if (data.role !== 'teacher') {
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
  // HANDLE STATUS CHANGE (With Confirmation)
  // ---------------------------------------------------------
  const handleStatusChange = async (projectId, newStatus) => {
    // 1. Confirmation Step
    const isConfirmed = window.confirm(
      `Are you sure you want to ${newStatus.toUpperCase()} this project?\nThis action cannot be undone.`
    );

    if (!isConfirmed) return; // Stop if user clicks Cancel

    // 2. Prepare Payload
    const payload = {
      submitted_project_id: projectId,
      status: newStatus
    };

    try {
      const response = await fetch('http://localhost:8000/update-project-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update status');
      }

      // 3. Update UI
      const updatedTeams = myTeams.map(project => {
        if (project.submitted_project_id === projectId) {
          // Initialize phases if Approved
          let updatedPhases = project.project_phases;
          if (newStatus === 'approved' && !updatedPhases) {
             updatedPhases = {
               phase1: { marks: 0, remarks: '' },
               phase2: { marks: 0, remarks: '' },
               phase3: { marks: 0, remarks: '' }
             };
          }
          return { ...project, status: newStatus, project_phases: updatedPhases };
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

  // ---------------------------------------------------------
  // SAVE MARKS
  // ---------------------------------------------------------
  const handleSaveMarks = async (projectId) => {
    const projectToUpdate = myTeams.find(p => p.submitted_project_id === projectId);
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
      phase3_remarks: phases.phase3.remarks || null
    };

    try {
      const response = await fetch('http://localhost:8000/update-project-phases', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save marks');
      alert("✅ Marks and Remarks saved successfully!");

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Handle Input Changes for Marks
  const handleGradingChange = (projectId, phase, field, value) => {
    const updatedTeams = myTeams.map(project => {
      if (project.submitted_project_id === projectId && project.project_phases) {
        return {
          ...project,
          project_phases: {
            ...project.project_phases,
            [phase]: { ...project.project_phases[phase], [field]: value }
          }
        };
      }
      return project;
    });
    setMyTeams(updatedTeams);
  };

  if (loading) return <div className="dashboard-loading">Loading Mentor Dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="student-header mentor-header-bg">
        <h2>Mentor Dashboard</h2>
        <div className="header-info-grid">
          <span><strong>Name:</strong> {mentorData.name}</span>
          <span><strong>Dept:</strong> {mentorData.dept || "ISE"}</span>
          <span><strong>Email:</strong> {mentorData.email}</span>
        </div>
      </div>

      <div className="dashboard-body">
        <aside className="sidebar">
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>My Teams (Dashboard)</li>
            <li className={activeTab === 'all-projects' ? 'active' : ''} onClick={() => setActiveTab('all-projects')}>All Project List</li>
          </ul>
        </aside>

        <main className="main-content">
          {activeTab === 'dashboard' && (
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
                          <tr className={expandedRow === project.submitted_project_id ? "active-row" : ""}>
                            <td>{index + 1}</td>
                            <td>{project.team_details.team_name}</td>
                            <td className="title-cell">{project.project_title}</td>
                            <td>
                              <span className={`sim-badge ${project.similarity_score > 30 ? 'high-risk' : 'safe'}`}>
                                {project.similarity_score}%
                              </span>
                            </td>
                            <td>
                              <span className={`status-tag ${project.status}`}>
                                {project.status}
                              </span>
                            </td>
                            <td>
                              <button className="btn-manage" onClick={() => toggleRow(project.submitted_project_id)}>
                                {expandedRow === project.submitted_project_id ? "Close" : "Manage"}
                              </button>
                            </td>
                          </tr>

                          {expandedRow === project.submitted_project_id && (
                            <tr className="expanded-row">
                              <td colSpan="6">
                                <div className="details-grid">
                                  
                                  {/* Team Members */}
                                  <div className="detail-card">
                                    <h4>👥 Team Members</h4>
                                    <ul>
                                      {project.team_details.team_members.map((m, i) => (
                                        <li key={i}>{m.name} ({m.usn})</li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* AI Analysis */}
                                  <div className="detail-card">
                                    <h4>🤖 AI Analysis</h4>
                                    <p><strong>Synopsis:</strong> {project.project_synopsis}</p>
                                    {project.similarity_score > 0 ? (
                                        <div className="ai-matches">
                                            <h5>Analysis Report:</h5>
                                            <p>{project.similarity_description || "Similarity detected."}</p>
                                        </div>
                                    ) : (
                                        <p style={{color: 'green', marginTop: '10px'}}>✅ Unique Project Idea</p>
                                    )}
                                  </div>

                                  {/* Actions & Grading */}
                                  <div className="detail-card full-width">
                                    <h4>✅ Actions & Grading</h4>
                                    
                                    {/* --- 1. APPROVAL BOX (CONDITIONAL) --- */}
                                    <div className="approval-box">
                                      <span>Project Status: </span>
                                      
                                      {/* Only show buttons if Status is PENDING */}
                                      {project.status === 'pending' ? (
                                        <>
                                          <button 
                                            className="btn-toggle"
                                            onClick={() => handleStatusChange(project.submitted_project_id, 'approved')}
                                          >Approve</button>
                                          
                                          <button 
                                            className="btn-toggle reject"
                                            onClick={() => handleStatusChange(project.submitted_project_id, 'rejected')}
                                          >Reject</button>
                                        </>
                                      ) : (
                                        // If already decided, just show the text
                                        <span className={`status-text ${project.status}`}>
                                          <strong>{project.status.toUpperCase()}</strong>
                                        </span>
                                      )}
                                    </div>

                                    {/* --- 2. GRADING SECTION (Only if Approved) --- */}
                                    {project.status === 'approved' && project.project_phases && (
                                      <div className="grading-grid">
                                        {['phase1', 'phase2', 'phase3'].map((phaseKey) => (
                                          <div key={phaseKey} className="phase-input-box">
                                            <h5>{phaseKey === 'phase3' ? 'FINAL PHASE' : phaseKey.toUpperCase()}</h5>
                                            <input 
                                              type="number" 
                                              placeholder="Marks"
                                              value={project.project_phases[phaseKey].marks}
                                              onChange={(e) => handleGradingChange(project.submitted_project_id, phaseKey, 'marks', e.target.value)}
                                            />
                                            <input 
                                              type="text" 
                                              placeholder="Remarks"
                                              value={project.project_phases[phaseKey].remarks || ''}
                                              onChange={(e) => handleGradingChange(project.submitted_project_id, phaseKey, 'remarks', e.target.value)}
                                            />
                                          </div>
                                        ))}
                                        <button 
                                          className="btn-save-marks"
                                          onClick={() => handleSaveMarks(project.submitted_project_id)}
                                        >
                                          Save Marks
                                        </button>
                                      </div>
                                    )}

                                    {/* Message for Rejected Projects */}
                                    {project.status === 'rejected' && (
                                      <p className="error-text">This project has been rejected. No grading actions available.</p>
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

          {activeTab === 'all-projects' && <ProjectList />}
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;