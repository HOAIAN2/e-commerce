// import { Cache } from "js-simple-cache"
import database from "./database.js"
import { dbSelectProductByID } from "./product.js"
import { RowDataPacket } from "mysql2/promise"

interface DBRate {
    rate: number
}

async function dbSelectRating(userID: number, productID: number) {
    const product = await dbSelectProductByID(productID)
    if (!product) throw new Error(`No product with id: ${productID}`)
    try {
        const queryString = [
            'SELECT rate FROM ratings',
            'WHERE user_id = ? AND product_id = ?'
        ].join(' ')
        const [rows] = await database.query(queryString, [userID, productID]) as RowDataPacket[]
        return rows[0] as DBRate
    } catch (error: any) {
        throw new Error(error.message)
    }
}
async function dbInsertRating(userID: number, productID: number, rate: number) {
    const product = await dbSelectProductByID(productID)
    if (!product) throw new Error(`No product with id: ${productID}`)
    try {
        const queryString = [
            'INSERT INTO ratings (user_id, product_id, rate)',
            'VALUES (?, ?, ?)'
        ].join(' ')
        const queryString1 = [
            'SELECT AVG(rate) AS rate FROM ratings',
            'WHERE product_id = ?'
        ].join(' ')
        await database.query(queryString, [userID, productID, rate])
        const [rows] = await database.query(queryString1, [productID]) as RowDataPacket[]
        product.updateRating(parseFloat(rows[0].rate))
        product.updateRatingCount()
    } catch (error: any) {
        throw new Error(error.message)
    }
}
async function dbUpdateRating(userID: number, productID: number, rate: number) {
    const product = await dbSelectProductByID(productID)
    if (!product) throw new Error(`No product with id: ${productID}`)
    try {
        const queryString = [
            'UPDATE ratings SET rate = ?',
            'WHERE user_id = ? AND product_id = ?'
        ].join(' ')
        const queryString1 = [
            'SELECT AVG(rate) AS rate FROM ratings',
            'WHERE product_id = ?'
        ].join(' ')
        await database.query(queryString, [rate, userID, productID])
        const [rows] = await database.query(queryString1, [productID]) as RowDataPacket[]
        product.updateRating(parseFloat(rows[0].rate))
    } catch (error: any) {
        throw new Error(error.message)
    }
}
export {
    dbSelectRating,
    dbInsertRating,
    dbUpdateRating
}