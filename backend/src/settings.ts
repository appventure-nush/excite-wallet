import secrets from "secrets.json"

const settings = {
    PORT: 3000,
    DOMAIN: "localhost",
    SESSION_SECRET: secrets.SESSION_SECRET,
    MEMCACHED_SECRET: secrets.MEMCACHED_SECRET,
    MEMCACHED_HOST: process.env.MEMCACHED_HOST || "memcached",
    DB_HOST: process.env.DB_HOST || "db",
    CLIENT_ID: secrets.CLIENT_ID,
    TENANT_ID: secrets.TENANT_ID,
    CALLBACK_URL: secrets.CALLBACK_URL,
    HOMEPAGE_URL: secrets.HOMEPAGE_URL,
}

export { settings }
