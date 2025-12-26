# 🎓 Student Project Management System (trueProject)

A **full-stack academic project lifecycle management platform** designed to modernize how student projects are proposed, evaluated, and graded.  
The system enables seamless **team formation**, **phase-wise submissions**, and **faculty evaluation**, while enforcing academic integrity through an **AI-Powered Similarity Detection Engine**.

---

## 🌟 Project Vision

Academic project evaluation often faces challenges such as:
- Repeated or copied project ideas  
- Manual and time-consuming review processes  
- Lack of transparency in project progress  

**trueProject** addresses these challenges by combining **modern web technologies** with **AI-driven semantic similarity detection**, ensuring originality, efficiency, and accountability throughout the project lifecycle.

---

## 👥 Development Team

This project is a collaborative effort with clearly defined roles:

| Domain | Contributor | Responsibilities |
|------|------------|------------------|
| **Backend & AI Systems** | **Vishwa Panchal**<br>([@vishwapanchal](https://github.com/vishwapanchal)) | • Architected the **FastAPI-based backend**.<br>• Designed and optimized the **PostgreSQL database schema**.<br>• Implemented secure authentication and core business logic.<br>• Built the **AI Similarity Engine** using FAISS and Gemini.<br>• Integrated semantic embeddings for intelligent project comparison. |
| **Frontend Engineering & UX** | **Yashvanth**<br>([@yashvanth-7353](https://github.com/yashvanth-7353)) | • Designed and developed the **React.js user interface**.<br>• Built responsive **Student and Teacher dashboards**.<br>• Implemented API integration and state management.<br>• Designed intuitive UX flows for submissions and grading. |

---

## 🚀 Core Features

### 🎓 Student Features
- **Team Formation:** Create and manage project teams dynamically.
- **Project Proposal Submission:** Submit synopses for faculty review.
- **Phase-Wise Workflow:**  
  - Phase 1: Synopsis  
  - Phase 2: Design  
  - Phase 3: Implementation  
- **Status Tracking:** View approval states and feedback in real time.

---

### 👨‍🏫 Teacher Features
- **Mentor Dashboard:** Centralized view of all assigned projects.
- **Evaluation & Grading:** Assess submissions and provide structured remarks.
- **AI Similarity Reports:** Automatically detect semantically similar project ideas to prevent duplication.

---

## 🤖 AI-Powered Similarity Engine

To ensure academic integrity, the system employs a **semantic similarity detection pipeline**:

1. Project synopses are converted into **vector embeddings** using SentenceTransformers.
2. Embeddings are indexed in **FAISS** for fast similarity search.
3. Top matches are analyzed using **Google Gemini (GenAI)**.
4. Faculty receive a **detailed similarity report** highlighting potential overlaps.

This approach detects **conceptual similarity**, not just keyword matches.

---

## 🛠️ Technology Stack

### 🔧 Backend (API & Intelligence)
- **Language:** Python 3.11+
- **Framework:** FastAPI
- **Database:** PostgreSQL (`psycopg2`)
- **Authentication:** JWT-based authentication
- **AI & ML:**  
  - SentenceTransformers (Text Embeddings)  
  - FAISS (Vector Similarity Search)  
  - Google GenAI (Gemini API)

---

### 🎨 Frontend (User Interface)
- **Framework:** React.js
- **Build Tool:** Vite
- **Styling:** Modern CSS (Responsive & Accessible UI)

---

## 📂 Project Structure

```bash
root/
├── backend/               # 🔧 Backend API & AI Engine
│   ├── main.py            # Application entry point
│   ├── auth.py            # Authentication & authorization
│   ├── database.py        # Database connection logic
│   ├── similarity_check/  # AI similarity detection module
│   └── requirements.txt   # Python dependencies
│
├── frontend/              # 🎨 Frontend React application
│   ├── src/
│   │   ├── pages/         # Login & dashboard pages
│   │   └── components/    # Reusable UI components
│   └── package.json       # Node.js dependencies
│
└── README.md              # Project documentation
