import { prisma } from "../../../db";
import bcrypt from 'bcrypt'
import type { AuthSignInSchema, AuthSignupSchema } from "./auth_schema";

const SALT_ROUND = '10';

export async function AuthSignup(input: AuthSignupSchema) {
    
    const existing = await prisma.user.findUnique({
        where:{email: input.email}
    })
    if(existing){
        throw new Error('Email is already been Taken');
    }
    const hashpasword = await bcrypt.hash(input.password , SALT_ROUND)
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
        throw new Error('SERVER ERROR');
    }
}

export async function AuthSignIn(input: AuthSignInSchema){
    const user = await prisma.user.findUnique({
        where:{email : input.email}
    })
    if(!user) {
        throw new Error('Invalid Creditanials')
    }
    const passwordmatch = await bcrypt.compare(input.password, user.password)
    if(!passwordmatch){
        throw new Error('Invalid Creds')
    }
    const {password: _, ...safeuser} = user
    return safeuser;
}