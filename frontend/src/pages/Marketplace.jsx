import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Tag, Search, Navigation } from 'lucide-react';

const Marketplace = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, locationFilter]); // Auto-fetch when dropdowns change

  const fetchItems = async () => {
    try {
      setLoading(true);
      let query = `${import.meta.env.VITE_API_URL}/api/items?`;
      if (search) query += `search=${search}&`;
      if (category) query += `category=${category}&`;
      if (locationFilter) query += `location=${locationFilter}`;

      const { data } = await axios.get(query);
      
      // Optional: Filter out the user's own items so they don't swap with themselves
      const availableToSwap = user 
        ? data.filter(item => item.owner._id !== user._id)
        : data;

      setItems(availableToSwap);
      setLoading(false);
    } catch (err) {
      setError('Failed to load marketplace items.');
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleNearMe = () => {
    if (user && user.location) {
      setLocationFilter(user.location);
    } else {
      alert("Please log in to use location-based matching.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Explore Swaps</h1>
          <p className="text-gray-600 mt-1">Discover and trade sustainable fashion.</p>
        </div>

        {/* Filter Controls */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearchSubmit} className="flex relative">
            <input 
              type="text" 
              placeholder="Search items..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-48"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <button type="submit" className="hidden">Search</button>
          </form>

          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="Jacket">Jackets</option>
            <option value="Shirt">Shirts</option>
            <option value="Dress">Dresses</option>
            <option value="Hoodie">Hoodies</option>
            <option value="Jeans">Jeans</option>
          </select>

          <button 
            onClick={handleNearMe}
            className="flex items-center justify-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition font-medium"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Near Me
          </button>
          
          {(search || category || locationFilter) && (
            <button 
              onClick={() => {
                setSearch('');
                setCategory('');
                setLocationFilter('');
              }}
              className="text-sm text-gray-500 hover:text-red-600 px-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center p-10 text-xl text-gray-600">Loading listings...</div>
      ) : error ? (
        <div className="text-center p-10 text-xl text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-500 py-16 bg-white rounded-lg border border-gray-200">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-lg font-medium">No matching items found.</p>
          <p className="text-sm mt-1">Try adjusting your filters or location.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <img 
                src={item.images[0] || 'https://via.placeholder.com/300'} 
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate">{item.title}</h3>
                <p className="text-indigo-600 font-medium text-sm mb-2">{item.brandName} • Size {item.size}</p>
                
                <div className="flex items-center text-gray-500 text-xs mb-1">
                  <Tag className="w-3 h-3 mr-1" />
                  <span>Condition: {item.condition}</span>
                </div>
                
                <div className="flex items-center text-gray-500 text-xs mb-4">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{item.location}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm font-bold text-gray-700">
                    Est. Value: ₹{item.estimatedValue}
                  </div>
                  <Link 
                    to={`/item/${item._id}`}
                    className="bg-gray-900 text-white text-xs px-3 py-2 rounded hover:bg-gray-800 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;