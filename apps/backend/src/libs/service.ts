import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import { AppError } from "../middleware/error.middleware";
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;

const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
];


export type upload = 'avatar' |'images' | 'videos'

export async function getPresignedUploadUrl({
    folder,
    userid,
    avatarid,
    contentType,
}: {
    folder: upload,
    userid: string,
    avatarid: string,
    contentType: string,
}){
    try{
        if(!ALLOWED_IMAGE_TYPES.includes(contentType)){
            throw new AppError(400, 'Invalid content type');
        }
        const ext = contentType.split('/')[1]
        const key = `${folder}/${userid}/${avatarid}/${uuidv4()}.${ext}`

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            ContentType: contentType,
        })
        const url = await getSignedUrl(s3Client, command, {expiresIn: 300})
        return {url, key};
    }catch(error){
        throw new AppError(500, 'Failed to get presigned upload url')
    }
}
export async function getPublicUrl(key: string){
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION!}.amazonaws.com/${key}`
}

export async function deleteS3Object(key: string) {
    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }))
}