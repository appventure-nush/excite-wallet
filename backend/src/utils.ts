import { sql } from "db"
import { UserDetails, UserTable, UserType } from "types/user"

export async function getUser(id: string): Promise<UserDetails | null> {
    const data = await sql<UserTable[]>`
        SELECT * FROM Users WHERE uid = ${id}
    `
    
    if (data.length === 0) {
        return null
    }

    return {
        username: data[0].username,
        name: data[0].name,
        balance: data[0].balance,
        type: data[0].is_admin
            ? UserType.ADMIN
            : data[0].is_booth
            ? UserType.BOOTH
            : UserType.STUDENT,
    }
}

export function objectsToCsv(
    data: Record<string, unknown>[],
    headers: string[],
): string {
    const tsv = [headers.join("\t")]

    for (const row of data) {
        tsv.push(headers.map((key) => row[key]).join("\t"))
    }

    return tsv.join("\n")
}
