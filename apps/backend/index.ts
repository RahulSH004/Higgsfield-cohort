import express from "express";
import authRoute from "./src/features/auth/auth_routes";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./src/middleware/error.middleware";
import { authentication } from "./src/middleware/auth.middleware";
import avatarRoute from "./src/features/avatar/avatar_routes";
import videoRoute from "./src/features/video/video_routes";

const app = express();
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use('api/auth',authRoute)

//protected route 

app.use('api/avatars', authentication, avatarRoute)
app.use('api/videos', authentication, videoRoute)


app.use(globalErrorHandler)
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
