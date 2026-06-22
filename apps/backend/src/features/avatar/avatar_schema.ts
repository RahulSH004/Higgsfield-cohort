import { z } from "zod";

export const AvatarCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
})

export const presignSchema = z.object({
    contentType: z.string().refine(
      val => ['image/jpeg', 'image/png', 'image/webp'].includes(val),
      { message: 'contentType must be jpeg, png, or webp' }
    ),
    type: z.enum(['USER', 'MODEL']),
  })

export const confirmUploadSchema = z.object({
    key: z.string(),
    type: z.enum(['USER', 'MODEL']),
    aspect_ratio: z.enum(['SQUARE', 'PORTRAIT', 'LANDSCAPE', 'WIDE']),
})


export type CreateAvatarInput   = z.infer<typeof AvatarCreateSchema>
export type PresignInput   = z.infer<typeof presignSchema>
export type ConfirmUploadInput   = z.infer<typeof confirmUploadSchema>
