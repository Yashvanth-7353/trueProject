import React, { useState } from 'react';
import Navbar from '/src/components/Navbar.jsx';
import './Student_Dashboard.css';

const StudentDashboard = () => {
  // TOGGLE THIS TO TEST BOTH VIEWS:
  // true = Student has submitted a project
  // false = Student is new and needs to submit
  const [hasProject, setHasProject] = useState(false); 

  // Dummy Data for the Dashboard View
  const projectData = {
    title: "AI-Based Traffic Management",
    status: "Approved", // Options: Pending, Approved, Flagged, Rejected
    similarityScore: 12, // 12% similar (safe)
    phase1: { marks: 18, remarks: "Good literature survey." },
    phase2: { marks: null, remarks: "Pending submission." },
    final: { marks: null, remarks: "Pending." }
  };

  // Form State
  const [formData, setFormData] = useState({
    teamName: '',
    projectTitle: '',
    description: '',
    members: ['', '', ''] // Array for 3 other members
  });

  const handleMemberChange = (index, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = value;
    setFormData({ ...formData, members: newMembers });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Project Submitted:", formData);
    alert("Project submitted! (Simulated)");
    setHasProject(true); // Switch to dashboard view
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Welcome, [Student Name]</p>
        </header>

        {/* CONDITION 1: NO PROJECT SUBMITTED */}
        {!hasProject ? (
          <div className="submission-card">
            <h2>🚀 Start Your EL Project</h2>
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label>Team Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Code Warriors" 
                  value={formData.teamName}
                  onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Team Members (USNs)</label>
                {formData.members.map((member, index) => (
                  <input 
                    key={index}
                    type="text" 
                    placeholder={`Member ${index + 1} USN`} 
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    className="member-input"
                  />
                ))}
              </div>

              <div className="form-group">
                <label>Project Title</label>
                <input 
                  type="text" 
                  placeholder="Project Title"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Project Description (Abstract)</label>
                <textarea 
                  rows="5" 
                  placeholder="Describe your project here. The AI will analyze this for similarity."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required 
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">Submit Project Proposal</button>
            </form>
          </div>
        ) : (
          
          /* CONDITION 2: PROJECT DASHBOARD */
          <div className="project-status-view">
            
            {/* Status Banner */}
            <div className={`status-banner ${projectData.status.toLowerCase()}`}>
              <h2>Status: {projectData.status}</h2>
              {projectData.status === 'Flagged' && (
                <p>⚠️ Alert: High Similarity Detected ({projectData.similarityScore}%). Please contact your mentor.</p>
              )}
            </div>

            <div className="project-details-card">
              <h3>{projectData.title}</h3>
              <p><strong>Similarity Score:</strong> {projectData.similarityScore}% <span className="badge-safe">Safe</span></p>
            </div>

            {/* Marks Grid */}
            <div className="marks-grid">
              {/* Phase 1 */}
              <div className="mark-card">
                <h4>Phase 1</h4>
                <div className="score">
                  {projectData.phase1.marks !== null ? `${projectData.phase1.marks}/20` : "--"}
                </div>
                <p className="remarks">"{projectData.phase1.remarks}"</p>
              </div>

              {/* Phase 2 */}
              <div className="mark-card">
                <h4>Phase 2</h4>
                <div className="score">
                  {projectData.phase2.marks !== null ? `${projectData.phase2.marks}/20` : "--"}
                </div>
                <p className="remarks">"{projectData.phase2.remarks}"</p>
              </div>

              {/* Final */}
              <div className="mark-card">
                <h4>Final Phase</h4>
                <div className="score">
                  {projectData.final.marks !== null ? `${projectData.final.marks}/60` : "--"}
                </div>
                <p className="remarks">"{projectData.final.remarks}"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;