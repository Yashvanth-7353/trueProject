import React, { useState } from 'react';
import './TeamForm.css';

const TeamForm = () => {
  // 1. State for the overall team & project
  const [teamName, setTeamName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  
  // 2. State for the list of members
  const [members, setMembers] = useState([]);

  // 3. State for the current member being added
  const [currentMember, setCurrentMember] = useState({
    name: '',
    usn: '',
    email: '',
    dept: ''
  });

  // Helper: Handle input changes for the current member
  const handleMemberChange = (e) => {
    setCurrentMember({ ...currentMember, [e.target.name]: e.target.value });
  };

  // Helper: Add member to the list
  const addMember = () => {
    if (currentMember.name && currentMember.usn) {
      setMembers([...members, currentMember]);
      // Reset current member fields
      setCurrentMember({ name: '', usn: '', email: '', dept: '' });
    } else {
      alert("Please fill in at least Name and USN");
    }
  };

  // Helper: Remove member from list
  const removeMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  // 4. Submit to Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the payload exactly as your Pydantic model expects
    const payload = {
      team_name: teamName,
      team_size: members.length, // Calculated automatically
      team_members: members,
      project_title: projectTitle,
      project_synopsis: synopsis
    };

    try {
      // Replace with your actual FastAPI URL (e.g., http://localhost:8000/create-team)
      const response = await fetch('http://10.237.126.15:8000/create-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Success! Team ID: ${data.team_id}`);
        // Optional: Clear form or redirect
      } else {
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to connect to the server.');
    }
  };

  return (
    <div className="team-form-container">
      <h2>Register Your Team</h2>
      
      <form onSubmit={handleSubmit}>
        
        {/* Section 1: Team Basics */}
        <div className="form-section">
          <h3>Team Details</h3>
          <div className="input-group">
            <label>Team Name</label>
            <input 
              type="text" 
              value={teamName} 
              onChange={(e) => setTeamName(e.target.value)} 
              placeholder="e.g., Code Warriors" 
              required 
            />
          </div>
        </div>

        {/* Section 2: Add Members */}
        <div className="form-section">
          <h3>Team Members</h3>
          
          {/* List of Added Members */}
          {members.length > 0 && (
            <div className="members-list">
              {members.map((m, index) => (
                <div key={index} className="member-tag">
                  <span>{m.name} ({m.usn})</span>
                  <button type="button" onClick={() => removeMember(index)}>x</button>
                </div>
              ))}
            </div>
          )}

          {/* Inputs to add a new member */}
          <div className="add-member-box">
            <input name="name" value={currentMember.name} onChange={handleMemberChange} placeholder="Name" />
            <input name="usn" value={currentMember.usn} onChange={handleMemberChange} placeholder="USN" />
            <input name="email" value={currentMember.email} onChange={handleMemberChange} placeholder="Email" />
            <input name="dept" value={currentMember.dept} onChange={handleMemberChange} placeholder="Dept" />
            <button type="button" className="btn-add" onClick={addMember}>+ Add Member</button>
          </div>
        </div>

        {/* Section 3: Project Details */}
        <div className="form-section">
          <h3>Project Idea</h3>
          <div className="input-group">
            <label>Project Title</label>
            <input 
              type="text" 
              value={projectTitle} 
              onChange={(e) => setProjectTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Synopsis / Abstract</label>
            <textarea 
              value={synopsis} 
              onChange={(e) => setSynopsis(e.target.value)} 
              rows="4" 
              placeholder="Brief description of your project..."
              required 
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">Submit Project Proposal</button>
      </form>
    </div>
  );
};

export default TeamForm;