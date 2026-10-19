import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { RefreshCw, Send, MessageSquare, ArrowRightLeft, Check, X, CheckCircle } from 'lucide-react';

let socket;

export default function SwapsAndChat() {
  const [swaps, setSwaps] = useState([]);
  const [activeSwap, setActiveSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    socket = io(); // Connects to same origin host in production
    fetchSwaps();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeSwap) {
      socket.emit('join_room', activeSwap._id);
      fetchMessages(activeSwap._id);

      socket.on('receive_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket.off('receive_message');
    };
  }, [activeSwap]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSwaps = async () => {
    try {
      const res = await axios.get('/api/swaps', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSwaps(res.data);
      if (res.data.length > 0) setActiveSwap(res.data[0]);
    } catch (err) {
      console.error('Error fetching swaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (swapId) => {
    try {
      const res = await axios.get(`/api/messages/${swapId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeSwap) return;

    socket.emit('send_message', {
      swapRequestId: activeSwap._id,
      senderId: currentUser.id,
      text: newMsg
    });

    setNewMsg('');
  };

  const handleUpdateStatus = async (swapId, status) => {
    try {
      await axios.put(`/api/swaps/${swapId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSwaps();
    } catch (err) {
      alert('Failed to update swap status');
    }
  };

  if (loading) return <div className="flex justify-center py-16"><RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
      {/* Swap Requests Sidebar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 overflow-y-auto space-y-3">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <ArrowRightLeft className="h-5 w-5 text-emerald-600" />
          <span>My Swap Requests</span>
        </h2>

        {swaps.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No swap requests found.</p>
        ) : (
          swaps.map((swap) => {
            const isSender = swap.sender._id === currentUser.id;
            const otherUser = isSender ? swap.receiver : swap.sender;
            const isSelected = activeSwap?._id === swap._id;

            return (
              <div
                key={swap._id}
                onClick={() => setActiveSwap(swap)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                  <span>{isSender ? 'Outgoing to' : 'Incoming from'}: <strong>{otherUser?.name}</strong></span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${
                    swap.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                    swap.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    swap.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {swap.status}
                  </span>
                </div>

                <div className="text-sm font-medium text-gray-800 truncate">
                  Offer: {swap.itemOffered?.title} ⇄ Get: {swap.itemRequested?.title}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Negotiation Chat Box */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
        {activeSwap ? (
          <>
            {/* Header / Actions */}
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div>
                <h3 className="font-bold text-gray-800">
                  Negotiating Swap #{activeSwap._id.slice(-6)}
                </h3>
                <p className="text-xs text-gray-500">
                  Offered: {activeSwap.itemOffered?.title} (~${activeSwap.itemOffered?.estimatedValue}) \vert{} Requested: {activeSwap.itemRequested?.title} (~${activeSwap.itemRequested?.estimatedValue})
                </p>
              </div>

              {/* Status Controls */}
              <div className="flex space-x-2">
                {activeSwap.receiver._id === currentUser.id && activeSwap.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(activeSwap._id, 'accepted')}
                      className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 text-xs flex items-center space-x-1"
                    >
                      <Check className="h-4 w-4" /> <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(activeSwap._id, 'rejected')}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 text-xs flex items-center space-x-1"
                    >
                      <X className="h-4 w-4" /> <span>Reject</span>
                    </button>
                  </>
                )}

                {activeSwap.status === 'accepted' && (
                  <button
                    onClick={() => handleUpdateStatus(activeSwap._id, 'completed')}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-xs flex items-center space-x-1"
                  >
                    <CheckCircle className="h-4 w-4" /> <span>Mark Completed</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {messages.map((m, idx) => {
                const isMe = m.sender._id === currentUser.id || m.sender === currentUser.id;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                      isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      <p className="text-[10px] opacity-75 mb-0.5">{m.sender?.name || 'User'}</p>
                      <p>{m.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t flex space-x-2">
              <input
                type="text"
                placeholder="Discuss exchange details..."
                className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
              />
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
                <Send className="h-5 w-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
            <MessageSquare className="h-12 w-12" />
            <p>Select a swap request from the left sidebar to start negotiating.</p>
          </div>
        )}
      </div>
    </div>
  );
}