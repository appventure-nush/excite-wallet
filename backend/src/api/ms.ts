import { Router } from "express"
import passport from "passport"
import { settings } from "settings"

const router = Router()

router.get(
    "/",
    passport.authenticate("microsoft", {
        prompt: "select_account",
    }),
)

router.post("/callback", (req, res) => {
    passport.authenticate("microsoft", (err: unknown) => {
        console.log(err)
        if (err) {
            return res.status(500).json(err)
        }
        res.redirect(settings.HOMEPAGE_URL)
    })(req, res)
})

export default router
