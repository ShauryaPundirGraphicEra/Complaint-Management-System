
# 🏛️ GovResolve: AI-Driven Civic Issue Resolution Platform

![React](https://img.shields.io/badge/Frontend-React.js-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![AI](https://img.shields.io/badge/AI-HuggingFace_Qwen2.5-orange)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC)

**GovResolve** is a modern, full-stack civic technology platform designed to streamline communication between citizens and government departments. By integrating an **AI-powered LLM routing engine**, the system completely automates the triage and assignment of civic complaints, eliminating bureaucratic delays and ensuring accountability[cite: 129, 133].

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key AI / ML Features](#-key-aiml-features)
3. [System Architecture](#-system-architecture)
4. [Tech Stack](#-tech-stack)
5. [Core Features](#-core-features)
6. [Installation & Local Setup](#-installation--local-setup)
7. [How the Engine Works](#-how-the-engine-works)

---

## 🎯 Project Overview
Traditional municipal complaint systems suffer from manual triage, misrouted tickets, and a lack of transparency. 

**GovResolve** digitizes this process. [cite_start]Citizens can easily upload geolocated, image-backed complaints for categories like Road, Water, Electricity, and Garbage[cite: 91, 92]. [cite_start]Instead of waiting for a human dispatcher, the backend leverages a powerful Large Language Model (LLM) to read the complaint and instantly assign it to the correct, verified government officer based on their department and location[cite: 132].

---

## 🧠 Key AI/ML Features
* [cite_start]**Automated LLM Triage:** Integrates the `Qwen/Qwen2.5-7B-Instruct` model via the HuggingFace Inference API[cite: 129, 133]. 
* [cite_start]**Context-Aware Assignment:** The AI analyzes the complaint's title, description, category, and geolocation, compares it against a live JSON payload of verified government officers, and deterministically outputs the exact MongoDB `ObjectId` of the best assignee[cite: 132, 135].
* [cite_start]**Zero-Hallucination Prompting:** Utilizes strict system-level prompt engineering and a low temperature (`0.1`) to ensure the LLM strictly returns a database ID without any conversational filler or markdown[cite: 135, 136].

---

## 🏗 System Architecture

Built on a decoupled **MERN-style Architecture**:

1. **Client Tier (React & Vite):** A highly responsive, Tailwind-styled frontend. [cite_start]It uses `@tanstack/react-query` for aggressive caching, background data polling, and real-time UI updates (e.g., live upvote counts and notification bells)[cite: 148, 165].
2. [cite_start]**Security & Routing (Express/Node):** Implements a robust 3-tier Role-Based Access Control (RBAC) system separating Citizens, Officers, and Admins[cite: 95]. [cite_start]JWT signatures are verified recursively across different secret keys depending on the user's role[cite: 78, 79, 80].
3. [cite_start]**Storage & Database:** MongoDB handles relational data (Users, Complaints, Comments), while Cloudinary serves as the CDN for storing high-resolution complaint evidence and user profile photos[cite: 110].

---

## 💻 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | [cite_start]React.js, Vite, Tailwind CSS, TanStack Query, React Router, Lucide Icons [cite: 145, 146, 148, 160] |
| **Backend** | [cite_start]Node.js, Express.js, JWT, Bcrypt, Zod (Validation), Multer [cite: 34, 36, 64, 85] |
| **Database** | MongoDB (Mongoose) |
| **External APIs** | [cite_start]Hugging Face (AI Routing), Cloudinary (Image CDN), Nodemailer (SMTP) [cite: 110, 129, 141] |

---

## ⚡ Core Features
* **Community Support System:** Citizens can "Support" (upvote) public complaints. [cite_start]The interface prevents officers from manipulating votes on their own assigned cases[cite: 23, 272].
* [cite_start]**Automated SMTP Notifications:** The system sends highly formatted HTML emails directly to citizens whenever an officer registers an action (Assigned, In-Progress, Resolved, Rejected)[cite: 29, 30, 32].
* [cite_start]**Officer Verification Portal:** To prevent impersonation, users registering as "Officers" must be manually verified by an Admin (`isVerified: true`) before gaining portal access[cite: 55, 56, 97].
* [cite_start]**Real-time Dashboards:** Dedicated views for Citizens (Community Complaints) and Officers (My Assigned Cases)[cite: 261].

---

## 🚀 Installation & Local Setup

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas connection string
* Cloudinary Account
* Hugging Face Account (for API Token)
* Gmail/SMTP Account (for email dispatch)

### Step 1: Clone the Repository
```bash
git clone [https://github.com/YourUsername/GovResolve.git](https://github.com/YourUsername/GovResolve.git)
cd GovResolve

```

### Step 2: Setup Backend

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` directory with the following keys:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string

# Authentication Secrets
JWT_SECRET=your_citizen_secret
JWT_SECRET_OFFICER=your_officer_secret
JWT_SECRET_ADMIN=your_admin_secret

# Cloudinary CDN
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AI Routing
HUGGINGFACE_API_TOKEN=your_huggingface_token

# Email Notifications
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@govresolve.com

```

Start the backend server:

```bash
npm start

```

### Step 3: Setup Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install

```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api/v1

```

Start the Vite development server:

```bash
npm run dev

```

The application will be live at `http://localhost:5173`.

---

## 🧩 How the Engine Works (Lifecycle of a Complaint)

1. **Ingestion (`/api/v1/complaint`):** A citizen submits a form with images. `Multer` intercepts the request, saves the images to disk locally, and `Cloudinary.js` pushes them to the cloud CDN.


2. **AI Assignment (`predictOfficer`):** Before the ticket is saved, the Node server packages the location and text data, fetching all `isVerified=true` officers. It calls HuggingFace, which returns the exact MongoDB ID of the correct official.


3. **Persistence & Notification:** The complaint is saved with the assigned officer's ID. An email is dispatched via `Nodemailer` to the citizen confirming receipt.


4. 
**Resolution:** The assigned officer logs into their specialized dashboard, reviews the attached images, and updates the status to `Resolved`, instantly triggering an email update to the citizen.



```

```
