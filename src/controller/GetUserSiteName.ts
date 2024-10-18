import express, { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
const route = express.Router();
const prisma = new PrismaClient();
const  middleware = require('../middleware');

route.get('/',middleware,async(req:Request, res:Response) :Promise<any>=>{

    const {siteName,userId} = req.body;

    try{
        const findUserName = await prisma.userName.findFirst({

            where:{
                siteName: siteName,
                authorId:userId


            }
        })

        // console.log("this is user ",findUserName);
        if(!findUserName)
        {

          return res.status(404).json({
                msg:"UserName  Not found "
            })
        }

        
            res.status(200).json({
                msg:"User name exists ",
                siteName,
                profileName:findUserName.profileName
            })
        
        
       
        
    }
    catch(err)
    {
        // console.error(err);

        res.json({
            msg:"Internal server error "
        })
    }
    
   
})


module.exports = route;