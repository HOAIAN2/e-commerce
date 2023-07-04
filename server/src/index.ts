import fastify, { FastifyReply, FastifyRequest } from "fastify"
import fastifyStatic from "@fastify/static"
import path from "path"
import { SERVER_HOST, SERVER_PORT, __dirname } from "./config.js"
import fs from "fs"
import {
    userRoutes,
    authRoutes,
    productRoutes,
    orderRoutes,
    commentRoutes
} from "./routes/index.js"
import { initializeData } from "./cache/index.js"
import fastifySwagger, { SwaggerOptions } from "@fastify/swagger"
import fastifySwaggerUi, { FastifySwaggerUiOptions } from "@fastify/swagger-ui"
import fastifyMultipart, { FastifyMultipartOptions } from "@fastify/multipart"
import cors from '@fastify/cors'
import fastifyRateLimit from "@fastify/rate-limit"

const app = fastify({
    logger: {
        level: 'info',
        // file: '../log.txt' // Will use pino.destination()
    },
    // http2: true,
    // https: {
    //     key: fs.readFileSync(path.join(__dirname, '..', 'src/services/security', 'server.key')),
    //     cert: fs.readFileSync(path.join(__dirname, '..', 'src/services/security', 'server.crt'))
    // }
})

const multipartOptions: FastifyMultipartOptions = {
    throwFileSizeLimit: true,
    limits: {
        // fieldNameSize: 100, // Max field name size in bytes
        // fieldSize: (512 * 1024),     // Max field value size in bytes
        fields: 10,         // Max number of non-file fields
        fileSize: (512 * 1024),  // For multipart forms, the max file size in bytes
        files: 1,           // Max number of file fields
        headerPairs: 2000,  // Max number of header key=>value pairs
    }
}

// swagger
const swaggerOptions: SwaggerOptions = {
    swagger: {
        info: {
            title: "Swagger docs for e-commerce",
            description: "My Description.",
            version: "1.0.0",
        },
        host: `localhost:${SERVER_PORT}`,
        schemes: ["http", "https"],
        consumes: ['application/json', 'multipart/form-data'],
        produces: ["application/json"],
    },
    // mode: 'static',
    // specification: {
    //     path: '../json.json',
    //     postProcessor: function (swaggerObject) {
    //         return swaggerObject
    //     },
    //     baseDir: '/path/to/external/spec/files/location',
    // },
}

const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/docs",
    // exposeRoute: true,
}
await app.register(fastifyRateLimit.default, {
    max: 300,
    timeWindow: '1 minute'
})
app.register(fastifyMultipart, multipartOptions)
app.register(fastifySwagger, swaggerOptions);
app.register(fastifySwaggerUi, swaggerUiOptions);
//


// Only God know what I'm doing
app.register((instance, opts, next) => {
    instance.register(fastifyStatic, {
        root: path.join(__dirname, '../public'),
    })
    next()
})

app.register((instance, opts, next) => {
    instance.register(fastifyStatic, {
        root: path.join(__dirname, '../static'),
        prefix: '/static'
    })
    next()
})

app.register(cors, {
    origin: "*"
})
app.register(userRoutes, { prefix: '/api/user' })
app.register(authRoutes, { prefix: '/api/auth' })
app.register(productRoutes, { prefix: '/api/product' })
app.register(orderRoutes, { prefix: '/api/order' })
app.register(commentRoutes, { prefix: '/api/comment' })

app.setNotFoundHandler((request: any, reply: any) => { // same of `setErrorHandler`
    return reply.sendFile('index.html', path.join(__dirname, '/public'))
})

initializeData().then(() => {
    app.listen({
        port: SERVER_PORT,
        host: SERVER_HOST
    })
}).catch((error) => {
    console.log('\x1b[31m%s\x1b[0m', error.message)
    process.exit(1)
})