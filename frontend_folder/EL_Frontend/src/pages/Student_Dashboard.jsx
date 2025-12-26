import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeamForm from "./TeamForm";
import ProjectList from "./ProjectList";
import "./Student_Dashboard.css";
import ClickSpark from '/src/components/ClickSpark';

// --- HELPER: Skeleton Component ---
const DashboardSkeleton = () => {
  return (
    <div className="dashboard-container">
      {/* 1. Header Skeleton */}
      <div className="student-header">
        <div style={{ width: "200px", height: "24px" }} className="skeleton"></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", gap: "20px" }}>
          {/* Mimic the 5 info spans */}
          <div className="skeleton skeleton-header-text"></div>
          <div className="skeleton skeleton-header-text"></div>
          <div className="skeleton skeleton-header-text"></div>
          <div className="skeleton skeleton-header-text"></div>
          <div className="skeleton skeleton-header-text"></div>
          {/* Mimic Logout Button */}
          <div className="skeleton" style={{ width: "100px", height: "35px" }}></div>
        </div>
      </div>

      <div className="dashboard-body">
        {/* 2. Sidebar Skeleton */}
        <aside className="sidebar">
          <ul>
            <li className="skeleton skeleton-menu-item"></li>
            <li className="skeleton skeleton-menu-item"></li>
            <li className="skeleton skeleton-menu-item"></li>
          </ul>
        </aside>

        {/* 3. Main Content Skeleton */}
        <main className="main-content">
          {/* Team Details Skeleton */}
          <section className="content-card">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-table"></div>
          </section>

          {/* Split Row Skeleton */}
          <div className="info-grid-row">
            <section className="content-card half-width">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-box"></div>
            </section>
            <section className="content-card half-width">
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-box"></div>
            </section>
          </div>
        </main>
      </div>
    </div>
   
  );
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 1. Fetch User Data from API
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const email = localStorage.getItem("userEmail") || "rahul.rv@example.com";

        if (!email) {
          throw new Error("No user logged in.");
        }
        const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

        const response = await fetch(`${API_BASE_URL}/user/${email}`);

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

  // --- SIGN OUT FUNCTION ---
  const handleSignOut = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  // --- MODIFIED LOADING CHECK ---
  if (loading) return <DashboardSkeleton />;
  
  if (error) return <div className="dashboard-error">Error: {error}</div>;
  if (!studentData) return null;

  return (
    
    <ClickSpark
  sparkColor="#ff6ec7"
  sparkSize={10}
  sparkRadius={15}
  sparkCount={8}
  duration={400}
>
    <div className="dashboard-container">
      {/* 1. Student Details Header */}
      <div className="student-header">
        <h2>Student Details</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div className="header-info-grid">
            <span><strong>Name:</strong> {studentData.name}</span>
            <span><strong>USN:</strong> {studentData.usn}</span>
            <span><strong>Dept:</strong> {studentData.dept}</span>
            <span><strong>Sem:</strong> {studentData.sem || "N/A"}</span>
            <span><strong>Email:</strong> {studentData.email}</span>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.9rem",
              marginLeft: "20px",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="dashboard-body">
        {/* 2. Sidebar Menu */}
        <aside className="sidebar">
          <ul>
            <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
              Dashboard
            </li>
            <li className={activeTab === "team-form" ? "active" : ""} onClick={() => setActiveTab("team-form")}>
              Team Form
            </li>
            <li className={activeTab === "project-list" ? "active" : ""} onClick={() => setActiveTab("project-list")}>
              Project List
            </li>
          </ul>
        </aside>

        {/* 3. Main Content Area */}
        <main className="main-content">
          {activeTab === "dashboard" && (
            <>
              {/* Section A: Team Details */}
              <section className="content-card">
                <h3>Team Details</h3>
                {studentData.team_members && studentData.team_members.length > 0 ? (
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
                  <p className="no-data-msg">You have not joined a team yet. Use the "Team Form" to register.</p>
                )}
              </section>

              {/* Section B: Project & Mentor Info */}
              <div className="info-grid-row">
                <section className="content-card half-width">
                  <h3>Mentor Details</h3>
                  {studentData.mentor_name ? (
                    <>
                      <p><strong>Name:</strong> {studentData.mentor_name}</p>
                      <p><strong>Status:</strong> Mentor Assigned</p>
                    </>
                  ) : (
                    <p className="no-data-msg">No mentor assigned yet.</p>
                  )}
                </section>

                <section className="content-card half-width">
                  <h3>Project Details</h3>
                  {studentData.project_title ? (
                    <>
                      <p><strong>Title:</strong> {studentData.project_title}</p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={`status-tag ${studentData.project_status}`}>
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
                      const phase = studentData.project_phases[phaseKey] || { marks: 0, remarks: "-" };
                      return (
                        <tr key={phaseKey}>
                          <td className="phase-col">{phaseKey.replace("phase", "Phase ")}</td>
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

          {activeTab === "team-form" && <TeamForm />}
          {activeTab === "project-list" && <ProjectList />}
        </main>
      </div>
    </div>
     </ClickSpark>
  );

};

export default StudentDashboard;