import { FastifyRequest, FastifyReply } from "fastify"
import { dbSelectUserByUsername, dbUpdateUserInfo, usersCache, dbUpdateUserAvatar } from "../cache/index.js"
import { readTokenFromRequest } from "../services/auth.js"
import { generateErrorMessage } from "../services/index.js"
import fs from "fs/promises"
import path from "path"
import { __dirname } from "../config.js"

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
    const acceptFormats = ['image/png', 'image/jpg', 'image/jpeg']
    const tokenData = readTokenFromRequest(request)
    if (!tokenData) return reply.status(401).send()
    try {
        const file = await request.file()
        if (!file) return reply.status(400).send(generateErrorMessage("No file found"))
        if (!acceptFormats.includes(file.mimetype)) return reply.status(400).send(generateErrorMessage("format not accept"))
        const user = await dbSelectUserByUsername(tokenData.username)
        if (!user) return reply.status(404).send(generateErrorMessage("cannot find user"))
        const buffer = await file.toBuffer()
        let fileName = `${Date.now()}-${user.username}.${file.mimetype.split('/')[1]}`
        let newPath = path.join(__dirname, '../static/avatars', fileName)
        await fs.writeFile(newPath, buffer)
        if (user.avatar !== 'user.png') await fs.unlink(path.join(__dirname, '../static/avatars', user.avatar))
        await dbUpdateUserAvatar(fileName, user.username)
        user.setAvatar(fileName)
        return reply.send(user)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}

export {
    handleGetInfo,
    handleEditInfo,
    handleAddAvatar
}