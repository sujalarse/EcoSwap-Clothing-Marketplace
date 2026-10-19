import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, User, LogOut, Shield, MessageSquare, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wide shrink-0">
          <RefreshCw className="h-6 w-6 text-emerald-300 animate-spin-slow" />
          <span>EcoSwap</span>
        </Link>

        <div className="flex items-center space-x-4 sm:space-x-6 font-medium text-sm sm:text-base">
          <Link to="/" className="hover:text-emerald-200 transition">Explore</Link>

          {token ? (
            <>
              <Link to="/add-item" className="flex items-center space-x-1 hover:text-emerald-200 transition">
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">List Item</span>
              </Link>
              <Link to="/swaps" className="flex items-center space-x-1 hover:text-emerald-200 transition">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">My Swaps</span>
              </Link>
              <Link to="/dashboard" className="flex items-center space-x-1 hover:text-emerald-200 transition">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center space-x-1 text-amber-300 hover:text-amber-100 transition">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-emerald-800 hover:bg-emerald-900 px-3 py-1.5 rounded-lg transition"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="space-x-2 sm:space-x-3">
              <Link to="/login" className="hover:text-emerald-200 transition">Login</Link>
              <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 px-3 sm:px-4 py-1.5 rounded-lg transition">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}