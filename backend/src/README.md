# Replacing Passwords:

Run this code in NodeJS:
```js
const { scrypt, randomBytes } = require("crypto");

function hash(password) {
    const salt = randomBytes(16).toString("hex");
    const buf = new Promise((res, rej) =>
        scrypt(password, salt, 64, (err, buf) => (err ? rej(err) : console.log(
            `${buf.toString("hex")}.${salt}`
            ))))
}

hash("PASSWORD");
```
Now we can put it in the table.  
Look for the UID using `SELECT * FROM users;`  
Update using `UPDATE users SET password='HASH' WHERE uid='uid';`  
Delete using `DELETE FROM users WHERE uid='uid';`  
Add using `INSERT INTO users values ('uid', 'username'...);`

