import { PrismaClient, User } from "@prisma/client";
import { Request,Response } from "express";
require('dotenv').config();
import jwt from "jsonwebtoken";
const express = require('express');
const zod = require('zod');
const prisma = new PrismaClient();
const app = express();
const route = express.Router();
const sign = zod.object({

    email : zod.string().email({msg:"Invalid email"}),
    password : zod.string().min(8,{msg:"Inavlid password"})
})

route.post('/',async (req:Request, res:Response)=>{

    const JWT_PASSWORD = process.env.JWT_PASSWORD;

    if (!JWT_PASSWORD) 
        {
            return res.status(500).json({ message: "Internal server error. Missing JWT secret." });
        }

    const validate = sign.safeParse(req.body);

    if(!validate.success)
    {   
        return res.status(400).json({
            msg:validate.error.errors[0].message
        })
    }

    const {email,password}= req.body;
    try{
    const signnedIn:User | null = await prisma.user.findFirst({
        where:{
                 email:email,
                 password: password
              }

    })
    if(!signnedIn)
    {
        return res.status(400).json({
            msg:"Invalid id or password"
        })
    }

    const token = jwt.sign(signnedIn.id,JWT_PASSWORD);

    // console.log(token);
    
    return res.status(200).json({
        msg:"User logged in ",
        token
    })
} catch(error)
{
    console.error(error);
    return res.status(400).json({
        msg:"Internal server error",
        error:error
    })
}

    
})

module.exports = route;