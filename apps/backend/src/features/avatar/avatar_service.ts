import { prisma } from "../../../db";
import { ConfirmUploadInput, CreateAvatarInput, PresignInput } from "./avatar_schema";
import { AppError } from "../../middleware/error.middleware";
import { deleteS3Object, getPresignedUploadUrl, getPublicUrl } from "../../libs/service";


export async function assertAvatarOwner(avatarId: string, userId: string){
    const avatar = await prisma.avatar.findUnique({
        where: {
            id: avatarId,
        }
        
    })
    if(!avatar || avatar.userId !== userId){
        throw new AppError(404 , 'Avatar not found')
    }
    return avatar;
} 


export async function createAvatar(userId: string,input: CreateAvatarInput){
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
    
}

export async function requestImageUploadUrl(userId: string,avatarId:string,input: PresignInput){

        await assertAvatarOwner(avatarId, userId)

        const {url, key} = await getPresignedUploadUrl({
            folder: 'avatars',
            userId,
            avatarId,
            contentType: input.contentType,
        })
        return {uploadUrl: url, key};
    
}

export async function confirmImageUpload(userId: string,avatarId:string,input: ConfirmUploadInput){
    try{
        await assertAvatarOwner(avatarId, userId)

        const publicUrl = await getPublicUrl(input.key)

        return await prisma.avatarImage.create({
            data: {
                avatarid: avatarId,
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

export async function getAvatar(avatarId: string, userId: string) {
    return assertAvatarOwner(avatarId, userId)
  }

export async function deleteAvatarImage(userId: string, avatarId:string, imageId: string){
    await assertAvatarOwner(avatarId, userId)

    const image = await prisma.avatarImage.findUnique({
        where: {id: imageId}
    })
    if(!image || image.avatarid !== avatarId){
        throw new AppError(404, "Image Not Found")
    }
    const key = image.url.split('.amazonaws.com/')[1] as string
    await deleteS3Object(key)

    await prisma.avatarImage.delete({
        where:{
            id: imageId
        }
    })
    return {
        deleted: true
    }

}