
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/db.js';


import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';


import 'dotenv/config'; // Importing jwtpassword from env file to be used in usercontroller file
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';






// App configuration
const app = express();
const port = process.env.PORT || 4000; // Use PORT from environment variables if available

// Middleware
app.use(express.json());


// Use CORS middleware
app.use(cors());


// Database connection
connectDB().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.error('Database connection error:', err);
});

// API endpoints
app.use("/api/food", foodRouter);
app.use('/images', express.static('uploads')); // Serve static files, such as images, from the 'uploads' directory
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get('/', (req, res) => {
    res.send("API working");
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
