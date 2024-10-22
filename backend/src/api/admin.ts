import { sql } from "db"
import Decimal from "decimal.js"
import { Router } from "express"
import { TopupTable } from "types/topup"
import { UserType } from "types/user"

const router = Router()
router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    if (req.user.type !== UserType.ADMIN) {
        return res.status(403).json({ message: "Forbidden" })
    }
    next()
})

router.get("/getTopup", async (req, res) => {
    const tokenId: unknown = req.query.token_id

    if (!tokenId) {
        return res.status(400).json({ message: "Token ID is required" })
    }

    if (typeof tokenId !== "string") {
        return res.status(400).json({ message: "Token ID must be a number" })
    }

    // get topup
    const topup = await sql<TopupTable[]>`
        SELECT * FROM Topup WHERE token_id = ${tokenId}
    `

    if (topup.length === 0) {
        return res.status(404).json({ message: "Token ID not found" })
    }

    const topupRow = topup[0]

    if (topupRow.admin_uid !== null) {
        return res.status(400).json({ message: "Token ID already used" })
    }

    return res.json({
        token_id: topupRow.topup_id,
        student_uid: topupRow.student_uid,
        student_name: topupRow.student_name
    })
})

router.post("/addMoney", async (req, res) => {
    const tokenId: unknown = req.body.token_id
    const amount: string = req.body.amount

    if (!tokenId) {
        return res.status(400).json({ message: "Token ID is required" })
    }

    if (typeof tokenId !== "string") {
        return res.status(400).json({ message: "Token ID must be a number" })
    }

    if (!amount) {
        return res.status(400).json({ message: "Amount is required" })
    }

    if (typeof amount !== "string") {
        return res.status(400).json({ message: "Amount must be a string" })
    }

    // add money to user
    await sql.begin("ISOLATION LEVEL REPEATABLE READ", async (sql) => {
        // get topup
        const topup = await sql<TopupTable[]>`
            SELECT * FROM Topup WHERE token_id = ${tokenId}
        `
        if (topup.length === 0) {
            return res.status(404).json({ message: "Token ID not found" })
        }

        const topupRow = topup[0]

        if (topupRow.admin_uid !== null) {
            return res.status(400).json({ message: "Token ID already used" })
        }

        const amountToDP = new Decimal(amount).toDP(2)

        // update topup data
        topupRow.admin_uid = req.user!.uid
        topupRow.admin_name = req.user!.name
        topupRow.amount = amountToDP.toFixed(2)

        await sql`
            UPDATE Users
            SET balance = balance + ${amountToDP.toFixed(2)}
            WHERE uid = ${topupRow.student_uid}
        `

        await sql`
            UPDATE Topup
            SET ${sql(topupRow)}
            WHERE token_id = ${topupRow.topup_id}
        `

        res.json({ message: "Money added" })
    })
})

export default router
