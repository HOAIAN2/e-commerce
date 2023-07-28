import { FastifyRequest, FastifyReply } from "fastify"
import {
    dbSelectUserByUsername,
    dbUpdateUserInfo,
    usersCache,
    dbUpdateUserAvatar
} from "../database/index.js"
import { readTokenFromRequest } from "../services/auth.js"
import { errorMessage, getLanguage } from "../services/index.js"
import fs from "fs/promises"
import path from "path"
import { __dirname } from "../config.js"
import languages from './languages/authError.json' assert { type: "json" }


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
        return reply.status(500).send(errorMessage("Server error"))
    }
}
async function handleEditInfo(request: FastifyRequest, reply: FastifyReply) {
    const language = languages[getLanguage(request) as keyof typeof languages]
    const data = request.body as UserChangInfo
    const tokenData = readTokenFromRequest(request)
    if (!tokenData) return reply.status(401).send()
    try {
        const user = await dbSelectUserByUsername(tokenData.username)
        if (!user) return reply.code(400).send(errorMessage(language.usernameNotFound))
        await dbUpdateUserInfo(user?.userID, data)
        user.setUsername(data.username)
        user.setFirstName(data.firstName)
        user.setLastName(data.lastName)
        user.setSex(data.sex)
        user.setAddress(data.address)
        user.setBirthDate(data.birthDate)
        user.setEmail(data.email)
        user.setPhoneNumber(data.phoneNumber)
        if (data.username !== tokenData.username) {
            usersCache.remove(tokenData.username)
            usersCache.set(user)
        }
        return reply.send(user)
    } catch (error: any) {
        if (error.includes('UQ_username')) return reply.status(400).send(errorMessage(language.emailExists))
        if (error.includes('UQ_email')) return reply.status(400).send(errorMessage(language.emailExists))
        if (error.includes('UQ_phone_number')) return reply.status(400).send(errorMessage(language.emailExists))
        return reply.status(500).send(errorMessage("Server error"))
    }
}
async function handleAddAvatar(request: FastifyRequest, reply: FastifyReply) {
    const language = languages[getLanguage(request) as keyof typeof languages]
    const acceptFormats = ['image/png', 'image/jpg', 'image/jpeg']
    const tokenData = readTokenFromRequest(request)
    if (!tokenData) return reply.status(401).send()
    try {
        const file = await request.file()
        if (!file) return reply.status(400).send(errorMessage(language.fileNotFound))
        if (!acceptFormats.includes(file.mimetype)) return reply.status(400).send(errorMessage(language.formatNotAccept))
        const user = await dbSelectUserByUsername(tokenData.username)
        if (!user) return reply.status(404).send(errorMessage(language.usernameNotFound))
        const buffer = await file.toBuffer()
        let fileName = `${Date.now()}-${user.username}.${file.mimetype.split('/')[1]}`
        let newPath = path.join(__dirname, '../static/avatars', fileName)
        console.log(fileName)
        console.log(user.avatar)
        await fs.writeFile(newPath, buffer)
        if (user.avatar !== 'user.png') await fs.unlink(path.join(__dirname, '../static/avatars', user.avatar))
        await dbUpdateUserAvatar(fileName, user.username)
        user.setAvatar(fileName)
        return reply.send(user)
    } catch (error: any) {
        console.log(error)
        if (error.message.includes('file too large')) return reply.status(500).send(errorMessage(language.fileTooLarge))
        return reply.status(500).send(errorMessage("Server error"))
    }
}

export {
    handleGetInfo,
    handleEditInfo,
    handleAddAvatar
}