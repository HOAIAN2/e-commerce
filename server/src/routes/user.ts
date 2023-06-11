import { FastifyInstance, RegisterOptions, FastifySchema } from "fastify"
import { handleGetInfo, handleEditInfo, handleAddAvatar } from "../controllers/index.js"
import { authenticateToken } from "../services/auth.js"
import { trimBody } from "../services/index.js"

const userSchema: FastifySchema = {
    tags: ['User'],
    headers: {
        type: 'object',
        properties: {
            'authorization': { type: 'string' }
        },
        required: ['authorization']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                userID: { type: 'integer' },
                username: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                birthDate: { type: 'string' },
                sex: { type: 'string' },
                address: { type: 'string' },
                email: { type: 'string' },
                phoneNumber: { type: 'string' },
                avatar: { type: 'string' },
                orderCount: { type: 'integer' },
            }
        }
    }
}
const userChangeInfoSchema: FastifySchema = {
    tags: ['User'],
    headers: {
        type: 'object',
        properties: {
            'authorization': { type: 'string' }
        },
        required: ['authorization']
    },
    body: {
        type: 'object',
        properties: {
            username: { type: 'string', minLength: 8, maxLength: 255, pattern: '^(?=[a-zA-Z0-9._]{8,100}$)(?!.*[_.]{2})[^_.].*[^_.]$' },
            firstName: { type: 'string', maxLength: 255 },
            lastName: { type: 'string', maxLength: 255 },
            birthDate: { type: 'string', minLength: 10 },
            sex: { type: 'string', maxLength: 1 },
            address: { type: 'string', maxLength: 255 },
            email: { type: 'string', maxLength: 255, pattern: '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$' },
            phoneNumber: { type: 'string', minLength: 13, pattern: '0\d{9}' },
        },
        required: ['username', 'firstName', 'lastName', 'birthDate', 'sex', 'address']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                userID: { type: 'integer' },
                username: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                birthDate: { type: 'string' },
                sex: { type: 'string' },
                address: { type: 'string' },
                email: { type: 'string' },
                phoneNumber: { type: 'string' },
                avatar: { type: 'string' },
                orderCount: { type: 'integer' },
            }
        }
    }
}
const avatarSchema: FastifySchema = {
    tags: ['User'],
    consumes: ["multipart/form-data"],
    headers: {
        type: 'object',
        properties: {
            'authorization': { type: 'string' },
        },
        required: ['authorization']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                userID: { type: 'integer' },
                username: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                birthDate: { type: 'string' },
                sex: { type: 'string' },
                address: { type: 'string' },
                email: { type: 'string' },
                phoneNumber: { type: 'string' },
                avatar: { type: 'string' },
                orderCount: { type: 'integer' },
            }
        }
    }
}
async function userRoutes(app: FastifyInstance, options: RegisterOptions) {
    app.get('/info', {
        preHandler: [authenticateToken],
        handler: handleGetInfo,
        schema: userSchema
    })
    app.post('/info', {
        preHandler: [authenticateToken, trimBody],
        handler: handleEditInfo,
        schema: userChangeInfoSchema
    })
    app.post('/avatar', {
        preHandler: [authenticateToken],
        handler: handleAddAvatar,
        schema: avatarSchema
    })
}

export default userRoutes