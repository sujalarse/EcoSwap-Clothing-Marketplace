import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, MapPin, Tag, RefreshCw } from 'lucide-react';

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profRes, itemsRes] = await Promise.all([
          axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/clothing')
        ]);
        setProfile(profRes.data);
        setMyItems(itemsRes.data.filter(i => i.owner._id === currentUser.id));
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <div className="flex justify-center py-16"><RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <div className="bg-emerald-100 text-emerald-800 p-4 rounded-full">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{profile?.name}</h1>
          <p className="text-sm text-gray-500">{profile?.email} • Location: <strong>{profile?.location}</strong></p>
          <span className="inline-block mt-2 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            Role: {profile?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* User's Listings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">My Clothing Listings ({myItems.length})</h2>
        {myItems.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-gray-100">
            You haven't listed any clothing items yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {myItems.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800">{item.title}</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                      ~${item.estimatedValue}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.brand} • {item.condition}</p>
                  <div className="mt-3 pt-2 border-t flex justify-between items-center text-xs">
                    <span className="capitalize font-semibold text-gray-600">Status: {item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}