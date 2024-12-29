import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.json({ limit: "16kb" }))
app.use(cookieParser())

//routes import
import userRoutes from './routes/user.route.js';
//routes declaration
app.use('/api/v1/user', userRoutes);
export {app}
// http://localhost:5000/api/v1/user/register