import express from "express";
import authRoute from "./src/features/auth/auth_routes";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use('api/auth',authRoute)


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
