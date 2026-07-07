import urlShort from '../models/urlModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router=express.Router();

router.get("/",authMiddleware,async(req,res)=>{
    try
    {
        const username=req.username;
        const urls=await urlShort.find({
            username:username
        });
        res.json({
            message:"SUCCESS",
            urls:urls
        });
    }
    catch(err)
    {
        res.status(500).json({
            message:"INTERNAL SERVER ERROR"
        });
    }
});

router.post("/",authMiddleware,async(req,res)=>{
    try
    {
        const username=req.username;
        const {shortURL,orgURL,expireTime}=req.body;
        if (!shortURL || !orgURL || !expireTime) {
            return res.status(400).json({
                message: "Missing fields"
            });
        }
        const seconds = Number(expireTime);

        if (Number.isNaN(seconds) || seconds <= 0) {
            return res.status(400).json({
                message: "Invalid expiry time"
            });
        }
        const newTime=new Date(Date.now()+seconds*1000);

        const existing = await urlShort.findOne({
            shortURL: process.env.BASE_URL +"/"+ shortURL
        });

        if (existing) {
            return res.status(409).json({
                message: "SHORT URL ALREADY EXISTS"
            });
        }
        
        const url=await urlShort.create({
            username,orgURL,
            expireAt:newTime,
            checks:0,
            shortURL:process.env.BASE_URL+"/"+shortURL
        });

        res.json({
            url:url,
            message:"SUCCESS"
        });
    }
    catch(err)
    {
        res.status(500).json({
            message:"SERVER ERROR"
        })
    }
});

router.delete("/",authMiddleware,async(req,res)=>{
    try
    {
        const id=req.body.id;
        const result = await urlShort.deleteOne({
            _id: id,
            username: req.username
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "URL NOT FOUND"
            });
        }
        
        res.json({
            message:"SUCCESS"
        });
    }
    catch(err)
    {
        res.status(500).json({
            message:"SERVER ERROR"
        })
    }
});

router.get("/:b",async(req,res)=>{
    try
    {
        const shortURL=process.env.BASE_URL+"/"+ req.params.b;
        const urlData=await urlShort.findOne({
            shortURL
        });
        if (!urlData) {
            return res.status(404).json({
                message: "URL NOT FOUND"
            });
        }
        if (urlData.expireAt < new Date()) {
            return res.status(410).json({
                message: "URL EXPIRED"
       });
}

        await urlShort.updateOne(
            {_id:urlData._id},
            {$inc: { checks: 1 }}
        );
        res.redirect(urlData.orgURL);
    }
    catch(err)
    {
        res.status(500).json({
            message:"SERVER ERROR"
        });
    }
})

export default router;