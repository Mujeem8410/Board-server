import express from 'express';
import http from 'http'; // 🔥 Required for socket.io
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import actionRoutes from './routes/actionRoutes.js';

dotenv.config();

// Setup Express
const app = express();
const server = http.createServer(app); // ⚠️ Express ko HTTP server ke through run kar rahe

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // ⚠️ In production, specify frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Make io globally available (optional)
app.set('io', io);

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use('/api/logs', actionRoutes);


// Socket Events
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
