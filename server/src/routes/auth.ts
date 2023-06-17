import { FastifyInstance, RegisterOptions, FastifySchema } from "fastify"
import { authenticateToken } from "../services/auth.js"
import {
    handleLogin,
    handleRegister,
    handleLogout,
    handleChangePassword,
    handleRefreshToken
} from "../controllers/index.js"
import { errorReply, trimBody } from "../services/index.js"

const loginSchema: FastifySchema = {
    tags: ['Auth'],
    body: {
        type: 'object',
        properties: {
            username: { type: 'string', minLength: 8, maxLength: 255, pattern: '^(?=[a-zA-Z0-9._]{8,100}$)(?!.*[_.]{2})[^_.].*[^_.]$' },
            password: { type: 'string', minLength: 8 },
        },
        required: ['username', 'password',]
    },
    response: {
        200: {
            type: 'object',
            properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}
const registerSchema: FastifySchema = {
    tags: ['Auth'],
    body: {
        type: 'object',
        properties: {
            username: { type: 'string', minLength: 8, maxLength: 255, pattern: '^(?=[a-zA-Z0-9._]{8,100}$)(?!.*[_.]{2})[^_.].*[^_.]$' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string', maxLength: 255 },
            lastName: { type: 'string', maxLength: 255 },
            birthDate: { type: 'string', minLength: 10 },
            sex: { type: 'string', maxLength: 1 },
            address: { type: 'string', maxLength: 255 },
            email: { type: 'string', maxLength: 255, pattern: '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$' },
            phoneNumber: { type: 'string', minLength: 13, pattern: '0\d{9}' },
        },
        required: ['username', 'password', 'firstName', 'lastName', 'birthDate', 'sex', 'address']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}
const logoutSchema: FastifySchema = {
    tags: ['Auth'],
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
            refreshToken: { type: 'string' },
        },
        required: ['refreshToken']
    },
    response: {
        '4xx': errorReply,
        '5xx': errorReply
    }
}
const refreshTokenSchema: FastifySchema = {
    tags: ['Auth'],
    // headers: {
    //     type: 'object',
    //     properties: {
    //         'authorization': { type: 'string' }
    //     },
    //     required: ['authorization']
    // },
    body: {
        type: 'object',
        properties: {
            refreshToken: { type: 'string' },
        },
        required: ['refreshToken']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}
const changePasswordSchema: FastifySchema = {
    tags: ['Auth'],
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
            password: { type: 'string', minLength: 8 },
            newPassword: { type: 'string', minLength: 8 },
        },
        required: ['newPassword', 'password']
    }
}
async function authRoutes(app: FastifyInstance, options: RegisterOptions) {
    app.post('/login', {
        handler: handleLogin,
        schema: loginSchema
    })
    app.post('/register', {
        preHandler: [trimBody],
        handler: handleRegister,
        schema: registerSchema
    })
    app.post('/logout', {
        preHandler: [authenticateToken],
        handler: handleLogout,
        schema: logoutSchema
    })
    app.post('/refresh', {
        handler: handleRefreshToken,
        schema: refreshTokenSchema
    })
    app.post('/password', {
        preHandler: [authenticateToken],
        handler: handleChangePassword,
        schema: changePasswordSchema
    })
}

export default authRoutes