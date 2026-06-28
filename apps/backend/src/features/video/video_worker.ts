import {Worker, Job} from 'bullmq';
import { AppError } from '../../middleware/error.middleware';
import { prisma } from '../../../db';
import redis from '../../libs/redis';


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function MockAiservice(payload: {
    videoId: string
    prompt: string
}) {
    await sleep(5000 + Math.random() * 5000);

    if(Math.random() < 0.1){
        throw new AppError(500, "AI Service Error");
    }

    return {
        videoUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/videos/mock/${payload.videoId}.mp4`,
    }
}

export const videoWorker = new Worker('videoQueue', async(job: Job) => {
    const {videoId, prompt} = job.data;
    try{
        const {videoUrl} = await MockAiservice({videoId, prompt});

        await prisma.avatarVideo.update({
            where:{
                id: videoId,
            },
            data:{
                status: 'SUCCESS',
                videoUrl,
            }
        })
    }catch(error){
        await prisma.avatarVideo.update({
            where:{
                id: videoId,
            },
            data:{
                status: 'ERROR',
            }
        })
        throw new AppError(500, "Video Generation Failed");
    }
},
    {
        connection: redis
    }
)

videoWorker.on('completed', (job) => {
    console.log(`[worker] completed: ${job.id}`);
});

videoWorker.on('failed', (job, err) => {
    console.log(`[worker] failed: ${job?.id} with error ${err.message}`);
});
