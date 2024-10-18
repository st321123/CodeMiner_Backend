import { PrismaClient, User } from "@prisma/client";
import{Request, Response } from "express"
import zod from "zod";
require('dotenv').config();
const express = require("express");
import jwt from "jsonwebtoken";



const router = express.Router();
const prisma = new PrismaClient();

const zd = zod.object({
    name: zod.string().min(1,{message:"Name should not be empty"}),
    email:zod.string().email({message:"Invalid email"}),
    password :zod.string().min(8,{message:"Invalid password"})
})

router.post('/', async(req:Request,res:Response)=>{

    const JWT_PASSWORD = process.env.JWT_PASSWORD;
    const result = zd.safeParse(req.body);

    if(!JWT_PASSWORD)
    {
        return res.status(400).json({
            msg:"JWT password is not provided "
        });
    }

    if(!result.success)
    {
        console.log(result.error.errors[0].message);
        
        return res.status(400).json({
            message: result.error.errors[0].message,
        
        });
    }




   const {email,password, name} = req.body;

   const exist = await prisma.user.findFirst({
    where:{
        email:email
    }
   })
//    console.log(exist);
   
   if(exist)
   {
    return res.status(400).json({
           msg:"Email id already exists "
    })
   }
   try{

   const userCreate :User  = await prisma.user.create({
    data:{
    name:name,
    email:email,
    password:password
    }
   })

   const userId : String = userCreate.id;
   const token = jwt.sign(userId, JWT_PASSWORD );

//    console.log("User created succesfuully",userCreate);
//    console.log("this is token ", token);
   
   return res.status(201).json({
    msg:"Signed up successfully ",
    token: token
   })
 } 
 catch(error:any)
 {

    console.error(error.message);
    res.status(500).json({
        msg:"Internal Server Error "
        
    })
}

})

module.exports = router;


