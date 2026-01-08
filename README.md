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

## Local Setup (Developer Mode)

Follow these steps to run the project on your local machine (Windows / Mac / Linux).

---

### Prerequisites
- Python 3.11+
- Node.js & npm
- PostgreSQL (running locally)

---

## Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv .venv

# Activate Virtual Environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Create a .env file and configure DB_URL and API_KEY
# (Refer to .env.example if available)

# Run the Server
uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

---

## Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## Cloud Deployment (AWS / Linux)

Use the following scripts to deploy on an Ubuntu/Debian-based AWS EC2 instance.

---

## Backend Deployment Script

```bash
# ======================================
# 0. SYSTEM PREPARATION (ONE TIME)
# ======================================
sudo apt update
sudo apt install -y \
  python3-full \
  python3-venv \
  python3-dev \
  build-essential \
  pkg-config \
  libcairo2-dev \
  libpango1.0-dev \
  libgdk-pixbuf2.0-dev \
  libffi-dev \
  cmake \
  curl \
  git

# ======================================
# 1. CLEAN ANY OLD STATE
# ======================================
deactivate 2>/dev/null || true
rm -rf ~/dbmsproject/.venv
pip cache purge || true
sudo apt clean
sudo apt autoremove -y
df -h

# ======================================
# 2. CREATE & ACTIVATE VENV
# ======================================
cd ~/dbmsproject
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip

# ======================================
# 3. INSTALL CPU-ONLY PYTORCH
# ======================================
pip install torch torchvision torchaudio \
  --index-url https://download.pytorch.org/whl/cpu \
  --no-cache-dir

# Verify Torch
python - <<EOF
import torch
print("Torch version:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())
EOF

# ======================================
# 4. INSTALL DEPENDENCIES
# ======================================
pip install \
  psycopg2-binary \
  faiss-cpu \
  sentence-transformers \
  numpy \
  google-genai \
  python-dotenv \
  openai \
  markdown \
  pycairo \
  xhtml2pdf \
  fastapi \
  uvicorn \
  --no-cache-dir

# ======================================
# 5. RUN BACKEND
# ======================================
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Frontend Deployment Script

```bash
# ======================================
# 0. SYSTEM PREPARATION
# ======================================
sudo apt update
sudo apt install -y curl git unzip

# Install Node.js (LTS 20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v
npm -v

# ======================================
# 1. CLEAN OLD STATE
# ======================================
cd ~/dbmsproject/frontend
rm -rf node_modules dist package-lock.json
npm cache clean --force

# ======================================
# 2. INSTALL DEPENDENCIES
# ======================================
npm install

# ======================================
# 3. BUILD PROJECT
# ======================================
npm run build

# ======================================
# 4. SERVE FRONTEND
# ======================================
sudo npm install -g serve
serve -s dist -l 5173
```

---

## Important Notes for Cloud Deployment

### Security Groups
Allow inbound traffic on:
- 8000 → Backend
- 5173 → Frontend

### Environment Variables
Create a `.env` file inside `backend/` with:
- PostgreSQL connection string
- Gemini API Key

### Background Processes
To keep services running after logout:

```bash
nohup uvicorn main:app --host 0.0.0.0 --port 8000 &
```



