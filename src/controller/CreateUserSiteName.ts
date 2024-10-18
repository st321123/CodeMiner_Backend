import express, { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
const route = express.Router();
const prisma = new PrismaClient();
const middleware= require('../middleware');


route.post('/',middleware, async(req:Request, res:Response) :Promise<any> =>{

    const {profileName, siteName,valid,userId } = req.body;

    if(!valid || !profileName || !siteName || !userId)
    {
         res.status(404).json({
            msg:"User name not found "
        })
    }
    
    try{
        const findd = await prisma.userName.findFirst({
            where:{

                siteName: siteName,
                authorId:userId
              
            }
        })
            console.log("this is find ");
            
        if(findd)
        {
           return  res.status(400).json({
                msg :"Only one profile  can be displayed at once "
            })
        }
    }
    catch(error){

         return res.json({
            msg:"Internal server error ",
            error
        })
    }
    
    try{
    const createUserName = await prisma.userName.create({
    
        data:{profileName : profileName , siteName:siteName ,authorId:userId}
     })

    //  console.log("This is createed User ", createUserName);
     
     res.json({
        msg:"userName inserted successfully "
     })
    }
    catch(error)
    {
      
        
        return  res.status(400).json({
            msg:"Internal Server Error ",
            error
        })
    }






   
})





module.exports = route;