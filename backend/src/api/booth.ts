import { sql } from "db"
import { Router } from "express"
import { TransactionTable } from "types/transaction"
import { UserType } from "types/user"

const router = Router()
router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    if (req.user.type !== UserType.BOOTH) {
        return res.status(403).json({ message: "Forbidden" })
    }
    next()
})

router.get("/getTransaction", async (req, res) => {
    const transId: unknown = req.query.transaction_id

    if (!transId) {
        return res.status(400).json({ message: "Transaction ID is required" })
    }

    if (typeof transId !== "string") {
        return res
            .status(400)
            .json({ message: "Transaction ID must be a string" })
    }

    const transaction = await sql<{
        transaction_id: string
        sender_uid: string
        status: string
        amount: string
        start_timestamp: Date
        name: string
    }[]>`
        SELECT Transactions.transaction_id, Transactions.sender_uid, Transactions.status, Transactions.amount, Transactions.start_timestamp, Users.name FROM Transactions INNER JOIN Users ON Users.uid = Transactions.sender_uid WHERE transaction_id = ${transId}
    `

    if (transaction.length === 0) {
        return res.status(404).json({ message: "Transaction ID not found" })
    }

    const transactionRow = transaction[0]

    // check if transaction is already completed
    if (transactionRow.status === "COMPLETED") {
        return res
            .status(400)
            .json({ message: "Transaction already completed" })
    }

    // check if transaction is expired
    const startTimestamp = transactionRow.start_timestamp
    const currentTimestamp = new Date()
    const diff = currentTimestamp.getTime() - startTimestamp.getTime()
    if (diff > 1000 * 60 * 5) { // 5 minutes
        await sql.begin("ISOLATION LEVEL REPEATABLE READ", async (sql) => {
            // delete transaction
            await sql`DELETE FROM Transactions WHERE transaction_id = ${transId}`
            // refund balance
            await sql`UPDATE Users SET balance = balance + ${transactionRow.amount} WHERE uid = ${transactionRow.sender_uid}`
        })
        return res.status(400).json({ message: "Transaction expired" })
    }

    return res.json(transactionRow)
})

router.post("/collectTransaction", async (req, res) => {
    const transId: unknown = req.body.transaction_id

    if (!transId) {
        return res.status(400).json({ message: "Transaction ID is required" })
    }

    if (typeof transId !== "string") {
        return res
            .status(400)
            .json({ message: "Transaction ID must be a string" })
    }

    // withdraw through transaction
    await sql.begin("ISOLATION LEVEL REPEATABLE READ", async (sql) => {
        // get transaction
        const transaction = await sql<TransactionTable[]>`
            SELECT * FROM Transactions WHERE transaction_id = ${transId}
        `

        if (transaction.length === 0) {
            return res.status(404).json({ message: "Transaction ID not found" })
        }

        const transactionRow = transaction[0]

        // check if transaction is already completed
        if (transactionRow.status === "COMPLETED") {
            return res
                .status(400)
                .json({ message: "Transaction already completed" })
        }

        // check if transaction is expired
        const startTimestamp = transactionRow.start_timestamp
        const currentTimestamp = new Date()
        const diff = currentTimestamp.getTime() - startTimestamp.getTime()
        if (diff > 1000 * 60 * 5) { // 5 minutes
            // delete transaction
            await sql`DELETE FROM Transactions WHERE transaction_id = ${transId}`
            // refund balance
            await sql`UPDATE Users SET balance = balance + ${transactionRow.amount} WHERE uid = ${transactionRow.sender_uid}`
            return res.status(400).json({ message: "Transaction expired" })
        }

        // update transaction
        transactionRow.status = "COMPLETED"
        transactionRow.receiver_uid = req.user!.uid
        transactionRow.completed_timestamp = new Date()
        await sql`UPDATE Transactions SET ${sql(
            transactionRow,
        )} WHERE transaction_id = ${transId}`

        // update balance
        await sql`
            UPDATE Users SET balance = balance + ${transactionRow.amount} WHERE uid = ${transactionRow.receiver_uid}
        `
    })

    return res.json({ message: "Transaction completed" })
})

export default router
