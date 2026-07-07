import express from 'express';
import bcrypt from'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Users from '../models/usersModel.js'

const router=express.Router();
dotenv.config();

router.post("/signup",async(req,res)=>{

    try {
        const username = req.body.username?.trim();
        const password = req.body.password;
        if(!username || !password)
        {
            return (res.status(409).json({
                message:"Enter the deatils"
            }));
        }
        const present=await Users.findOne({
            username:username
        });

        if(present)
        {
            return (res.status(400).json({
                message:"User Already Present"
            }));
        }

        const hashed= await bcrypt.hash(password,10);
        await Users.create({
            username,
            password:hashed
        });
        res.json({
            message:"SUCCESS"
        });

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
})

router.post("/signin",async(req,res)=>{
    try 
    {
        const username = req.body.username?.trim();
        const password = req.body.password;
        if(!username || !password)
        {
            return (res.status(400).json({
                message:"Enter the deatils"
            }));
        }

        const user=await Users.findOne({
            username:username
        });

        if(!user)
        {
            return (res.status(404).json({
                message:"Invalid Username or Password"
            }));
        }

        const verify=await bcrypt.compare(password,user.password);
        if(!verify)
        {
            return (res.status(401).json({
                message:"Invalid Username or Password"
            }));
        }

        const token=jwt.sign({
            username:username
        },process.env.SECRET_KEY);

        res.json({
            message:"SUCCESS",
            token:token
        })

    } 
    catch (err) 
    {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
})

export default router;