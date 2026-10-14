import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import { Send, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const { swapId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [swapDetails, setSwapDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user) return;

    // Initialize Socket.io connection
    socketRef.current = io(import.meta.env.VITE_API_URL);

    const fetchChatHistoryAndSwap = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch Swap Details to get the receiver's ID
        const swapRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/swaps`, config);
        const currentSwap = swapRes.data.find(s => s._id === swapId);
        setSwapDetails(currentSwap);

        // Fetch Message History
        const msgRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${swapId}`, config);
        setMessages(msgRes.data);
        setLoading(false);

        // Join the specific Socket.io room for this swap
        socketRef.current.emit('join_chat', swapId);
      } catch (error) {
        console.error('Failed to load chat:', error);
        setLoading(false);
      }
    };

    fetchChatHistoryAndSwap();

    // Listen for incoming messages in real-time
    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup socket on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [swapId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !swapDetails) return;

    // Determine who the receiver is (the other person in the swap)
    const receiverId = swapDetails.requester._id === user._id 
      ? swapDetails.owner._id 
      : swapDetails.requester._id;

    const messageData = {
      swapId,
      senderId: user._id,
      receiverId,
      text: newMessage
    };

    // Emit message to Socket.io server
    socketRef.current.emit('send_message', messageData);
    setNewMessage('');
  };

  if (loading) return <div className="text-center p-10">Loading chat...</div>;
  if (!swapDetails) return <div className="text-center p-10 text-red-600">Swap not found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-4 h-[calc(100vh-120px)] flex flex-col">
      {/* Chat Header */}
      <div className="bg-white p-4 border-b border-gray-200 rounded-t-lg shadow-sm flex items-center">
        <button onClick={() => navigate('/swaps')} className="mr-4 text-gray-500 hover:text-indigo-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Negotiation Chat</h2>
          <p className="text-xs text-gray-500">
            Discussing: {swapDetails.offeredItem.title} ⇄ {swapDetails.requestedItem.title}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 border-x border-gray-200">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No messages yet. Start the negotiation!</div>
        ) : (
          messages.map((msg, index) => {
            // Check if sender is an object (populated from DB) or an ID string (from Socket real-time)
            const senderId = msg.sender._id || msg.sender;
            const isMe = senderId === user._id;

            return (
              <div key={index} className={`mb-4 flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200 rounded-b-lg shadow-sm flex items-center">
        <form onSubmit={handleSendMessage} className="w-full flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit" 
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition flex items-center justify-center w-12"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;