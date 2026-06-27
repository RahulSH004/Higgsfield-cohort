import z from 'zod';

export const createVideoSchema = z.object({
    prompt: z.string().min(1, { message: "Prompt is required" }).max(500),
    avatarIds: z.array(z.string().min(1, { message: "Avatar ID is required" })).min(1, { message: "At least one avatar ID is required" }),
    aspectRatio: z.enum(["SQUARE", "PORTRAIT", "LANDSCAPE", "WIDE"], { message: "Aspect ratio is required"}),
    startFrame: z.string().optional(),
    endFrame: z.string().optional(),
    isPublic: z.boolean().default(false),
})

export const remixVideoSchema = z.object({
    prompt: z.string().min(1, { message: "Prompt is required" }),
    isPublic: z.boolean().default(false),
})

export type CreateVideoInput = z.infer<typeof createVideoSchema>;
export type RemixVideoInput = z.infer<typeof remixVideoSchema>;