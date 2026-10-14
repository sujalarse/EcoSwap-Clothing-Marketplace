import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Tag, ShieldCheck, ArrowRightLeft, Truck, Handshake } from 'lucide-react';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState('');
  const [exchangeMethod, setExchangeMethod] = useState('local'); // local or courier
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchItemAndUserInventory = async () => {
      try {
        const itemRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/items/${id}`);
        setItem(itemRes.data);

        if (user) {
          const allItemsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/items`);
          const userInventory = allItemsRes.data.filter(
            (i) => i.owner._id === user._id && i.status === 'available'
          );
          setMyItems(userInventory);
        }
        setLoading(false);
      } catch (err) {
        setRequestStatus({ type: 'error', message: 'Failed to load item details.' });
        setLoading(false);
      }
    };

    fetchItemAndUserInventory();
  }, [id, user]);

  const handleSwapRequest = async (e) => {
    e.preventDefault();
    if (!selectedOffer) {
      setRequestStatus({ type: 'error', message: 'Please select an item to offer.' });
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // We pass the exchange method in the request (can be logged in chat or swap notes)
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/swaps`,
        {
          offeredItemId: selectedOffer,
          requestedItemId: id,
          exchangeMethod
        },
        config
      );

      setRequestStatus({ type: 'success', message: `Swap request sent! (${exchangeMethod === 'courier' ? 'Courier Requested' : 'Local Meetup'})` });
      setTimeout(() => navigate('/swaps'), 2000);
    } catch (err) {
      setRequestStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send request.' });
    }
  };

  if (loading) return <div className="text-center p-10 text-xl">Loading details...</div>;
  if (!item) return <div className="text-center p-10 text-xl text-red-600">Item not found.</div>;

  const isOwner = user && item.owner._id === user._id;
  const selectedItemObj = myItems.find(i => i._id === selectedOffer);

  // Value Comparison Logic
  let valueDiff = 0;
  let fairnessMsg = "";
  let fairnessColor = "";

  if (selectedItemObj) {
    valueDiff = selectedItemObj.estimatedValue - item.estimatedValue;
    if (Math.abs(valueDiff) <= 300) {
      fairnessMsg = "Great Match (Highly Fair Trade)";
      fairnessColor = "bg-green-100 text-green-800 border-green-200";
    } else if (valueDiff > 300) {
      fairnessMsg = `You are offering more value (+₹${Math.abs(valueDiff)})`;
      fairnessColor = "bg-yellow-50 text-yellow-800 border-yellow-200";
    } else {
      fairnessMsg = `You are requesting more value (-₹${Math.abs(valueDiff)})`;
      fairnessColor = "bg-red-50 text-red-800 border-red-200";
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Image */}
        <div className="md:w-1/2">
          <img 
            src={item.images[0] || 'https://via.placeholder.com/600'} 
            alt={item.title}
            className="w-full h-full object-cover min-h-[400px]"
          />
        </div>

        {/* Right Side: Details & Action */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                {item.status}
              </span>
            </div>
            
            <p className="text-2xl text-indigo-600 font-bold mb-6">
              Est. Value: ₹{item.estimatedValue}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <Tag className="w-5 h-5 mr-3 text-gray-400" />
                <span><strong>Brand:</strong> {item.brandName} • <strong>Size:</strong> {item.size}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <ShieldCheck className="w-5 h-5 mr-3 text-gray-400" />
                <span><strong>Condition:</strong> {item.condition}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                <span><strong>Location:</strong> {item.location}</span>
              </div>
              <div className="flex items-center text-gray-700 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Listed by <span className="font-semibold text-gray-800">{item.owner.name}</span></span>
              </div>
            </div>
          </div>

          {/* Swap Request Action Area */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            {requestStatus.message && (
              <div className={`mb-4 p-3 rounded text-sm text-center font-medium ${requestStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {requestStatus.message}
              </div>
            )}

            {!user ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">You must be logged in to request a swap.</p>
                <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
                  Login to Swap
                </Link>
              </div>
            ) : isOwner ? (
              <div className="text-center text-gray-600 font-medium">
                This is your listing.
              </div>
            ) : (
              <form onSubmit={handleSwapRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select an item to offer:
                  </label>
                  {myItems.length === 0 ? (
                    <div className="text-sm text-red-600 mb-2">
                      No items available. Add items in your dashboard first.
                    </div>
                  ) : (
                    <select
                      value={selectedOffer}
                      onChange={(e) => setSelectedOffer(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                    >
                      <option value="">-- Choose an item --</option>
                      {myItems.map(myItem => (
                        <option key={myItem._id} value={myItem._id}>
                          {myItem.title} (₹{myItem.estimatedValue})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Value Comparison Interface */}
                {selectedItemObj && (
                  <div className={`p-3 rounded-md border text-sm font-medium text-center ${fairnessColor}`}>
                    {fairnessMsg}
                  </div>
                )}

                {/* Courier / Exchange Method Integration */}
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Exchange Method:
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        value="local" 
                        checked={exchangeMethod === 'local'} 
                        onChange={() => setExchangeMethod('local')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 flex items-center"><Handshake className="w-4 h-4 mr-1 text-gray-500"/> Local Meetup</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        value="courier" 
                        checked={exchangeMethod === 'courier'} 
                        onChange={() => setExchangeMethod('courier')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 flex items-center"><Truck className="w-4 h-4 mr-1 text-gray-500"/> Courier Delivery</span>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={myItems.length === 0}
                  className={`w-full mt-4 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${myItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                >
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Send Swap Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;