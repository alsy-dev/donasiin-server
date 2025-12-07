import dotEnv from 'dotenv';
dotEnv.config();

import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';


import { connectDB } from './config/dbConn.js';

// API Router
import { router as donationsRouter } from './routes/donations.js';
import { router as loginRouter } from './routes/admin-login.js';
import { router as logoutRouter } from './routes/admin-logout.js';
import { router as registerRouter } from './routes/admin-register.js';
import { router as refreshRouter } from './routes/admin-refresh.js';

// Connect to MongoDB
connectDB();


// app.use()

const app = express();
const PORT = process.env.PORT || 3500;

// built-in middleware for JSON
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// Middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/donations', donationsRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/refresh', refreshRouter);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
