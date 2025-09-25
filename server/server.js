import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware,requireAuth} from '@clerk/express'
import aiRouter from './routes/airoutes.js';
import connectCloudinary from './configs/cloudinary.js';



const app =express();

await connectCloudinary();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

app.get('/',(req,res)=>res.send('server is running'))

app.use(requireAuth())

app.use('/api/ai',aiRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>console.log(`server is running on port ${PORT}`))