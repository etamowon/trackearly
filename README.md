# 🧭 TrackEarly

**TrackEarly** is a lightweight task management web app — a minimal MVP designed to handle task creation, updates, and tracking.
It’s built on the **MERN stack** and deployed via **Vercel** (frontend) and **Railway** (backend).

🌐 **Live Demo:** [https://trackearly.vercel.app](https://trackearly.vercel.app)
🛠️ **API Endpoint:** [https://trackearly-production.up.railway.app/api/health](https://trackearly-production.up.railway.app/api/health)

-----

## 🚀 Overview

TrackEarly is currently in its MVP stage, providing a basic to-do list experience with a focus on clean structure and modular scalability.
The goal is to evolve this project into a full-featured personal productivity platform with user authentication, persistent data, and a more dynamic UI.

-----

## 🧱 Tech Stack

### **Frontend**

  - ⚛️ **React** (Create React App)
  - 🎨 **Tailwind CSS** for styling
  - 🌍 **Vercel** for deployment
  - 🌐 Environment variables for API connection (`REACT_APP_API_URL`)

### **Backend**

  - 🧩 **Node.js + Express**
  - 🗄️ **MongoDB Atlas** (via **Mongoose**)
  - 🛠️ **Railway** for hosting
  - 🔐 Environment variables via `.env`
  - 🌍 RESTful routes for CRUD task management

### **Directory Structure**

```
trackearly/
├── backend/
│ ├── config/db.js # MongoDB connection logic
│ ├── controllers/taskController.js # Task CRUD operations
│ ├── models/Task.js # Mongoose task schema
│ ├── routes/tasks.js # Express task routes
│ ├── server.js # App entry point
│ ├── package.json
│ └── .env
│
└── frontend/
├── src/
│ ├── services/api.js # Axios/fetch API utilities
│ ├── App.js # Root React component
│ ├── index.js # Entry point
│ └── index.css # Global styles
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env
```

-----

## ⚙️ Features (MVP)

  - Create, view, and delete tasks
  - Persistent storage via MongoDB Atlas
  - Simple REST API structure
  - Responsive frontend powered by Tailwind
  - Deployed full-stack setup (Railway + Vercel)

-----

## 🧭 Planned Features

  - 🔑 User authentication (JWT-based login/signup)
  - 📧 Email notification or verification system
  - 🖼️ Enhanced UI/UX (unique dashboard layout & animations)
  - S Task categories, due dates, and reminders
  - 📊 Analytics or productivity stats
  - ☁️ Improved deployment pipeline (CI/CD + staging)

-----

## 🧪 Local Development

### **1. Clone the repo**

```bash
git clone https://github.com/yourusername/trackearly.git
cd trackearly
```

### **2. Backend setup**

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGODB_URI=<your-mongo-uri>
```

Start the server:

```bash
npm start
```

### **3. Frontend setup**

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm start
```

-----

## 📦 Deployment

  - **Frontend:** [Vercel](https://vercel.com)
    Environment variable → `REACT_APP_API_URL=https://trackearly-production.up.railway.app/api`
  - **Backend:** [Railway](https://railway.app)
    Environment variable → `MONGODB_URI` (Atlas URI)

-----

## 📄 License

This project is licensed under the **MIT License** — feel free to fork and experiment.

-----

## ✨ Author

**Etam Tamo Wonkam**
🔗 [GitHub](https://github.com/yourusername)
📧 (optional) [etamwonkam@email.com](mailto:etamwonkam@email.com)
