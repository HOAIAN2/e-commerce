import { FastifyRequest, FastifyReply } from "fastify"
import { User } from "../models/index.js"
import { dbSelectUserByUsername, dbUpdateUserInfo, usersCache } from "../cache/index.js"
import { readTokenFromRequest } from "../services/auth.js"
import { generateErrorMessage } from "../services/index.js"

interface UserChangInfo {
    username: string
    firstName: string
    lastName: string
    birthDate: string
    sex: string
    address: string
    email: string
    phoneNumber: string
}

async function handleGetInfo(request: FastifyRequest, reply: FastifyReply) {
    const tokenData = readTokenFromRequest(request)
    if (!tokenData) return reply.status(401).send()
    try {
        const user = await dbSelectUserByUsername(tokenData.username)
        return reply.send(user)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleEditInfo(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as UserChangInfo
    const tokenData = readTokenFromRequest(request)
    if (!tokenData) return reply.status(401).send()
    try {
        const user = await dbSelectUserByUsername(tokenData.username)
        if (!user) return reply.code(400).send(generateErrorMessage("cannot find user"))
        await dbUpdateUserInfo(user?.userID, data)
        user.setUsername(data.username)
        user.setFirstName(data.firstName)
        user.setLastName(data.lastName)
        user.setSex(data.sex)
        user.setAddress(data.birthDate)
        user.setBirthDate(data.birthDate)
        user.setEmail(data.email)
        user.setPhoneNumber(data.phoneNumber)
        if (data.username !== tokenData.username) {
            usersCache.remove(tokenData.username)
            usersCache.set(user)
        }
        return reply.send(user)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleAddAvatar(request: FastifyRequest, reply: FastifyReply) {
    const file = await request.file()
    // console.log(request)
    console.log(file)
    // const tokenData = readTokenFromRequest(request)
    // if (!tokenData) return reply.status(401).send()
    // const user = await dbSelectUserByUsername(tokenData.username)
    // return reply.send(user)
}

export {
    handleGetInfo,
    handleEditInfo,
    handleAddAvatar
}