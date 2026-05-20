import "dotenv/config";

import express from 'express';
import cors from 'cors';

import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth.js';

import courseRoutes from './routes/courseRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import saveVideoRoutes from './routes/saveVideoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import payment from './routes/payment.js';
import './worker/PdfWorker.js'; // Start BullMQ PDF worker

const corsOptions = {
    origin: process.env.FRONTEND_URL,    // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'cookie'],
    credentials: true,
};
 

const app = express();
app.use(cors(corsOptions));
app.all("/api/auth/{*path}", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/course", courseRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/saveVideo", saveVideoRoutes);
app.use("/api/chat", chatRoutes);

app.use('/api/payment', payment);
app.use('/api/user', userRoutes);


app.get('/health', (req, res) => {
    console.log('Server is healthy.');
    res.json({message: 'Server is healthy.'})
});

 


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});