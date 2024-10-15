declare global {
    namespace Express {
        interface User {
            uid: string
            username: string
            type: UserType
        }
    }
}

export enum UserType {
    BOOTH,
    STUDENT,
    ADMIN,
}

export interface UserTable {
    uid: string // CHAR(36)
    username: string // VARCHAR(255)
    name: string // VARCHAR(255)
    password: string // VARCHAR(255)
    balance: string // DECIMAL(10, 2)
    is_admin: boolean // BOOLEAN
    is_booth: boolean // BOOLEAN
}

export interface IUserDetails {
    username: string
    name: string
    balance: number
    type: UserType
}
