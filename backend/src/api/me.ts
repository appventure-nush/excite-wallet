import { Router } from "express"
import { getUser } from "utils"

const router = Router()

router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    next()
})

router.get("/", async (req, res) => {
    res.json(await getUser(req.user!.uid))
})

export default router