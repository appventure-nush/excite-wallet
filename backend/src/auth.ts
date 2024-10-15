import passport from "passport"
import { sql } from "db"
import { Strategy as LocalStrategy } from "passport-local"
import { verify } from "passwords"
import { UserTable, UserType } from "types/user"

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
