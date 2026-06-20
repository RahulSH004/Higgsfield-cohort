import { Router } from "express";
import { Logut, SignIn, Signup } from "./auth_controller";


const authRoute = Router()

authRoute.post('Signup', Signup)
authRoute.post('SignIn', SignIn)
authRoute.post('Logout', Logut)

export default authRoute;