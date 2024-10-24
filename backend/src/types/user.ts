declare global {
    namespace Express {
        interface User {
            uid: string
            username: string
            name: string
            type: UserType
        }
    }
}

export enum UserType {
    BOOTH = "booth",
    STUDENT = "student",
    ADMIN = "admin",
}

export type UserTable = {
    uid: string // CHAR(36)
    username: string // VARCHAR(255)
    name: string // VARCHAR(255)
    password: string // VARCHAR(255)
    balance: string // DECIMAL(10, 2)
    is_admin: boolean // BOOLEAN
    is_booth: boolean // BOOLEAN
}

export type UserDetails = {
    username: string
    name: string
    balance: string
    type: UserType
}
