import { FastifyInstance, RegisterOptions, FastifySchema } from "fastify"
import { handleGetComments, handleInsertComment } from "../controllers/index.js"
import { authenticateToken } from "../services/auth.js"
import { trimBody, errorReply } from "../services/index.js"

const getCommentsSchema: FastifySchema = {
    tags: ['Comment'],
    querystring: {
        type: 'object',
        properties: {
            id: { type: 'integer', minimum: 1 },
            startIndex: { type: 'integer', minimum: 1 },
            sortMode: { type: 'string', pattern: "ASC|DESC" },
        },
        required: ['id', 'sortMode'],
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    commentID: { type: 'integer' },
                    userID: { type: 'integer' },
                    avatar: { type: 'string' },
                    userFirstName: { type: 'string' },
                    userLastName: { type: 'string' },
                    productID: { type: 'integer' },
                    comment: { type: 'string' },
                    rate: { type: 'integer' },
                    soldQuantity: { type: 'integer' },
                    commentDate: { type: 'string' }
                }
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}
const addCommentSchema: FastifySchema = {
    tags: ['Comment'],
    headers: {
        type: 'object',
        properties: {
            'authorization': { type: 'string' }
        },
        required: ['authorization']
    },
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer', minimum: 1 },
        },
        required: ['integer']
    },
    body: {
        type: 'object',
        properties: {
            content: { type: 'string' }
        },
        required: ['content']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                commentID: { type: 'integer' },
                userID: { type: 'integer' },
                avatar: { type: 'string' },
                userFirstName: { type: 'string' },
                userLastName: { type: 'string' },
                productID: { type: 'integer' },
                comment: { type: 'string' },
                rate: { type: 'integer' },
                soldQuantity: { type: 'integer' },
                commentDate: { type: 'string' }
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}

async function commentRoutes(app: FastifyInstance, options: RegisterOptions) {
    app.get('/', {
        handler: handleGetComments,
        schema: getCommentsSchema
    })
    app.post('/', {
        preHandler: [authenticateToken, trimBody],
        handler: handleInsertComment,
        schema: addCommentSchema
    })
}

export default commentRoutes