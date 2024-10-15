import postgres from "postgres"
import { settings } from "settings"

export const sql = postgres({
    host: settings.DB_HOST,
    user: "admin",
    password: "admin",
    database: "excite",
})
