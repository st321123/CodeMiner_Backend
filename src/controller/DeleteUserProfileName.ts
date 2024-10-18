import { PrismaClient } from '@prisma/client';
import { error } from 'console';
import express, {Response, Request} from 'express'
const middleware = require('../middleware');
const route = express.Router();

const prisma = new PrismaClient();

route.delete("/",middleware, async(req:Request, res:Response): Promise<any>=>{

    const {profileName,siteName} = req.body;
    

    try{
        const findd =await prisma.userName.findFirst({
            where:{
              profileName: profileName,
              siteName:siteName
            }
        })

        if(!findd)
        {
           return res.status(400).json({
                msg:"Profile not exist ",
                error
            })
        }
        console.log("This is details of user ",findd);


        const deleted = await prisma.userName.delete({
            where: {
                id:findd.id,
                authorId: findd.authorId
              
        
            }
        });
        res.status(200).json({
            msg:"Profile name deleted"
        })
        console.log(deleted);
    }
   
 catch(error)
    {
        return  res.status(400).json({
            msg:"Internal server error ",
            error
        })
    }



})
module.exports = route;