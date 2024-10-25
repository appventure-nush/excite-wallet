import { sql } from "db"
import Decimal from "decimal.js"
import { Router } from "express"
import { TopupTable } from "types/topup"
import { TransactionTable } from "types/transaction"
import { UserTable, UserType } from "types/user"
import Archiver from "archiver"
import { objectsToCsv } from "utils"
import { getRandom } from "getRandom"
import { hash } from "passwords"

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
        SELECT * FROM Topup WHERE topup_id = ${tokenId}
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
        student_name: topupRow.student_name,
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
            SELECT * FROM Topup WHERE topup_id = ${tokenId}
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
            WHERE topup_id = ${topupRow.topup_id}
        `

        res.json({ message: "Money added" })
    })
})

router.get("/dump", async (_, res) => {
    const topups = await sql<TopupTable[]>`
        SELECT * FROM Topup
    `
    const transactions = await sql<TransactionTable[]>`
        SELECT * FROM Transactions
    `
    const users = await sql<UserTable[]>`
        SELECT * FROM Users
    `

    const topupHeaders = (
        await sql<{ column_name: string }[]>`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'topup'
    `
    ).map((row) => row.column_name)

    const transactionHeaders = (
        await sql<{ column_name: string }[]>`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'transactions'
    `
    ).map((row) => row.column_name)

    const userHeaders = (
        await sql<{ column_name: string }[]>`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'users'
    `
    ).map((row) => row.column_name)

    res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=dump-${new Date().toISOString()}.zip`,
    })

    const archive = Archiver("zip")
    archive.pipe(res)

    await archive
        .append(objectsToCsv(topups, topupHeaders), {
            name: "topups.csv",
        })
        .append(objectsToCsv(transactions, transactionHeaders), {
            name: "transactions.csv",
        })
        .append(objectsToCsv(users, userHeaders), {
            name: "users.csv",
        })
        .finalize()
})

router.post("/addUser", async (req, res) => {
    const name: unknown = req.body.name
    const username: unknown = req.body.username
    const password: unknown = req.body.email

    if (!name) {
        return res.status(400).json({ message: "Name is required" })
    }

    if (typeof name !== "string") {
        return res.status(400).json({ message: "Name must be a string" })
    }

    if (!username) {
        return res.status(400).json({ message: "Username is required" })
    }

    if (typeof username !== "string") {
        return res.status(400).json({ message: "Username must be a string" })
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" })
    }

    if (typeof password !== "string") {
        return res.status(400).json({ message: "Password must be a string" })
    }

    // add user
    await sql`
        INSERT INTO Users (uid, name, username, password, is_admin, is_booth, balance)
        VALUES (${getRandom()}, ${name}, ${username}, ${await hash(password)}, FALSE, TRUE, 0)
    `

    res.json({ message: "User added" })
})

export default router
