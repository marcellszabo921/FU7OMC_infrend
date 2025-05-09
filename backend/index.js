import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import postRoute from './routes/post.js';
import cookieParser from 'cookie-parser';
import rentalSystemRoute from './routes/rentalSystem.js';


dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:4200",
    credentials: true
}));

app.use("/api/role", roleRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute)
app.use('/api/rentalSystem', rentalSystemRoute);

//Error Handler
app.use((err, req, res, next)=>{
    const statusCode = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: errorMessage,
    })
});

//ObjSuccess Handler
app.use((obj, req, res, next) => {
    if (!obj || typeof obj !== 'object' || !obj.status) {
        return next(); // nem success response
    }

    const statusCode = obj.status || 200;
    return res.status(statusCode).json({
        success: [200,201,204].includes(statusCode),
        status: statusCode,
        message: obj.message,
        data: obj.data
    });
});


//Database connection
const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        throw error;
    }
} 

app.listen(5000, () => {
    connectMongo();
    console.log('Server is running on port 5000');
});