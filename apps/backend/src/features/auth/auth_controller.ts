import { Request, Response, NextFunction } from "express";
import { AuthSignInSchema, AuthSignupSchema } from "./auth_schema";
import { AuthSignIn, AuthSignup } from "./auth_service";
import jwt from 'jsonwebtoken'
import { AppError } from "../../middleware/error.middleware";

const JWT_SECRET = process.env.JWT_SECRET!;
const Isprod = process.env.NODE_ENV==='production'

const COOKIE_OPTION = {
    httpOnly: true,
    secure: Isprod,
    sameSite: 'lax' as const,
    maxAge: 7*24*60*60*1000
}

export async function Signup(req: Request, res: Response, next: NextFunction){
    try{
        const input = AuthSignupSchema.safeParse(req.body)
        if(!input.success){
            throw new AppError(400,'Validation Error ,Please check your email and password(password should be minimum 8 digits)')
        }

        const user =  await AuthSignup(input.data)

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            JWT_SECRET,
            {expiresIn: '7d'}
        )
        res.cookie('token', token, COOKIE_OPTION)

        res.status(201).json({
            data: user
        })
    }catch(error){
        next(error)
    }
}

export async function SignIn(req: Request, res: Response, next: NextFunction){

    try{
        const input = AuthSignInSchema.safeParse(req.body)
        if(!input.success){
            throw new AppError(400,'Validation Error ,Please check your email and password')
        }
        const user = await AuthSignIn(input.data)

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            JWT_SECRET,
            {expiresIn: '7d'}
        )
        res.cookie('token', token, COOKIE_OPTION)

        res.status(201).json({
            data: user
        })
    }catch(error){
        next(error)
    }
}

export async function Logut(req: Request, res: Response){
    res.clearCookie('token', COOKIE_OPTION)
    res.json({message: 'Logged Out'})
}