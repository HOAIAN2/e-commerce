import { FastifyRequest, FastifyReply } from "fastify"
const errorReply = {
    type: 'object',
    properties: {
        message: { type: 'string' }
    }
}
function generateErrorMessage(message: string) {
    return {
        message: message
    }
}
async function trimBody(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as any
    Object.keys(data).forEach((key) => {
        if (typeof data[key] === 'string') {
            data[key] = data[key].trim()
            if (data[key] === '') data[key] = undefined
        }
    })
}

export {
    errorReply,
    generateErrorMessage,
    trimBody
}