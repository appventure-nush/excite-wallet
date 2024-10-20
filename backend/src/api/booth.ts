import { sql } from "db"
import { Router } from "express"
import { TransactionTable } from "types/transaction"
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
})

export default router
