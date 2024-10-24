export type TopupTable = {
    topup_id: string // CHAR(36)
    student_uid: string // CHAR(36),
    student_name: string // VARCHAR(255),
    admin_uid: string | null // CHAR(36),
    admin_name: string | null // VARCHAR(255)
    amount: string | null // DECIMAL(10, 2)
    lucky_draw_code: string // CHAR(13)
}

export interface TopupTableInsert extends Omit<TopupTable, "lucky_draw_code"> {
    lucky_draw_code?: string // CHAR(13), optional
}
