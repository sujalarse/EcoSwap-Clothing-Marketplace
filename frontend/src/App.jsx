import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import ItemDetail from './pages/ItemDetail';
import Dashboard from './pages/Dashboard';
import SwapRequests from './pages/SwapRequests';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      <Navbar /> {/* <-- Make sure this is uncommented and active */}
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/swaps" element={<SwapRequests />} />
          <Route path="/chat/:swapId" element={<Chat />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;