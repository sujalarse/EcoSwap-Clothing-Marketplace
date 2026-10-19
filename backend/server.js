const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log(`Connected to MongoDB Atlas! Active DB: ${mongoose.connection.name}`))
  .catch((err) => console.log('Database connection error:', err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clothing', require('./routes/clothing'));
app.use('/api/swaps', require('./routes/swaps'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));

// Real-time Negotiation Chat Socket Handlers
io.on('connection', (socket) => {
  console.log(`User connected to chat: ${socket.id}`);

  // User joins a private negotiation room for a swap
  socket.on('join_room', (swapRequestId) => {
    socket.join(swapRequestId);
    console.log(`User joined room: ${swapRequestId}`);
  });

  // Handle sending a chat message
  socket.on('send_message', async (data) => {
    const { swapRequestId, senderId, text } = data;

    try {
      const newMessage = new Message({
        swapRequest: swapRequestId,
        sender: senderId,
        text
      });
      await newMessage.save();
      const populatedMsg = await Message.findById(newMessage._id).populate('sender', 'name');

      // Broadcast message to everyone in the negotiation room
      io.to(swapRequestId).emit('receive_message', populatedMsg);
    } catch (err) {
      console.error('Error saving chat message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Frontend Static Serving (Production Monorepo)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Express v5 SPA Fallback
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`EcoSwap Server running on port ${PORT}`);
});