export enum UserType {
    BOOTH = "booth",
    STUDENT = "student",
    ADMIN = "admin",
}

export type UserDetails = {
    username: string
    name: string
    balance: string
    type: UserType
}