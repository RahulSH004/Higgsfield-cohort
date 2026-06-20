import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { AppError } from "./error.middleware";

const JWT_SECRET = process.env.JWT_SECRET!

export function authentication(req: Request,res: Response, next: NextFunction){

    const token  = req.cookies?.token
    if(!token){
        throw new AppError(401, "No Token");
    }

    try{
        const payload = jwt.verify(token, JWT_SECRET) as {
            userId: string,
            email: string
        }
        req.user = {
            userId: payload.userId,
            email: payload.email
        }
        next()
    }catch(error){
        if(error instanceof jwt.TokenExpiredError){
            throw new AppError(401, "Token Expired")
        }
        throw new AppError(401, "Invalid Token")
    }
}