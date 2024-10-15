import { Router } from "express"
import passport from "passport"

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
    )
})

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error" })
        }
        return res.status(200).json({ message: "Logged out" })
    })
})

export default router
