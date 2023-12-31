import request, { getToken } from './api-config'
export interface RegisterData {
    username: string
    password: string
    firstName: string
    lastName: string
    birthDate: string
    sex: string
    address: string
    email: string
    phoneNumber: string
}

async function reqLogin(username: string, password: string) {
    try {
        const res = await request.post('/auth/login', {
            username: username,
            password: password
        })
        localStorage.setItem('token', JSON.stringify(res.data))
        // return res.data as Token
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}
async function reqRegister(data: RegisterData) {
    for (const key in data) {
        if (data[key as keyof typeof data] === '') delete data[key as keyof typeof data]
    }
    try {
        const res = await request.post('/auth/register', data)
        localStorage.setItem('token', JSON.stringify(res.data))
        // return res.data as Token
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}
async function reqChangePass(password: string, newPassword: string) {
    try {
        await request.post('/auth/password', {
            password,
            newPassword
        })
        // return res.data as Token
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}
async function reqLogout() {
    try {
        await request.post('/auth/logout', {
            refreshToken: getToken().refreshToken
        })
        localStorage.removeItem('token')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        localStorage.removeItem('token')
        throw new Error(message)
    }
}

async function reqGetToken() {
    try {
        const res = await request.post('/auth/refresh', {
            refreshToken: getToken().refreshToken
        })
        localStorage.setItem('token', JSON.stringify(res.data))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response.status === 500) localStorage.removeItem('token')
        throw new Error(error.response.data.message)
    }
}
export {
    reqLogin,
    reqRegister,
    reqLogout,
    reqChangePass,
    reqGetToken
}