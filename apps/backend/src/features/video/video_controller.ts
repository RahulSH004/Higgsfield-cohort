import {Request, Response, NextFunction} from 'express';
import { createVideoSchema, remixVideoSchema } from './video-schema';
import { CreateVideo, getAllvideos, getPublicFeed, getVideo, getVideoRemixes } from './video_service';


export async function createVideoHandler(req: Request, res: Response, next: NextFunction) {
    try{
        const input = createVideoSchema.parse(req.body);
        const userId = req.user!.userId;
        const video = await CreateVideo(input, userId);
        res.status(202).json({ data: video });
    } catch (error) {
        next(error);
    }
}

export async function getVideoHandler(req: Request, res: Response, next: NextFunction) {
    try{
        const videoId = req.params.videoId as string;
        const userId = req.user!.userId;
        const video = await getVideo(videoId, userId);
        res.status(200).json({ data: video });
    } catch (error) {
        next(error);
    }
}

export async function getAllVideosHandler(req: Request, res: Response, next: NextFunction) {
    try{
        const userId = req.user!.userId;
        const videos = await getAllvideos(userId);
        res.status(200).json({ data: videos });
    } catch (error) {
        next(error);
    }
}

export async function getPublicFeedHandler(req: Request, res: Response, next: NextFunction) {
    try{
        const feeds = await getPublicFeed();
        res.status(200).json({ data: feeds });
    } catch (error) {
        next(error);
    }
}

export async function getVideoRemixesHandler(req: Request, res: Response, next: NextFunction) {
    try{
        const input = remixVideoSchema.parse(req.body);
        const videoId = req.params.videoId as string;
        const userId = req.user!.userId;
        const remixes = await getVideoRemixes(videoId, userId, input);
        res.status(202).json({ data: remixes });
    } catch (error) {
        next(error);
    }
}