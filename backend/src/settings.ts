import secrets from "secrets.json"

const secretsData = secrets || {}

const settings = {
    PORT: 3000,
    DOMAIN: "localhost",
    SESSION_SECRET: secretsData.SESSION_SECRET || process.env.SESSION_SECRET!,
    MEMCACHED_SECRET:
        secretsData.MEMCACHED_SECRET || process.env.MEMCACHED_SECRET!,
    MEMCACHED_HOST: process.env.MEMCACHED_HOST || "memcached",
    DB_HOST: process.env.DB_HOST || "db",
    CLIENT_ID: secretsData.CLIENT_ID || process.env.CLIENT_ID!,
    TENANT_ID: secretsData.TENANT_ID || process.env.TENANT_ID!,
    CALLBACK_URL: secretsData.CALLBACK_URL || process.env.CALLBACK_URL!,
    HOMEPAGE_URL: secretsData.HOMEPAGE_URL || process.env.HOMEPAGE_URL!,
}

export { settings }
