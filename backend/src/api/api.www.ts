import { Router } from "express"
import adminRouter from "./admin"
import boothRouter from "./booth"
import studentRouter from "./student"
import userRouter from "./user"
import msRouter from "./ms"
import meRouter from "./me"

const apiRouter = Router()

apiRouter.use("/admin", adminRouter)
apiRouter.use("/booth", boothRouter)
apiRouter.use("/student", studentRouter)
apiRouter.use("/user", userRouter)
apiRouter.use("/ms", msRouter)
apiRouter.use("/me", meRouter)

apiRouter.get("/", (_req, res) => {
    res.send("Excite Wallet API")
})

export default apiRouter
