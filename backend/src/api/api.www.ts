import { Router } from "express"
import adminRouter from "./admin"
import boothRouter from "./booth"
import studentRouter from "./student"
import userRouter from "./user"

const apiRouter = Router()

apiRouter.use(adminRouter)
apiRouter.use(boothRouter)
apiRouter.use(studentRouter)
apiRouter.use(userRouter)

apiRouter.get("/", (_req, res) => {
    res.send("Excite Wallet API")
})

export default apiRouter
