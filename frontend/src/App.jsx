import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import AddItem from './pages/AddItem';
import ItemDetail from './pages/ItemDetail';
import SwapsAndChat from './pages/SwapsAndChat';
import UserDashboard from './pages/UserDashboard';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans w-full">
        <Navbar />
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/clothing/:id" element={<ItemDetail />} />
            <Route path="/swaps" element={<SwapsAndChat />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}