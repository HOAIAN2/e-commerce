import mysql from "mysql2"
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from "../config.js"

const database = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
}).promise()

export default database