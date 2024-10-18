import passport from "passport"
import { sql } from "db"
import { Strategy as LocalStrategy } from "passport-local"
import { IProfile, OIDCStrategy } from "passport-azure-ad"
import { verify } from "passwords"
import { UserTable, UserType } from "types/user"
import { settings } from "settings"
import type { VerifyCallback } from "passport-oauth2"
import { getRandom } from "getRandom"

passport.use(
    "local",
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, callback) => {
            let res
            try {
                res = await sql<UserTable[]>`
                    SELECT uid, is_admin, is_booth FROM Users WHERE username = ${username}
                `
            } catch (error) {
                return callback(error)
            }

            if (res.length === 0) {
                return callback(null, false, { message: "Invalid username" })
            }

            const row = res[0]

            if (!row.is_admin && !row.is_booth) {
                // should use Microsoft Authentication
                return callback(null, false, {
                    message: "Invalid authentication method",
                })
            }

            try {
                const result = await verify(password, row.password)

                if (!result) {
                    return callback(null, false, {
                        message: "Invalid password",
                    })
                }
            } catch (err) {
                return callback(err)
            }

            return callback(null, {
                uid: row.uid,
                username,
                type: row.is_admin
                    ? UserType.ADMIN
                    : row.is_booth
                    ? UserType.BOOTH
                    : UserType.STUDENT,
            })
        },
    ),
)

passport.use(
    "microsoft",
    new OIDCStrategy(
        {
            identityMetadata: `https://login.microsoftonline.com/${settings.TENANT_ID}/.well-known/openid-configuration`,
            clientID: settings.CLIENT_ID,
            redirectUrl: settings.CALLBACK_URL,
            allowHttpForRedirectUrl: true,
            scope: ["openid"],
            passReqToCallback: false,
            responseType: "id_token",
            responseMode: "form_post",
            loggingLevel: "info",
            loggingNoPII: false,
        },
        async (profile: IProfile, done: VerifyCallback) => {
            const displayName = profile.displayName!

            let res
            try {
                res = await sql<UserTable[]>`
                    SELECT uid, is_admin, is_booth FROM Users WHERE username = ${displayName}
                `
            } catch (error) {
                return done(error)
            }

            if (res.length === 0) {
                // create user
                const user = {
                    uid: getRandom(),
                    username: displayName,
                    name: displayName,
                    password: "",
                    balance: 0,
                    is_admin: false,
                    is_booth: false,
                }
                try {
                    await sql<UserTable[]>`
                        INSERT INTO Users ${sql(user)}
                    `
                } catch (error) {
                    return done(error)
                }

                return done(null, {
                    uid: user.uid,
                    username: user.username,
                    type: UserType.STUDENT,
                })
            }

            const row = res[0]

            if (row.is_admin || row.is_booth) {
                // should use Local Authentication
                return done(null, false, {
                    message: "Invalid authentication method",
                })
            }

            return done(null, {
                uid: row.uid,
                username: displayName,
                type: row.is_admin
                    ? UserType.ADMIN
                    : row.is_booth
                    ? UserType.BOOTH
                    : UserType.STUDENT,
            })
        },
    ),
)

passport.serializeUser<Express.User>(function (user, cb) {
    process.nextTick(function () {
        cb(null, {
            uid: user.uid,
            username: user.username,
            type: user.type,
        })
    })
})

passport.deserializeUser(function (user: Express.User, cb) {
    process.nextTick(function () {
        return cb(null, user)
    })
})
