import { FastifyRequest, FastifyReply } from "fastify"
import { dbQueryComments, dbInsertComment } from "../cache/index.js"
import { generateErrorMessage } from "../services/index.js"
import { readTokenFromRequest } from "../services/auth.js"

interface GetComments {
    id: number
    startIndex?: number
    sortMode: string
}
interface AddCommentParam {
    id: number
}
interface AddCommentBody {
    content: string
}
async function handleGetComments(request: FastifyRequest, reply: FastifyReply) {
    const { id, startIndex, sortMode } = request.query as GetComments
    try {
        const comments = await dbQueryComments(id, startIndex, sortMode)
        return reply.send(comments)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleInsertComment(request: FastifyRequest, reply: FastifyReply) {
    const token = readTokenFromRequest(request)
    if (!token) return reply.status(401).send()
    const { id } = request.params as AddCommentParam
    const { content } = request.body as AddCommentBody
    if (!content) return reply.status(400).send(generateErrorMessage("Please send content"))
    try {
        const comment = await dbInsertComment(token.id, id, content)
        return reply.send(comment)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}

export {
    handleGetComments,
    handleInsertComment
}