import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import 'dotenv/config';

// Controllers
import { displayAllMsg, saveMsg } from './controllers/messageControllers.js';

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname, 'public'));

// Connect to MongoDB
mongoose.connect(process.env.DB_URL)
  // backend server in port 8000
  .then(result => server.listen(8000))
  .catch(err => console.log(err));


// Create socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // frontend in port 3000
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE"]
  }
});


// io connect event
io.on('connection', socket => {
  // Send message to client
  // socket.emit('serverMsg', "Message From Server")
  // Listen to client message
  socket.on('clientMsg', data => {
    console.log(data);
    io.emit('serverMsg', data);
    // Send message to all other client
    // socket.broadcast.emit('serverMsg', data);
    // socket.emit('serverMsg', data);
  })
})

// Routes
app.get('/msg', displayAllMsg);
app.post('/msg', saveMsg);
