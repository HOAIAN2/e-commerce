import { SERVER_HOST, SERVER_PORT, __dirname } from "./config.js"
import { initializeData } from "./database/index.js"
import app from "./app.js"

initializeData().then(() => {
    app.listen({
        port: SERVER_PORT,
        host: SERVER_HOST
    })
}).catch((error) => {
    console.log('\x1b[31m%s\x1b[0m', error.message)
    process.exit(1)
})