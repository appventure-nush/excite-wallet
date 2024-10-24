export type TransactionTable = {
    transaction_id: string // CHAR(36)
    start_timestamp: Date // TIMESTAMP
    completed_timestamp: Date | null // TIMESTAMP
    sender_uid: string // CHAR(36)
    receiver_uid: string | null // CHAR(36)
    status: string // ENUM('PENDING', 'COMPLETED')
    amount: string // DECIMAL(10, 2)
}
