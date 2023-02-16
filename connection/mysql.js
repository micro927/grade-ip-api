import mysql from 'mysql2'
import * as dotenv from 'dotenv'
dotenv.config()

const mysql2 = mysql

async function mysqlConnection(dbName = process.env.DB_NAME) {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: dbName,
        waitForConnections: true,
        multipleStatements: true,
        namedPlaceholders: true,
        connectionLimit: 50,
        // queueLimit: 0,
    });
    return pool.promise()
}

export { mysql2, mysqlConnection }
