import axios from 'axios'

interface Token {
    accessToken: string
    refreshToken: string
}

const devOrigin = [
    'http://127.0.0.1:3000',
    'http://localhost:3000'
]
let baseURL = ''
let baseIMG = ''
if (devOrigin.includes(window.location.origin)) {
    baseURL = 'https://localhost:4000/api/'
    baseIMG = 'https://localhost:4000/static/'
}
else {
    baseURL = `${window.location.origin}/api/`
    baseIMG = `${window.location.origin}/static/`
}
function getToken() {
    const token = JSON.parse(localStorage.getItem('token') || '{}') as Token
    return token
}
function getTokenHeader() {
    return `Bearer ${getToken().accessToken}`
}
const request = axios.create({
    baseURL: baseURL
})

export {
    baseIMG,
    getToken,
    getTokenHeader,
    type Token
}
export default request