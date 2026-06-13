# 💽 TrackEarly

> A premium full-stack productivity app with a custom Y2K-inspired glassmorphic design, drag-and-drop task management, nested subtasks, and delightful micro-interactions.

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Express](https://img.shields.io/badge/Express-API-black?logo=express)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)
![Railway](https://img.shields.io/badge/Railway-Backend-0B0D0E)

TrackEarly goes beyond basic CRUD functionality by combining advanced front-end interactions with a scalable backend architecture. Users can organize tasks, manage subtasks, reorder items through drag-and-drop, search by custom tags, and enjoy a polished experience designed around productivity and visual satisfaction.

---

## 🌐 Live Demo

**Frontend:** https://trackearly.vercel.app

**Backend Health Check:**  
https://trackearly-production.up.railway.app/api/health

---

## ✨ Features

### 🎨 Custom Y2K Glassmorphic Design
- Deep plum aesthetic with frosted glass panels
- Iridescent hover effects
- Responsive layout for desktop and mobile
- Smooth transitions and polished visual feedback

### 🖱️ Drag-and-Drop Task Reordering
- Reorder tasks with intuitive drag-and-drop controls
- Powered by Framer Motion
- Changes persist instantly to MongoDB

### 📋 Nested Subtasks
- Expand tasks into dedicated detail drawers
- Create and manage mini-checklists
- Track progress on larger goals

### 🔍 Smart Search & Tagging
- Add custom hashtags to tasks
- Real-time filtering and search
- Organize tasks by context such as:
  - `#work`
  - `#school`
  - `#gym`
  - `#personal`

### ⏰ Priorities & Due Dates
- Color-coded priority indicators
- Visual urgency cues
- Overdue tasks highlighted automatically

### 🎉 Dopamine-Friendly UX
- Custom toast notifications
- Confetti celebration on task completion
- Smooth animations throughout the application

### 🗑️ Bulk Actions
- Clear all completed tasks with a single click
- Keep active task lists clean and organized

---

## 🧱 Tech Stack

### Frontend

| Technology | Purpose |
|------------|----------|
| React | UI Development & State Management |
| Tailwind CSS | Styling & Custom Design System |
| Framer Motion | Drag-and-Drop & Animations |
| React Hot Toast | Notifications |
| Canvas Confetti | Completion Effects |
| Vercel | Deployment |

### Backend

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js | REST API |
| MongoDB Atlas | Database |
| Mongoose | Schema Modeling |
| Railway | Backend Hosting |

---

## 📁 Project Structure

```text
trackearly/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
│
└── README.md
```

---

## 🚀 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/trackearly.git
cd trackearly
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

---

## 📡 API Overview

### Tasks

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Health Check

```http
GET /api/health
```

Returns:

```json
{
  "status": "ok"
}
```

---

## 📦 Deployment

### Frontend (Vercel)

Environment Variables:

```env
REACT_APP_API_URL=https://trackearly-production.up.railway.app/api
```

### Backend (Railway)

Environment Variables:

```env
MONGODB_URI=your_atlas_connection_string
PORT=5000
```

---

## 🎯 What This Project Demonstrates

- Full-stack MERN development
- RESTful API design
- MongoDB schema modeling
- State management in React
- Responsive UI design
- Advanced animations with Framer Motion
- Drag-and-drop interactions
- Deployment and environment configuration
- Modern UX principles and micro-interactions

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Etam Wonkam**

- GitHub: https://github.com/YOUR_GITHUB_USERNAME
- LinkedIn: https://linkedin.com/in/YOUR_LINKEDIN

---

### ⭐ If you found this project interesting, consider giving it a star!
**Etam Tamo Wonkam**
🔗 [GitHub](https://github.com/yourusername)
📧 (optional) [etamwonkam@email.com](mailto:etamwonkam@email.com)
