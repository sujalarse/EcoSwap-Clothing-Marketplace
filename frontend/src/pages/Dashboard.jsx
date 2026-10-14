import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, Tag, MapPin } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clothingType: 'Jacket',
    brandName: '',
    brandTier: 'Standard',
    size: 'M',
    condition: 'Good',
    location: user?.location || '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchMyItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchMyItems = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/items`);
      // Filter items to only show the logged-in user's items
      const userItems = data.filter(item => item.owner._id === user._id);
      setMyItems(userItems);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch items', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const newItemData = {
        ...formData,
        images: formData.imageUrl ? [formData.imageUrl] : []
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/items`, newItemData, config);
      
      setShowForm(false);
      setFormData({ ...formData, title: '', brandName: '', imageUrl: '' }); // Reset text fields
      fetchMyItems(); // Refresh the grid
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/items/${id}`, config);
        fetchMyItems();
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  if (!user) return <div className="text-center p-10">Please log in to view your dashboard.</div>;
  if (loading) return <div className="text-center p-10">Loading your wardrobe...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wardrobe</h1>
          <p className="text-gray-600 mt-1">Manage your clothing listings and add new items to swap.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5 mr-1" /> Add New Item
        </button>
      </div>

      {/* Add New Item Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">List a New Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Listing Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="e.g., Vintage Blue Levi's Jacket" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="clothingType" value={formData.clothingType} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="Jacket">Jacket</option>
                <option value="Shirt">Shirt</option>
                <option value="Jeans">Jeans</option>
                <option value="Dress">Dress</option>
                <option value="Sneakers">Sneakers</option>
                <option value="Hoodie">Hoodie</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select name="size" value={formData.size} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Name</label>
              <input type="text" name="brandName" value={formData.brandName} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="e.g., Levi's, H&M, Zara" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Tier (Affects Value)</label>
              <select name="brandTier" value={formData.brandTier} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="Standard">Standard (Generic/Local)</option>
                <option value="MidTier">Mid-Tier (H&M, Uniqlo)</option>
                <option value="Premium">Premium (Zara, Nike, Levi's)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Condition</label>
              <select name="condition" value={formData.condition} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
                <option value="New with tags">New with tags</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" placeholder="https://example.com/image.jpg" />
            </div>

            <div className="col-span-1 md:col-span-2 mt-2 flex justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="mr-3 px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Post Listing</button>
            </div>
          </form>
        </div>
      )}

      {/* User's Items Grid */}
      {myItems.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-gray-200 shadow-sm">
          You haven't listed any items yet. Click "Add New Item" to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
              <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <img 
                src={item.images[0] || 'https://via.placeholder.com/300'} 
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate">{item.title}</h3>
                <p className="text-indigo-600 font-medium text-sm mb-2">Est. Value: ₹{item.estimatedValue}</p>
                
                <div className="flex items-center text-gray-500 text-xs mb-1">
                  <Tag className="w-3 h-3 mr-1" />
                  <span>{item.condition} • {item.size}</span>
                </div>
                
                <div className="flex items-center text-gray-500 text-xs mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    item.status === 'available' ? 'bg-green-100 text-green-800' : 
                    item.status === 'swapped' ? 'bg-gray-200 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;