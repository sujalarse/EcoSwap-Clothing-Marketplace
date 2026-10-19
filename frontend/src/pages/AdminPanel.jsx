import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Users, ShoppingBag, ArrowRightLeft, Trash2, RefreshCw } from 'lucide-react';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchAdminData = async () => {
    try {
      const [statsRes, listingsRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/clothing')
      ]);
      setStats(statsRes.data);
      setListings(listingsRes.data);
    } catch (err) {
      alert('Access denied or error fetching admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteListing = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    try {
      await axios.delete(`/api/admin/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminData();
    } catch (err) {
      alert('Error deleting listing');
    }
  };

  if (loading) return <div className="flex justify-center py-16"><RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
        <Shield className="h-7 w-7 text-amber-500" />
        <span>Admin Management Panel</span>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <ShoppingBag className="h-8 w-8 text-emerald-500" />
          <div>
            <p className="text-xs text-gray-500">Total Listings</p>
            <p className="text-xl font-bold text-gray-800">{stats?.totalListings || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <ShoppingBag className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500">Active Listings</p>
            <p className="text-xl font-bold text-gray-800">{stats?.activeListings || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <ArrowRightLeft className="h-8 w-8 text-amber-500" />
          <div>
            <p className="text-xs text-gray-500">Completed Swaps</p>
            <p className="text-xl font-bold text-gray-800">{stats?.successfulSwaps || 0}</p>
          </div>
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Moderate Marketplace Listings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Brand</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Value</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.title}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.brand}</td>
                  <td className="p-3">{item.owner?.name || 'Unknown'}</td>
                  <td className="p-3">${item.estimatedValue}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteListing(item._id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded transition"
                      title="Remove Listing"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}