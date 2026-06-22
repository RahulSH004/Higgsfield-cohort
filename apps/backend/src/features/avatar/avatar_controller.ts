import { Request, Response,NextFunction } from "express";
import { AvatarCreateSchema, confirmUploadSchema, presignSchema } from "./avatar_schema";
import { confirmImageUpload, createAvatar, deleteAvatarImage, getAvatar, getUserAvatars, requestImageUploadUrl } from "./avatar_service";


export async function createAvatarhandler(req: Request, res: Response, next: NextFunction){
    try{
        const input = AvatarCreateSchema.parse(req.body);

        const avatar = await createAvatar(req.user?.userId as string, input)

        res.status(201).json({data: avatar})
    }catch(err){
        next(err)
    }
}

export async function presignHandler(
    req: Request, res: Response, next: NextFunction
  ) {
    try {
      const avatarId = req.params.avatarId as string
      const input  = presignSchema.parse(req.body)
      const result = await requestImageUploadUrl(req.user!.userId, avatarId , input)
      res.json({ data: result })
    } catch (err) { next(err) }
}

export async function confirmUploadHandler(
    req: Request, res: Response, next: NextFunction
  ) {
    try {
      const avatarId = req.params.avatarId as string
      const input = confirmUploadSchema.parse(req.body)
      const image = await confirmImageUpload(req.user!.userId, avatarId,input)
      res.status(201).json({ data: image })
    } catch (err) { next(err) }
}
export async function listAvatarsHandler(
    req: Request, res: Response, next: NextFunction
  ) {
    try {
      const avatars = await getUserAvatars(req.user!.userId)
      res.json({ data: avatars })
    } catch (err) { next(err) }
}

export async function getAvatarHandler(req: Request, res: Response, next: NextFunction) {
    try {
      const avatarId = req.params.avatarId as string
      const avatar = await getAvatar(avatarId, req.user!.userId)
      res.json({ data: avatar })
    } catch (err) { next(err) }
  }

  export async function deleteImageHandler(req: Request, res: Response, next: NextFunction) {
    try {
     const avatarId = req.params.avatarId as string
     const imageId  = req.params.imageId as string
      const result = await deleteAvatarImage(
        req.user!.userId,
        avatarId,
        imageId
      )
      res.json({ data: result })
    } catch (err) { next(err) }
  }