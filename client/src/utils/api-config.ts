import axios from 'axios'

const devOrigin = [
    'http://127.0.0.1:3000',
    'http://localhost:3000'
]
let baseURL = ''
let baseIMG = ''
if (devOrigin.includes(window.location.origin)) {
    baseURL = 'http://localhost:4000/api/'
    baseIMG = 'http://localhost:4000/static/'
}
else {
    baseURL = `${window.location.origin}/api/`
    baseIMG = `${window.location.origin}/static/`
}
const request = axios.create({
    baseURL: baseURL
})

export {
    baseIMG
}
export default request