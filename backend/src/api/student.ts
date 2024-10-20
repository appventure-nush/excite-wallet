import { sql } from "db"
import Decimal from "decimal.js"
import { Router } from "express"
import { getRandom } from "getRandom"
import { TopupTable } from "types/topup"
import { TransactionTable } from "types/transaction"
import { UserType } from "types/user"

const router = Router()
router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    if (req.user.type !== UserType.STUDENT) {
        return res.status(403).json({ message: "Forbidden" })
    }
    next()
})

router.post("/createTransaction", async (req, res) => {
    const amount: unknown = req.body.amount

    if (!amount) {
        return res.status(400).json({ message: "Amount is required" })
    }

    if (typeof amount !== "string") {
        return res.status(400).json({ message: "Amount must be a string" })
    }

    const amountToDP = new Decimal(amount).toDP(2)
    const transId = getRandom()

    // create a transaction
    await sql.begin("ISOLATION LEVEL REPEATABLE READ", async (sql) => {
        // check balance
        const user = await sql`SELECT balance FROM Users WHERE uid = ${
            req.user!.uid
        }`
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        const userRow = user[0]
        const balance = new Decimal(userRow.balance)

        if (balance.lt(amountToDP)) {
            return res.status(400).json({ message: "Insufficient balance" })
        }

        // update balance
        userRow.balance = balance.sub(amountToDP).toFixed(2)
        await sql`UPDATE Users SET ${sql(userRow)} WHERE uid = ${req.user!.uid}`

        const transaction: TransactionTable = {
            transaction_id: transId,
            start_timestamp: new Date(),
            completed_timestamp: null,
            sender_uid: req.user!.uid,
            receiver_uid: null,
            status: "PENDING",
            amount: amountToDP.toFixed(2),
        }
        await sql`INSERT INTO Transactions ${sql(transaction)}`
        res.json({ transaction_id: transId })
    })
})

router.post("/cancelTransaction", async (req, res) => {
    const transId: unknown = req.body.transaction_id

    if (!transId) {
        return res.status(400).json({ message: "Transaction ID is required" })
    }

    if (typeof transId !== "number") {
        return res
            .status(400)
            .json({ message: "Transaction ID must be a number" })
    }

    await sql.begin("ISOLATION LEVEL REPEATABLE READ", async (sql) => {
        // get transaction
        const transaction = await sql<TransactionTable[]>`
            SELECT * FROM Transactions WHERE transaction_id = ${transId} AND sender_uid = ${
                req.user!.uid
            }
        `

        if (transaction.length === 0) {
            return res.status(404).json({ message: "Transaction not found" })
        }

        // readd the balance
        const transactionRow = transaction[0]
        await sql`UPDATE Users SET balance = balance + ${
            transactionRow.amount
        } WHERE uid = ${req.user!.uid}`

        // delete the transaction
        const response = await sql`
            DELETE FROM Transactions
            WHERE transaction_id = ${transId} AND sender_uid = ${req.user!.uid}
        `
        if (response.count === 0) {
            return res.status(404).json({ message: "Transaction not found" })
        } else {
            return res.json({ message: "Transaction cancelled" })
        }
    })
})

router.post("/createToken", async (req, res) => {
    // create a topup token
    const topupId = getRandom()

    // if a topup token already exists for the specific user, delete it
    await sql`
        DELETE FROM Topup
        WHERE student_uid = ${req.user!.uid} AND admin_uid IS NULL
    `

    const topup: TopupTable = {
        topup_id: topupId,
        student_uid: req.user!.uid,
        student_username: req.user!.username,
        admin_uid: null,
        admin_username: null,
        amount: null,
    }
    await sql`INSERT INTO Topup ${sql(topup)}`
    res.json({ topup_id: topupId })
})

router.post("/cancelToken", async (req, res) => {
    const topupId: unknown = req.body.topup_id

    if (!topupId) {
        return res.status(400).json({ message: "Token ID is required" })
    }

    if (typeof topupId !== "number") {
        return res.status(400).json({ message: "Token ID must be a number" })
    }

    // cancel a topup token
    const response = await sql`
        DELETE FROM Topup
        WHERE topup_id = ${topupId} AND student_uid = ${req.user!.uid}
    `
    if (response.count === 0) {
        return res.status(404).json({ message: "Token not found" })
    } else {
        return res.json({ message: "Token cancelled" })
    }
})

export default router