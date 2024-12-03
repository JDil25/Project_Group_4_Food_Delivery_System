const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const http = require('http');  // Required for HTTP server
const socketIo = require('socket.io');  // Required for socket.io

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);  // links '/api/auth' to the routes in 'auth.js'
app.use('/api/cart', cartRoutes); // Routes for Cart management
app.use('/api/orders', orderRoutes); // Routes for order scheduling and delivery tracking
app.use('/api/reviews', reviewRoutes);// Routes for customer ratings and reviews

// Create HTTP server and pass it to socket.io
const server = http.createServer(app);  // This creates the HTTP server
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// WebSocket setup for delivery tracking
io.on('connection', (socket) => {
    console.log('A user connected for delivery tracking');
    
    // Example: Real-time delivery status updates
    socket.on('updateDeliveryStatus', (data) => {
        console.log('Delivery update received:', data);
        io.emit('deliveryStatusUpdate', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected from delivery tracking');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
