import sqlite3 from "sqlite3";
import bcrypt from 'bcrypt'
const db = new sqlite3.Database("./database.sqlite");

const initializeDB = async () => {
    // await dbRun("DROP TABLE IF EXISTS users")
    await dbRun("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT)");

    // const users = [
    //     { name: "John Doe", password: "john" },
    //     { name: "Jane Smith", password: "jane" },
    //     { name: "Sam Johnson", password: "sam" },
    // ];
    
    // for (const user of users) {
    //     const hashedPassword = await bcrypt.hash(user.password, 10)
    //     await dbRun("INSERT INTO users (name, password) VALUES (?, ?)", [user.name, hashedPassword]);
    // }
};

function dbQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

export { db, dbQuery, dbRun, initializeDB };
