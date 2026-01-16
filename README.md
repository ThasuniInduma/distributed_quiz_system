<p align="center">
  <img src="assets/logo.png" alt="QuizHub Logo" width="240"/>
</p>

<h2 align="center">Smart Quizzes. Distributed Intelligence.</h2>

---

## 🚀 QuizHub

QuizHub is a **distributed online quiz platform** designed to create, manage, and deliver quizzes securely at scale.  
It demonstrates **real-world distributed system principles** using modern cloud and web technologies.

---

## 🌐 Distributed System Architecture
<div align="center">

```text
┌────────────────────┐
│   Client Browser   │
└─────────┬──────────┘
          │ HTTPS
┌─────────▼──────────┐
│  React Frontend    │
│  (Web Application) │
└─────────┬──────────┘
          │ REST API
┌─────────▼──────────┐
│ Node.js + Express  │
│ Stateless Backend  │
└─────────┬──────────┘
          │ Mongoose
┌─────────▼──────────┐
│ MongoDB Atlas      │
│ Distributed Cloud  │
│ Database Cluster   │
└────────────────────┘

```
</div> 

---

### Why QuizHub is a Distributed System
- Frontend, backend, and database run as **independent services**
- Communication happens over **network-based REST APIs**
- Backend is **stateless and scalable**
- Database is cloud-hosted with replication support

---

## ✨ Features

### 👩‍🏫 Teacher Module
- Secure authentication (JWT)
- Create quizzes with multiple questions
- Add unlimited answer choices
- Select correct answers visually
- Manage only owned quizzes

### 📊 Quiz Management
- Auto-generated **Quiz IDs**
- Quiz scheduling (date & time)
- Custom duration
- Activate / deactivate quizzes
- Participant count tracking

### 🧠 Student Interaction
- Join quizzes using Quiz ID
- Secure delivery of questions
- No exposure of correct answers

---

## 🧩 Distributed System Characteristics

| Property | Implementation |
|--------|----------------|
| Distribution | Client / API / DB separated |
| Scalability | Stateless Node.js backend |
| Fault Isolation | Independent services |
| Security | JWT + protected routes |

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

---

## 🚀 Local Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/quizhub.git
cd quizhub
```
### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```
Create a .env file:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=4000
```
### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🍀 Thanks for checking out QuizHub! 🚀
# Happy quizzing and learning! 🧠🎉
