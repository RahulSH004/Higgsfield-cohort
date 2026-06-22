import { prisma } from "../../../db";
import { ConfirmUploadInput, CreateAvatarInput, PresignInput } from "./avatar_schema";
import { AppError } from "../../middleware/error.middleware";
import { getPresignedUploadUrl, getPublicUrl } from "../../libs/service";


export async function createAvatar(userId: string,input: CreateAvatarInput){
    try{
        const avatar = await prisma.avatar.create({
            data:{
                name: input.name,
                userId,
            },
            select:{
                id: true,
                name: true,
                createdAt: true,
            }
        })
        return avatar;
    }catch(error){
        throw new AppError(500, 'Failed to create avatar');
    }
}

export async function requestImageUploadUrl(userId: string,input: PresignInput){

    try{
        const avatar = await prisma.avatar.findUnique({
            where:{
                userId: userId,
                id: input.avatarid,
            }
        })
        if(!avatar){
            throw new AppError(404, 'Avatar not found');
        }

        const {url, key} = await getPresignedUploadUrl({
            folder: 'avatar',
            userid: userId,
            avatarid: input.avatarid,
            contentType: input.contentType,
        })
        return {url, key};
    }catch(error){
        throw new AppError(500, 'Failed to request image upload url');
    }
    
}

export async function confirmImageUpload(userId: string,input: ConfirmUploadInput){
    try{
        const avatar = await prisma.avatar.findUnique({
            where:{
                userId: userId,
                id: input.avatarid,
            }
        })
        if(!avatar || avatar.userId !== userId) {
            throw new AppError(404, 'Avatar Not Found')
        }

        const publicUrl = await getPublicUrl(input.key)

        return await prisma.avatarImage.create({
            data: {
                avatarid: input.avatarid,
                type: input.type,
                url: publicUrl,
                aspect_ratio: input.aspect_ratio
            },
            select: {
                id: true,
                type: true,
                url: true,
                createdAt: true,
            }
        })
    }catch(error){
        throw new AppError(500, 'Uploading Error')
    }
}

export async function getUserAvatars(userId: string) {
    return prisma.avatar.findMany({
      where:   { userId },
      select:  {
        id:           true,
        name:         true,
        createdAt:    true,
        avatarimages: {
          select: { id: true, url: true, type: true }
        },
      },
      orderBy: { createdAt: 'desc' },
    })
}