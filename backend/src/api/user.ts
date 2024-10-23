import { Router } from "express"
import passport from "passport"
import { getUser } from "utils"

const router = Router()

router.post("/login/password", (req, res) => {
    passport.authenticate(
        "local",
        (
            err: unknown,
            user: false | Express.User,
            info: unknown | undefined,
        ) => {
            if (err) {
                console.error(err)
                return res
                    .status(500)
                    .json({ message: "Internal Server Error" })
            }
            if (!user) {
                return res.status(401).json(info)
            }
            req.login(user, function (err) {
                if (err) {
                    return res.status(500).json(err)
                }
                return res.status(200).json({ message: "Logged in" })
            })
        },
    )(req, res)
})

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
        return res.status(200).json({ message: "Logged out" })
    })
})

router.get("/:id", async (req, res) => {
    const userId = req.params.id
    res.json(await getUser(userId))
})

export default router
