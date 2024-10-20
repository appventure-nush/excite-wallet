import { sql } from "db";
import { UserDetails, UserTable, UserType } from "types/user";

export async function getUser(id: string): Promise<UserDetails> {
    const data = await sql<UserTable[]>`
        SELECT * FROM Users WHERE uid = ${id}
    `

    return {
        username: data[0].username,
        name: data[0].name,
        balance: data[0].balance,
        type: data[0].is_admin ? UserType.ADMIN : data[0].is_booth ? UserType.BOOTH : UserType.STUDENT,
    }
}