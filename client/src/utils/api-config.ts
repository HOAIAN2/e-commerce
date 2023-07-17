import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { reqGetToken } from './auth';

interface Token {
    accessToken: string
    refreshToken: string
}
interface AccessTokenData {
    id: number;
    username: string;
    iat: number;
    exp: number;
}

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

request.interceptors.request.use(async (config) => {
    if (getToken().accessToken) {
        config.headers.Authorization = getTokenHeader()
    }
    if (config.headers.Authorization) {
        const token = jwtDecode(getToken().accessToken) as AccessTokenData
        if (token.exp * 1000 < new Date().getTime()) {
            await reqGetToken()
            config.headers.Authorization = getTokenHeader()
        }
    }
    return config
})

export {
    baseIMG,
    getToken,
    getTokenHeader,
    type Token
}
export default request