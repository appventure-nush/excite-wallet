export interface TopupTable {
    topup_id: string // CHAR(36)
    student_uid: string // CHAR(36),
    student_name: string // VARCHAR(255),
    admin_uid: string | null // CHAR(36),
    admin_name: string | null // VARCHAR(255)
    amount: string | null // DECIMAL(10, 2)
}
