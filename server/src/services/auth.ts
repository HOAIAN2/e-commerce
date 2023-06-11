import { createSigner, createVerifier, createDecoder } from "fast-jwt"
import { User } from "../models/index.js"
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SERCET } from "../config.js"
import { compare, hash } from "bcrypt"
import { FastifyRequest, FastifyReply } from "fastify"

const signAccessToken = createSigner({ key: ACCESS_TOKEN_SECRET, expiresIn: (60 * 60 * 1000) })
const signRefreshToken = createSigner({ key: REFRESH_TOKEN_SERCET })
const verifyAccessToken = createVerifier({ key: ACCESS_TOKEN_SECRET })
const verifyRefreshToken = createVerifier({ key: REFRESH_TOKEN_SERCET })
const decodeToken = createDecoder()

interface TokenData {
    id: number
    username: string
    iat: number
    exp: number
}
function createTokens(user: User) {
    const tokens = {
        accessToken: signAccessToken({
            id: user.userID,
            username: user.username
        }),
        refreshToken: signRefreshToken({
            id: user.userID,
            username: user.username
        })
    }
    return tokens
}

async function hashPassword(password: string) {
    const hashedPassword = await hash(password, 10)
    return hashedPassword
}

async function verifyPassword(password: string, hashedPassword: string) {
    try {
        const isCorrect = await compare(password, hashedPassword)
        if (isCorrect) return true
        else return false
    } catch (errorMessages: any) {
        console.log('\x1b[31m%s\x1b[0m', errorMessages.message)
        return false
    }
}
function readTokenFromRequest(request: FastifyRequest): TokenData | null {
    const token = extractToken(request)
    if (token) return decodeToken(token)
    return null
}
function readTokenFromString(token: string): TokenData {
    return decodeToken(token)
}
async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
    const authorizationHeader = request.headers.authorization
    const token = authorizationHeader?.split(' ')[1]
    if (!token) return reply.status(401).send()
    try {
        await verifyAccessToken(token)
    } catch (errorMessages: any) {
        console.log('\x1b[31m%s\x1b[0m', errorMessages.message)
        reply.status(403).send()
    }
}
function extractToken(request: FastifyRequest) {
    const authorizationHeader = request.headers.authorization
    const token = authorizationHeader?.split(' ')[1]
    return token
}
function generateSessionID(token: TokenData) {
    return `${token.username}:${token.iat}`
}
export {
    createTokens,
    verifyPassword,
    authenticateToken,
    readTokenFromRequest,
    readTokenFromString,
    hashPassword,
    verifyRefreshToken,
    extractToken,
    generateSessionID,
    TokenData,
    decodeToken,
    verifyAccessToken
}