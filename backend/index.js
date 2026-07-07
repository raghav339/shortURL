import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import dns from 'dns';
import authRoutes from './routers/authRoutes.js';
import dataRoutes from './routers/dataRoute.js'

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const app=express();
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173"
}));

app.use("/",authRoutes);
app.use("/",dataRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("MongoDB connected!"))
    .catch((err)=>console.log(err));

app.listen(3000,()=>{
    console.log("server is running!")
});