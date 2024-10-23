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

router.post("/callback", passport.authenticate("microsoft"), (req, res) => {
    res.redirect(settings.HOMEPAGE_URL)
})

export default router
