const express = require('express');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io'); // Import Socket.io
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Message = require('./models/Message');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Wrap Express inside Node HTTP server

// Configure Socket.io with production CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Socket.io Logic
io.on('connection', (socket) => {
  console.log(`User connected to chat: ${socket.id}`);

  // Join a specific chat room based on the swap ID
  socket.on('join_chat', (swapId) => {
    socket.join(swapId);
    console.log(`User joined room: ${swapId}`);
  });

  // Handle incoming messages
  socket.on('send_message', async (data) => {
    try {
      // Save message to database
      const newMessage = await Message.create({
        swapId: data.swapId,
        sender: data.senderId,
        receiver: data.receiverId,
        text: data.text
      });

      // Broadcast the message to the specific swap chat room
      io.to(data.swapId).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Message save error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('Clothing Swap API & Chat Server is running...');
});

const PORT = process.env.PORT || 4000;
// Make sure to use server.listen, NOT app.listen!
server.listen(PORT, () => {
  console.log(`Server & WebSocket running on port ${PORT}`);
});