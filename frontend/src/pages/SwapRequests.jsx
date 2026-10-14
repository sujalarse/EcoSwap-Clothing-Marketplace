import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Check, X } from 'lucide-react';

const SwapRequests = () => {
  const { user } = useContext(AuthContext);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSwaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSwaps = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/swaps`, config);
      setSwaps(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load swap requests.');
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (swapId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/swaps/${swapId}`, { status: newStatus }, config);
      fetchSwaps(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="text-center p-10 text-xl">Loading your swaps...</div>;
  if (error) return <div className="text-center p-10 text-xl text-red-600">{error}</div>;

  const incomingRequests = swaps.filter(swap => swap.owner._id === user._id);
  const outgoingRequests = swaps.filter(swap => swap.requester._id === user._id);

  const SwapCard = ({ swap, isIncoming }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-center mb-4 border-b pb-4">
        <div>
          <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
            swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
            swap.status === 'completed' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {swap.status}
          </span>
          <span className="ml-3 text-sm text-gray-500">
            {isIncoming ? `Requested by ${swap.requester.name}` : `Sent to ${swap.owner.name}`}
          </span>
        </div>
        <Link 
          to={`/chat/${swap._id}`}
          className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Negotiate / Chat
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        {/* Item 1 */}
        <div className="flex-1 flex items-center space-x-4">
          <img src={swap.offeredItem.images[0]} alt="Offered" className="w-16 h-16 object-cover rounded" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">{isIncoming ? 'They Offer' : 'You Offer'}</p>
            <p className="font-medium text-gray-900">{swap.offeredItem.title}</p>
          </div>
        </div>

        <div className="text-gray-400 font-bold">⇄</div>

        {/* Item 2 */}
        <div className="flex-1 flex items-center space-x-4">
          <img src={swap.requestedItem.images[0]} alt="Requested" className="w-16 h-16 object-cover rounded" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">{isIncoming ? 'You Give' : 'They Give'}</p>
            <p className="font-medium text-gray-900">{swap.requestedItem.title}</p>
          </div>
        </div>
      </div>

      {isIncoming && swap.status === 'pending' && (
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={() => handleUpdateStatus(swap._id, 'rejected')}
            className="flex items-center px-4 py-2 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 transition text-sm font-medium"
          >
            <X className="w-4 h-4 mr-1" /> Reject
          </button>
          <button 
            onClick={() => handleUpdateStatus(swap._id, 'accepted')}
            className="flex items-center px-4 py-2 bg-green-600 border border-transparent text-white rounded hover:bg-green-700 transition text-sm font-medium"
          >
            <Check className="w-4 h-4 mr-1" /> Accept Swap
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Swap Requests</h1>
      
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Incoming Requests</h2>
        {incomingRequests.length === 0 ? (
          <p className="text-gray-500">No one has requested to swap with you yet.</p>
        ) : (
          incomingRequests.map(swap => <SwapCard key={swap._id} swap={swap} isIncoming={true} />)
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">My Sent Offers</h2>
        {outgoingRequests.length === 0 ? (
          <p className="text-gray-500">You haven't sent any swap requests.</p>
        ) : (
          outgoingRequests.map(swap => <SwapCard key={swap._id} swap={swap} isIncoming={false} />)
        )}
      </div>
    </div>
  );
};

export default SwapRequests;