import { FastifyRequest, FastifyReply } from "fastify"
import {
    dbSelectUserByUsername,
    dbInsertUser,
    dbUpdateUserPassword,
    dbInsertSession,
    dbDeleteAllUserSession,
    dbDeleteSession
} from "../cache/index.js"
import {
    createTokens,
    verifyPassword,
    hashPassword,
    readTokenFromString,
    generateSessionID,
    readTokenFromRequest,
    verifyRefreshToken
} from "../services/auth.js"
import { NewUser } from "../cache/user.js"
import { generateErrorMessage } from "../services/index.js"

interface UserLogin {
    username: string
    password: string
}
interface UserRegister {
    username: string
    firstName: string
    lastName: string
    birthDate: string
    sex: string
    address: string
    email: string
    phoneNumber: string
    password: string
}
interface UserLogout {
    refreshToken: string
}
interface UserRefreshToken {
    refreshToken: string
}
interface UserChangePassword {
    password: string
    newPassword: string
}
async function handleLogin(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as UserLogin
    try {
        const user = await dbSelectUserByUsername(data.username)
        if (!user) return reply.status(404).send(generateErrorMessage("cannot find user"))
        const isCorrect = await verifyPassword(data.password, user.hashedPassword)
        if (!isCorrect) return reply.status(400).send(generateErrorMessage("wrong password"))
        const tokens = createTokens(user)
        const sessionID = generateSessionID(readTokenFromString(tokens.refreshToken))
        await dbInsertSession(sessionID)
        return reply.send(tokens)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleRegister(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as UserRegister
    try {
        const hashedPassword = await hashPassword(data.password)
        if (await dbSelectUserByUsername(data.username)) return reply.status(400).send(generateErrorMessage("username exist"))
        const newData: NewUser = {
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            sex: data.sex,
            phoneNumber: data.phoneNumber,
            email: data.email,
            hashedPassword: hashedPassword,
            birthDate: data.birthDate
        }
        await dbInsertUser(newData)
        const user = await dbSelectUserByUsername(data.username)
        if (!user) return reply.status(404).send(generateErrorMessage("cannot find user"))
        const tokens = createTokens(user)
        const sessionID = generateSessionID(readTokenFromString(tokens.refreshToken))
        await dbInsertSession(sessionID)
        return reply.send(tokens)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleLogout(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as UserLogout
    try {
        await verifyRefreshToken(data.refreshToken)
        const accessToken = readTokenFromRequest(request)
        const refreshToken = readTokenFromString(data.refreshToken)
        if (accessToken?.username !== refreshToken.username) return reply.status(401).send()
        const sessionID = generateSessionID(refreshToken)
        await dbDeleteSession(sessionID)
        return reply.status(200).send()
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleChangePassword(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as UserChangePassword
    if (data.password === data.newPassword) return reply.status(400).send(generateErrorMessage("You are using same password"))
    const tokenData = readTokenFromRequest(request)
    if (!tokenData) return reply.status(401).send()
    try {
        const user = await dbSelectUserByUsername(tokenData.username)
        if (!user) return reply.status(404).send()
        if (! await verifyPassword(data.password, user.hashedPassword)) return reply.status(400).send(generateErrorMessage("wrong password"))
        const hashedPassword = await hashPassword(data.newPassword)
        await dbUpdateUserPassword(user.username, hashedPassword)
        user.setPassword(hashedPassword)
        await dbDeleteAllUserSession(user.username)
        return reply.status(200).send()
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleRefreshToken(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as UserRefreshToken
    try {
        await verifyRefreshToken(data.refreshToken)
        const refreshToken = readTokenFromString(data.refreshToken)
        const sessionID = generateSessionID(refreshToken)
        await dbDeleteSession(sessionID)
        const user = await dbSelectUserByUsername(refreshToken.username)
        if (!user) return reply.status(404).send(generateErrorMessage("cannot find user"))
        const tokens = createTokens(user)
        const newSessionID = generateSessionID(readTokenFromString(tokens.refreshToken))
        await dbInsertSession(newSessionID)
        return reply.send(tokens)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
export {
    handleLogin,
    handleRegister,
    handleLogout,
    handleChangePassword,
    handleRefreshToken
}