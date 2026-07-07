import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function authMiddleware(req,res,next)
{
    const token=req.headers["authorization"];
    if (!token ||token === "null" ||token === "undefined")
    {
        return res.status(401).json({
            message: "PLEASE SIGN IN!"
        });
    }
    try{
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        if(!decoded.username)
        {
            return res.json({
            message:"INVALID TOKEN!"
            })
        }
        req.username=decoded.username;
        next();
    }
    catch(err)
    {
        return res.status(401).json({
            message:"INVALID TOKEN!"
            })
    }

}