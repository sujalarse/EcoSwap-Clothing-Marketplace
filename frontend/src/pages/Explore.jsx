import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Tag, RefreshCw } from 'lucide-react';

export default function Explore() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/clothing', {
        params: { search, category, location }
      });
      setItems(res.data);
    } catch (err) {
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="w-full space-y-6">
      {/* Full Width Search & Filter Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center w-full">
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full lg:flex-1">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search clothes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700 transition shrink-0">
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <select
            className="w-full sm:w-auto px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Jacket">Jackets</option>
            <option value="Coat">Coats</option>
            <option value="Jeans">Jeans</option>
            <option value="Dress">Dresses</option>
            <option value="Shirt">Shirts</option>
            <option value="T-Shirt">T-Shirts</option>
            <option value="Hoodie">Hoodies</option>
            <option value="Shoes">Shoes</option>
          </select>

          <input
            type="text"
            placeholder="Filter location (e.g. Nagpur)"
            className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Dynamic Fluid Grid Layout */}
      {loading ? (
        <div className="flex justify-center py-20">
          <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 text-gray-500 w-full">
          No clothing items found matching your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 w-full">
          {items.map((item) => (
            <Link
              key={item._id}
              to={`/clothing/${item._id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col w-full"
            >
              <img src={item.image} alt={item.title} className="h-56 w-full object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-800 text-base truncate">{item.title}</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
                      ~${item.estimatedValue}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.brand} • Size {item.size}</p>
                </div>

                <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Tag className="h-3.5 w-3.5 text-gray-400" />
                    <span>{item.condition}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{item.location}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}