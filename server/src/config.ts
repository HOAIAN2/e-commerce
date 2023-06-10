import * as url from 'url'
const __filename = url.fileURLToPath(import.meta.url)
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
import * as dotenv from "dotenv"
dotenv.config()

const SERVER_PORT = parseInt(process.env.SERVER_PORT || '3000')
const DB_HOST = process.env['DB_HOST']
const DB_USER = process.env['DB_USER']
const DB_PASSWORD = process.env['DB_PASSWORD']
const DB_NAME = process.env['DB_NAME']
const ACCESS_TOKEN_SECRET = process.env['ACCESS_TOKEN_SECRET']
const REFRESH_TOKEN_SERCET = process.env['REFRESH_TOKEN_SERCET']

export {
    SERVER_PORT,
    __filename,
    __dirname,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SERCET
}