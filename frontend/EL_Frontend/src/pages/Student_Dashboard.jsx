import React, { useState, useEffect } from "react";
import TeamForm from "./TeamForm";
import ProjectList from "./ProjectList";
import "./Student_Dashboard.css";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch User Data from API
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Retrieve email from localStorage (set this during Login)
        // OR hardcode it for testing: const email = "rahul.rv@example.com";
        const email =
          localStorage.getItem("userEmail") || "rahul.rv@example.com";

        if (!email) {
          throw new Error("No user logged in.");
        }

        const response = await fetch(`http://192.168.0.101:8000/user/${email}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setStudentData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading)
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!studentData) return null;

  return (
    <div className="dashboard-container">
      {/* 1. Student Details Header (Dynamic Data) */}
      <div className="student-header">
        <h2>Student Details</h2>
        <div className="header-info-grid">
          <span>
            <strong>Name:</strong> {studentData.name}
          </span>
          <span>
            <strong>USN:</strong> {studentData.usn}
          </span>
          <span>
            <strong>Dept:</strong> {studentData.dept}
          </span>
          <span>
            <strong>Sem:</strong> {studentData.sem || "N/A"}
          </span>
          <span>
            <strong>Email:</strong> {studentData.email}
          </span>
        </div>
      </div>

      <div className="dashboard-body">
        {/* 2. Sidebar Menu */}
        <aside className="sidebar">
          <div
            className="mobile-menu-label"
            style={{
              display: "none",
              textAlign: "center",
              padding: "10px",
              color: "#61dafb",
              fontWeight: "bold",
            }}
          >
            Menu
          </div>
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
          </ul>
        </aside>

        {/* 3. Main Content Area */}
        <main className="main-content">
          {/* VIEW: DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              {/* Section A: Team Details */}
              <section className="content-card">
                <h3>Team Details</h3>
                {studentData.team_members &&
                studentData.team_members.length > 0 ? (
                  <table className="std-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>USN</th>
                        <th>Email</th>
                        <th>Dept</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.team_members.map((member, index) => (
                        <tr key={index}>
                          <td>{member.name}</td>
                          <td>{member.usn}</td>
                          <td>{member.email}</td>
                          <td>{member.dept}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data-msg">
                    You have not joined a team yet. Use the "Team Form" to
                    register.
                  </p>
                )}
              </section>

              {/* Section B: Project & Mentor Info */}
              <div className="info-grid-row">
                {/* Mentor Details Box */}
                <section className="content-card half-width">
                  <h3>Mentor Details</h3>
                  {studentData.mentor_name ? (
                    <>
                      <p>
                        <strong>Name:</strong> {studentData.mentor_name}
                      </p>
                      {/* Note: Your current API fetcher gets 'mentor_name' but doesn't explicitly grab mentor email/dept unless you join teachers table fully. 
                          If you need email, update the API SQL query. */}
                      <p>
                        <strong>Status:</strong> Mentor Assigned
                      </p>
                    </>
                  ) : (
                    <p className="no-data-msg">No mentor assigned yet.</p>
                  )}
                </section>

                {/* Project Title & Desc Box */}
                <section className="content-card half-width">
                  <h3>Project Details</h3>
                  {studentData.project_title ? (
                    <>
                      <p>
                        <strong>Title:</strong> {studentData.project_title}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-tag ${studentData.project_status}`}
                        >
                          {studentData.project_status}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="no-data-msg">No project submitted.</p>
                  )}
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
                    {["phase1", "phase2", "phase3"].map((phaseKey) => {
                      const phase = studentData.project_phases[phaseKey] || {
                        marks: 0,
                        remarks: "-",
                      };
                      return (
                        <tr key={phaseKey}>
                          <td className="phase-col">
                            {phaseKey.replace("phase", "Phase ")}
                          </td>
                          <td>{phase.marks || "Pending"}</td>
                          <td>{phase.remarks || "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            </>
          )}

          {/* VIEW: TEAM FORM */}
          {activeTab === "team-form" && <TeamForm />}

          {/* VIEW: PROJECT LIST */}
          {activeTab === "project-list" && <ProjectList />}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
