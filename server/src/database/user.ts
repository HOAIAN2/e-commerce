import { Cache } from "js-simple-cache"
import { User } from "../models/index.js"
import database from "./database.js"
import { RowDataPacket } from "mysql2/promise"

const usersCache = new Cache('username', 1000)

interface DBUser {
    "user_id": number
    "role": string
    "username": string
    "first_name": string
    "last_name": string
    "birth_date": string
    "sex": string
    "address": string
    "email": string
    "phone_number": string
    "avatar": string
    "order_count": number
    "hashed_password": string
}
interface NewUser {
    username: string
    firstName: string
    lastName: string
    birthDate: string
    sex: string
    address: string
    email: string
    phoneNumber: string
    hashedPassword: string
}
interface UpdateUser {
    username: string
    firstName: string
    lastName: string
    birthDate: string
    sex: string
    address: string
    email: string
    phoneNumber: string
}

async function initializeUser() {
    console.log('\x1b[1m%s\x1b[0m', 'Initializing users data...')
    try {
        const queryString = [
            'SELECT users.user_id, roles.name AS role, username, first_name, last_name, birth_date,',
            'sex, address, email, phone_number, avatar, order_count, hashed_password FROM users',
            'JOIN roles ON users.role_id = roles.id',
            'LEFT JOIN (SELECT user_id, COUNT(*) as order_count FROM orders GROUP BY user_id) AS orders',
            'ON users.user_id = orders.user_id'
        ].join(' ')
        const [rows] = await database.query(queryString) as RowDataPacket[]
        rows.forEach((row: DBUser) => {
            const userID = row['user_id']
            const role = row['role']
            const username = row['username']
            const firstName = row['first_name']
            const lastName = row['last_name']
            const birthDate = row['birth_date']
            const sex = row['sex']
            const address = row['address']
            const email = row['email']
            const phoneNumber = row['phone_number']
            const avatar = row['avatar']
            const orderCount = row["order_count"]
            const hashedPassword = row['hashed_password']
            // push to cache array
            const user = new User(userID, role, username, firstName, lastName, birthDate, sex, address, email, phoneNumber, avatar, orderCount, hashedPassword)
            usersCache.set(user)
        })
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', `Fail to initialize users data: ${error.message}`)
        throw new Error(`Fail to initialize users data: ${error.message}`)
    }
}
async function dbSelectUserByUsername(username: string) {
    if (usersCache.has(username)) return usersCache.get(username) as User
    try {
        // Preventing SQL injection in Node.js with placeholder
        const queryString = [
            'SELECT users.user_id, roles.name AS role, username, first_name, last_name, birth_date,',
            'sex, address, email, phone_number, avatar, order_count, hashed_password FROM users',
            'JOIN roles ON users.role_id = roles.id',
            'LEFT JOIN (SELECT user_id, COUNT(*) as order_count FROM orders GROUP BY user_id) AS orders',
            'ON users.user_id = orders.user_id',
            'WHERE username = ?'
        ].join(' ')
        const [rows] = await database.query(queryString, [username]) as RowDataPacket[]
        const data: DBUser = rows[0]
        if (data) {
            const userID = data['user_id']
            const role = data['role']
            const username = data['username']
            const firstName = data['first_name']
            const lastName = data['last_name']
            const birthDate = data['birth_date']
            const sex = data['sex']
            const address = data['address']
            const email = data['email']
            const phoneNumber = data['phone_number']
            const avatar = data['avatar']
            const orderCount = data["order_count"]
            const hashedPassword = data['hashed_password']
            const user = new User(userID, role, username, firstName, lastName, birthDate, sex, address, email, phoneNumber, avatar, orderCount, hashedPassword)
            usersCache.set(user)
            return user
        }
        return null
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbInsertUser(user: NewUser) {
    try {
        const queryString = [
            'INSERT INTO users (role_id, username, first_name, last_name, birth_date, sex, address, email, phone_number, hashed_password)',
            'VALUES (2, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ].join(' ')
        await database.query(queryString, [
            user.username,
            user.firstName,
            user.lastName,
            user.birthDate,
            user.sex,
            user.address,
            user.email,
            user.phoneNumber,
            user.hashedPassword
        ])
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}

async function dbUpdateUserInfo(id: number, data: UpdateUser) {
    const queryString = [
        'UPDATE users SET',
        'username = ? ,',
        'first_name = ? ,',
        'last_name = ? ,',
        'birth_date = ? ,',
        'sex = ? ,',
        'address = ? ,',
        'email = ? ,',
        'phone_number = ?',
        'WHERE user_id = ?'
    ].join(' ')
    try {
        await database.query(queryString, [
            data.username,
            data.firstName,
            data.lastName,
            data.birthDate,
            data.sex,
            data.address,
            data.email,
            data.phoneNumber,
            id
        ])
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbUpdateUserPassword(username: string, password: string) {
    const queryString = ['UPDATE users SET hashed_password = ? WHERE username = ?'].join('')
    try {
        await database.query(queryString, [password, username])
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}

async function dbUpdateUserAvatar(path: string, username: string) {
    const queryString = ['UPDATE users SET avatar = ? WHERE username = ?'].join('')
    try {
        await database.query(queryString, [path, username])
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
export {
    usersCache,
    initializeUser,
    dbSelectUserByUsername,
    dbInsertUser,
    dbUpdateUserInfo,
    dbUpdateUserPassword,
    dbUpdateUserAvatar,
    NewUser
}
