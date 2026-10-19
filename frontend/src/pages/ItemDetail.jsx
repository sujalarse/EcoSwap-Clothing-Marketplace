import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Tag, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [selectedOfferItem, setSelectedOfferItem] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`/api/clothing/${id}`);
        setItem(res.data);

        if (currentUser.id) {
          const token = localStorage.getItem('token');
          const myItemsRes = await axios.get('/api/clothing', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserItems(myItemsRes.data.filter(i => i.owner._id === currentUser.id && i.status === 'available'));
        }
      } catch (err) {
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleProposeSwap = async () => {
    if (!selectedOfferItem) return alert('Please select an item to offer');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/swaps',
        {
          receiverId: item.owner._id,
          itemOfferedId: selectedOfferItem,
          itemRequestedId: item._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpen(false);
      navigate('/swaps');
    } catch (err) {
      alert(err.response?.data?.message || 'Error proposing swap');
    }
  };

  if (loading) return <div className="flex justify-center py-16"><RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" /></div>;
  if (error || !item) return <div className="text-center py-16 text-red-600">{error || 'Item not found'}</div>;

  const isOwner = currentUser.id === item.owner._id;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <img src={item.image} alt={item.title} className="h-96 w-full object-cover" />

        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
              <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full">
                Estimated Value: ${item.estimatedValue}
              </span>
            </div>

            <p className="text-gray-500 font-medium mt-2">{item.brand} • Size {item.size}</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600 space-x-2">
                <Tag className="h-4 w-4 text-emerald-600" />
                <span>Condition: <strong>{item.condition}</strong></span>
              </div>
              <div className="flex items-center text-sm text-gray-600 space-x-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Location: <strong>{item.location}</strong></span>
              </div>
              <div className="flex items-center text-sm text-gray-600 space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Owner: <strong>{item.owner.name}</strong></span>
              </div>
            </div>
          </div>

          {!isOwner && item.status === 'available' && (
            <button
              onClick={() => setModalOpen(true)}
              className="w-full mt-8 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition flex justify-center items-center space-x-2"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Propose Swap Request</span>
            </button>
          )}

          {isOwner && (
            <div className="mt-8 bg-gray-100 text-gray-600 p-3 rounded-lg text-center text-sm font-medium">
              This is your listing.
            </div>
          )}
        </div>
      </div>

      {/* Swap Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Select Item to Offer</h3>
            <p className="text-sm text-gray-600">
              Select one of your available clothing items to offer in exchange for <strong>{item.title}</strong> (~${item.estimatedValue}):
            </p>

            {userItems.length === 0 ? (
              <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                You have no available items listed. Please list an item first before proposing a swap.
              </div>
            ) : (
              <select
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                value={selectedOfferItem}
                onChange={(e) => setSelectedOfferItem(e.target.value)}
              >
                <option value="">-- Choose Item --</option>
                {userItems.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.title} (~${i.estimatedValue})
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              {userItems.length > 0 && (
                <button
                  onClick={handleProposeSwap}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Confirm Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}