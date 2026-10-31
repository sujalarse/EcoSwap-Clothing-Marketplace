# EcoSwap 🌱 

**EcoSwap** is a full-stack MERN marketplace built to promote sustainable fashion. It provides a dedicated platform for users to list, discover, and trade clothing items locally. Featuring an intelligent value-comparison engine and real-time negotiation chat, the platform ensures fair and seamless clothing swaps.

Developed as a capstone deliverable for the Full-Stack Web Development Internship at Unified Mentor Private Limited.

## 🚀 Live Demo
* **Render:** [https://ecoswap-clothing-marketplace.onrender.com](https://ecoswap-clothing-marketplace.onrender.com)

## ✨ Key Features
* **Authentication & Authorization:** Secure JWT-based user login and registration.
* **Smart Marketplace:** Browse available clothing items with a dynamic "Near Me" location filter.
* **Value Calculator:** Automated clothing value comparison badge during the swap request workflow to ensure fair trades.
* **Real-Time Negotiation:** Live messaging and chat rooms powered by Socket.io for users to negotiate swap terms.
* **Admin Dashboard:** Centralized control center for platform KPIs, user management, and listing moderation.
* **Cloud Database:** Hosted on MongoDB Atlas with comprehensive data seeding for seamless testing.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose
* **Real-Time Communication:** Socket.io
* **Deployment:** Render

## 💻 Local Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URL

### 1. Clone the Repository
```bash
git clone [https://github.com/sujalarse/EcoSwap-Clothing-Marketplace.git](https://github.com/sujalarse/EcoSwap-Clothing-Marketplace.git)
cd EcoSwap
```
### 2. Backend Setup
```bash
npm install
```
Create a .env file in the backend directory with the following variables:

```bash
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.tltzbi4.mongodb.net/clothing-swap?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```
Seed the database with sample users and clothing items:

```bash
node seeder.js
```
Start the server:

```bash
npm run dev
```

## 📂 Project Structure
```bash
EcoSwap/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic (auth, items, swaps, admin)
│   ├── middleware/      # JWT verification & Error handling
│   ├── models/          # Mongoose schemas (User, ClothingItem, Swap, Message)
│   ├── routes/          # Express API routes
│   ├── utils/           # Value calculator logic
│   ├── seeder.js        # Script to populate database with sample data
│   └── server.js        # Entry point & Socket.io configuration
│
└── frontend/
    ├── src/
    │   ├── assets/      # Static images and SVGs
    │   ├── components/  # Reusable UI components (Navbar, Cards, Badges)
    │   ├── context/     # React Context for global state (AuthContext)
    │   ├── pages/       # Page views (Marketplace, Login, SwapDetails, Admin)
    │   ├── App.jsx      # Main application router
    │   └── main.jsx     # React DOM rendering
    ├── .env             # Frontend environment variables
    └── vite.config.js   # Vite bundler configuration
```

## 👨‍💻 Author
Sujal Arse

B.Tech Computer Science & Engineering

Full-Stack Web Developer Intern @ Unified Mentor Private Limited