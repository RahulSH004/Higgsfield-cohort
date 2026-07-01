import { prisma } from "../../../db";
import bcrypt from 'bcrypt'
import type { AuthSignInSchema, AuthSignupSchema } from "./auth_schema";
import { AppError } from "../../middleware/error.middleware";

const SALT_ROUND = process.env.SALT_ROUND as string


export async function AuthSignup(input: AuthSignupSchema) {
    
    const existing = await prisma.user.findUnique({
        where:{email: input.email}
    })
    if(existing){
        throw new AppError(409,'Email is already been Taken');
    }
    const salt =  parseInt(SALT_ROUND)
    const hashpasword = await bcrypt.hash(input.password , salt)
    try {
        const user = await prisma.user.create({
            data:{
                username: input.username,
                email: input.email,
                password: hashpasword
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        })
        return user; 
    }catch(error){
        throw new AppError(500,'SERVER ERROR');
    }
}

export async function AuthSignIn(input: AuthSignInSchema){
    const user = await prisma.user.findUnique({
        where:{email : input.email}
    })
    if(!user) {
        throw new AppError(401, 'Invalid Creditanials')
    }
    const passwordmatch = await bcrypt.compare(input.password, user.password)
    if(!passwordmatch){
        throw new AppError(401,'Invalid Creds')
    }
    const {password: _, ...safeuser} = user
    return safeuser;
}