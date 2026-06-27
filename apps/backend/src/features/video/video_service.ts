import { prisma } from "../../../db";
import { videoQueue } from "../../libs/queue";
import { AppError } from "../../middleware/error.middleware";
import { CreateVideoInput, RemixVideoInput } from "./video-schema";


export async function CreateVideo(input: CreateVideoInput, userId: string) {
    const avatars = await prisma.avatar.findMany({
        where: {
            id: {in: input.avatarIds},
            userId,
        }
    })
    if(avatars.length !== input.avatarIds.length) throw new AppError(404, 'No avatars found');

    const video = await prisma.$transaction(async(tx) => {

        const newvideo = await tx.avatarVideo.create({
            data: {
                userId,
                prompt: input.prompt,
                aspect_ratio: input.aspectRatio,
                startFrame: input.startFrame,
                endFrame: input.endFrame,
                status: 'PENDING',
                isPublic: input.isPublic,
            },
            select:{
                id: true,
                status: true,
                createdAt: true,
            }
            
        })

        await tx.avatarVideoReference.createMany({
            data: input.avatarIds.map(avatarId => ({
                avatarvideoId: newvideo.id,
                avatarId,
            }))
        })
        return newvideo;
    })
    await videoQueue.add('generateVideo', {
        videoId: video.id,
        userId,
        avatarIds: input.avatarIds,
        prompt: input.prompt,
        aspectRatio: input.aspectRatio,
    })
    return video;
}

//get one video 

export async function getVideo(videoId: string, userId: string) {
    const video = await prisma.avatarVideo.findUnique({
        where: {
            id: videoId,
            userId,
        },
        select: {
            id: true, status: true, VideoUrl: true,
            prompt: true, aspect_ratio: true, isPublic: true, 
            createdAt: true, remixedFromId: true,
        }   
    })
    if(!video) throw new AppError(404, 'Video not found');
    return video
}

export async function getAllvideos(userId: string) {
    const allvideos = await prisma.avatarVideo.findMany({
        where:{
            userId,
        },
        select: {
            id: true, status: true, VideoUrl: true,
            prompt: true, aspect_ratio: true, isPublic: true, 
            createdAt: true, remixedFromId: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return allvideos;
}

export async function getPublicFeed(){
    const feedvideos = await prisma.avatarVideo.findMany({
        where: {
            isPublic: true,
            status: 'SUCCESS',
        },
        select: {
            id: true, VideoUrl: true,
            prompt: true, aspect_ratio: true,
            remixedFromId: true, createdAt: true,
            user:{
                select: {
                    username: true, profileImage: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 30,
    })
    return feedvideos;
}

export async function getVideoRemixes(videoId: string, userId: string, input: RemixVideoInput) {
    const orginial = await prisma.avatarVideo.findUnique({
        where: {
            id: videoId,
        },
        include: {avatarVideoRefrence: true}
    })
    if(!orginial || !orginial.isPublic) throw new AppError(404, 'Original video not found');

    const remixvideo = await prisma.$transaction(async(tx) => {
        const newvideo = await tx.avatarVideo.create({
            data: {
                userId,
                prompt: input.prompt,
                aspect_ratio: orginial.aspect_ratio,
                startFrame: orginial.startFrame,
                endFrame: orginial.endFrame,
                status: 'PENDING',
                isPublic: input.isPublic,
                remixedFromId: videoId,
            },
            select:{
                id: true,
                status: true,
                createdAt: true,
            }
        })

        await tx.avatarVideoReference.createMany({
            data: orginial.avatarVideoRefrence.map(ref => ({
                avatarvideoId: newvideo.id,
                avatarId: ref.avatarId,
            }))
        })
        return newvideo;
    })
    await videoQueue.add('generateVideo', {
        videoId: remixvideo.id,
        userId,
        avatarIds: orginial.avatarVideoRefrence.map(ref => ref.avatarId),
        prompt: input.prompt,
        aspectRatio: orginial.aspect_ratio,
    })
    return remixvideo;
}