import database from "./database.js"
import { RowDataPacket } from "mysql2/promise"

async function dbIsExistsSession(sessionID: string) {
    try {
        const queryString = [
            "SELECT session_id FROM sessions",
            'WHERE session_id = ?'
        ].join(' ')
        const [rows] = await database.query(queryString, [sessionID]) as RowDataPacket[]
        if (rows[0]) return true
        return false
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbInsertSession(sessionID: string) {
    try {
        const queryString = [
            "INSERT INTO sessions",
            'VALUES(?, DATE_ADD(NOW() , INTERVAL 2 DAY))'
        ].join(' ')
        await database.query(queryString, [sessionID])
        await dbDeleteOldSession()
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbDeleteSession(sessionID: string) {
    try {
        const queryString = [
            "DELETE FROM sessions",
            'WHERE session_id = ?'
        ].join(' ')
        await database.query(queryString, [sessionID])
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbDeleteAllUserSession(username: string) {
    try {
        const queryString = [
            "DELETE FROM sessions",
            "WHERE session_id LIKE concat(? , '%')"
        ].join(' ')
        await database.query(queryString, [username])
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbDeleteOldSession() {
    try {
        const queryString = [
            "DELETE FROM sessions",
            'WHERE sessions.valid_until <= NOW()'
        ].join(' ')
        await database.query(queryString)
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}

export {
    dbIsExistsSession,
    dbInsertSession,
    dbDeleteSession,
    dbDeleteAllUserSession
}