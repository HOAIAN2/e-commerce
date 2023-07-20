import { Cache } from "js-simple-cache"
import { Comment } from "../models/index.js"
import database from "./database.js"
import { RowDataPacket } from "mysql2/promise"
import { dbSelectProductByID } from "./product.js"

interface DBComment {
    "comment_id": number
    "user_id": number
    "avatar": string
    "first_name": string
    "last_name": string
    "product_id": number
    "comment": string
    "rate": number
    "comment_date": string
}
// async function initializeComment() {
//     console.log('\x1b[1m%s\x1b[0m', 'Initializing comments data...')
//     try {
//         const queryString = [
//             'SELECT comment_id, user_id, product_id, comment FROM comments'
//         ].join(' ')
//         const [rows] = await pool.query(queryString)
//         rows.forEach(row => {
//             const commentID = row['comment_id']
//             const userID = row['user_id']
//             const productID = row['product_id']
//             const commentContent = row['comment']
//             const comment = new Comment(commentID, userID, productID, commentContent)
//             comments.push(comment)
//         })
//     } catch (error) {
//         console.log('\x1b[31m%s\x1b[0m', `Fail to initialize comments data: ${error.message}`)
//         throw new Error(`Fail to initialize comments data: ${error.message}`)
//     }
// }

async function dbQueryComments(productID: number, startIndex: number | undefined, sortMode: string) {
    let replace = '>'
    if (sortMode === 'DESC') replace = '<'
    const comments: Comment[] = []
    try {
        let queryString = [
            'SELECT comment_id, users.user_id, users.avatar, first_name, last_name, comments.product_id, comment, rate, comment_date FROM comments',
            'JOIN users ON users.user_id = comments.user_id',
            'LEFT JOIN ratings ON ratings.user_id = comments.user_id AND ratings.product_id = comments.product_id',
            `WHERE comments.product_id = ? AND comment_id ${replace} ?`,
            `ORDER BY comment_id ${sortMode}`,
            'LIMIT 10'
        ].join(' ')
        if (!startIndex) queryString = queryString.replace(`AND comment_id ${replace} ?`, '')
        const [rows] = await database.query(queryString, [productID, startIndex]) as RowDataPacket[]
        rows.forEach((row: DBComment) => {
            const commentID = row['comment_id']
            const userID = row['user_id']
            const avatar = row['avatar']
            const firstName = row['first_name']
            const lastName = row['last_name']
            const productID = row['product_id']
            const commentContent = row['comment']
            const rate = row['rate']
            const commentDate = row['comment_date']
            const comment = new Comment(commentID, userID, avatar, firstName, lastName, productID, commentContent, rate, commentDate)
            comments.push(comment)
        })
        return comments
    } catch (error: any) {
        throw new Error(error.message)
    }
}
async function dbInsertComment(userID: number, productID: number, content: string) {
    let newComment: Comment
    try {
        const queryString = [
            'INSERT INTO comments (user_id, product_id, comment, comment_date)',
            'VALUES (?, ?, ?, NOW())'
        ].join(' ')
        const queryString1 = [
            'SELECT comment_id, users.user_id, users.avatar, first_name, last_name, comments.product_id, comment, rate, comment_date FROM comments',
            'JOIN users ON users.user_id = comments.user_id',
            'LEFT JOIN ratings ON ratings.user_id = comments.user_id AND ratings.product_id = comments.product_id',
            `WHERE comment_id = ?`,
        ].join(' ')
        const [result] = await database.query(queryString, [userID, productID, content]) as RowDataPacket[]
        const [rows] = await database.query(queryString1, [result.insertId]) as RowDataPacket[]
        const data = rows[0] as DBComment
        const commentID = data['comment_id']
        // const userID = data['user_id']
        const avatar = data['avatar']
        const firstName = data['first_name']
        const lastName = data['last_name']
        // const productID = data['product_id']
        const commentContent = data['comment']
        const rate = data['rate']
        const commentDate = data['comment_date']
        const comment = new Comment(commentID, userID, avatar, firstName, lastName, productID, commentContent, rate, commentDate)
        const product = await dbSelectProductByID(productID)
        product?.updateCommentCount(1)
        newComment = comment
        return newComment
    } catch (error: any) {
        throw new Error(error.message)
    }
}
async function dbDeleteComment(commentID: number, userID: number) {
    try {
        const queryString = [
            'DELETE FROM comments',
            'WHERE comment_id = ? AND user_id = ?'
        ].join(' ')
        const [result] = await database.query(queryString, [commentID, userID]) as RowDataPacket[]
        if (result.affectedRows === 0) throw new Error('No comments were deleted')
    } catch (error: any) {
        throw new Error(error.message)
    }
}
export {
    dbQueryComments,
    dbInsertComment,
    dbDeleteComment
}