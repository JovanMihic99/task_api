import { Request, Response, NextFunction } from "express";


const handler = (err:Error, req:Request, res:Response, next:NextFunction)=>{
    console.error(err.stack);
    res.status(500).json({message: "server error: Something went wrong!"})
    return;
}

export default handler;