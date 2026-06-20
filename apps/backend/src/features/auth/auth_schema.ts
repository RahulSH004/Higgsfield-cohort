import {z} from 'zod';

export const AuthSignupSchema = z.object({
    username: z.string().min(3, "Username at least 3 letters"),
    email: z.string().email(),
    password: z.string().min(8, "minimun have 5 digtis password")
})

export const AuthSignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export type AuthSignInSchema = z.infer<typeof AuthSignInSchema>
export type AuthSignupSchema = z.infer<typeof AuthSignupSchema>