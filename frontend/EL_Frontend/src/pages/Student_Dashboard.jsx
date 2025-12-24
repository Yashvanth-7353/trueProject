import React, { useState } from "react";
import "./Student_Dashboard.css";
import TeamForm from "./TeamForm"; // Add this line
import ProjectList from "./Projectlist"; // Add this

const StudentDashboard = () => {
  const studentProfile = {
    name: "Rahul Kumar",
    usn: "1RV23IS045",
    dept: "ISE",
    year: "3rd",
    sem: "5th",
    email: "rahul.rv@example.com",
  };

  const projectDetails = {
    title: "AI Powered EL Project Manager",
    description:
      "A centralized system to manage student projects, detect duplication using AI, and streamline mentor grading workflows.",
    teamName: "Code Warriors",
    mentor: {
      name: "Prof. Anjali Sharma",
      dept: "ISE",
      email: "anjali.s@rvce.edu.in",
    },
  };

  const teamMembers = [
    {
      sl: 1,
      name: "Rahul Kumar",
      dept: "ISE",
      usn: "1RV23IS045",
      email: "rahul@ex.com",
    },
    {
      sl: 2,
      name: "Sneha R",
      dept: "ISE",
      usn: "1RV23IS052",
      email: "sneha@ex.com",
    },
    {
      sl: 3,
      name: "Amit B",
      dept: "ISE",
      usn: "1RV23IS012",
      email: "amit@ex.com",
    },
  ];

  const marksData = [
    {
      phase: "Phase 1",
      marks: "18/20",
      remarks: "Good lit survey, refine problem statement.",
    },
    { phase: "Phase 2", marks: "Pending", remarks: "-" },
    { phase: "Final", marks: "Pending", remarks: "-" },
  ];

  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="dashboard-container">
      {/* 1. Student Details Header (Top Bar) */}
      <div className="student-header">
        <h2>Student Details</h2>
        <div className="header-info-grid">
          <span>
            <strong>Name:</strong> {studentProfile.name}
          </span>
          <span>
            <strong>USN:</strong> {studentProfile.usn}
          </span>
          <span>
            <strong>Dept:</strong> {studentProfile.dept}
          </span>
          <span>
            <strong>Year:</strong> {studentProfile.year}
          </span>
          <span>
            <strong>Sem:</strong> {studentProfile.sem}
          </span>
          <span>
            <strong>Email:</strong> {studentProfile.email}
          </span>
        </div>
      </div>

      <div className="dashboard-body">
        {/* 2. Sidebar Menu */}
        <aside className="sidebar">
          <ul>
            <li
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={activeTab === "team-form" ? "active" : ""}
              onClick={() => setActiveTab("team-form")}
            >
              Team Form
            </li>
            <li
              className={activeTab === "project-list" ? "active" : ""}
              onClick={() => setActiveTab("project-list")}
            >
              Project List
            </li>
            <li
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              Project History
            </li>
          </ul>
        </aside>

        {/* 3. Main Content Area */}
        <main className="main-content">
          {/* Section A: Team Details */}
          {activeTab === "dashboard" && (
            <>
              <section className="content-card">
                <h3>
                  Team Details:{" "}
                  <span className="highlight">{projectDetails.teamName}</span>
                </h3>
                <table className="std-table">
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Member Name</th>
                      <th>Dept</th>
                      <th>USN</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.sl}>
                        <td>{member.sl}</td>
                        <td>{member.name}</td>
                        <td>{member.dept}</td>
                        <td>{member.usn}</td>
                        <td>{member.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* Section B: Project & Mentor Info */}
              <div className="info-grid-row">
                {/* Mentor Details Box */}
                <section className="content-card half-width">
                  <h3>Mentor Details</h3>
                  <p>
                    <strong>Name:</strong> {projectDetails.mentor.name}
                  </p>
                  <p>
                    <strong>Dept:</strong> {projectDetails.mentor.dept}
                  </p>
                  <p>
                    <strong>Email:</strong> {projectDetails.mentor.email}
                  </p>
                </section>

                {/* Project Title & Desc Box */}
                <section className="content-card half-width">
                  <h3>Project Details</h3>
                  <p>
                    <strong>Title:</strong> {projectDetails.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {projectDetails.description}
                  </p>
                </section>
              </div>

              {/* Section C: Phase-wise Marks */}
              <section className="content-card">
                <h3>Phase-wise Marks & Remarks</h3>
                <table className="std-table marks-table">
                  <thead>
                    <tr>
                      <th>Phase</th>
                      <th>Marks</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksData.map((row, index) => (
                      <tr key={index}>
                        <td className="phase-col">{row.phase}</td>
                        <td>{row.marks}</td>
                        <td>{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </>
          )}
          {/* 2. SHOW TEAM FORM VIEW */}
          {activeTab === "team-form" && <TeamForm />}
          {/* 3. SHOW PROJECT LIST (Placeholder for now) */}
          {/* 3. SHOW PROJECT LIST */}
          {activeTab === "project-list" && <ProjectList />}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
