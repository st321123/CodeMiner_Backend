import express, { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";
const app = express();
require('dotenv').config();
app.use(express.json());

interface AuthenticatedRequest extends Request {
    id?: string; // Add userId to the Request object
}
function middleware(req: AuthenticatedRequest,res:Response,next:NextFunction){
    const jwtSecret = process.env.JWT_PASSWORd;
    const authHeader:string | undefined  = req.headers.authorization;

    if (!authHeader) {
        // Respond with 403 Forbidden if the Authorization header is missing or not in the correct format
        return res.status(403).json({ msg: "No token provided or invalid format" });
    }
    
    const token: string | undefined = authHeader;

    console.log("This is token ", token);

    
    if(!token)
    {
        return res.status(400).json({
            msg:"Token not provided "
        })
    }
    if(!jwtSecret)
    {
        return res.status(400).json({
            msg:"Jwt secret is not defiend "
        })
    }
    try{
    
    const decoded:any = jwt.verify(token,jwtSecret);
     req.id =  decoded.id;
        next();
    
    }
    catch(error)
    {
        
        return res.status(403).json({
            msg:"User not logged in "
        });
    }
}

module.exports = middleware;