import request, { getToken } from './api-config'
// import { reqGetToken } from './auth'
import { UserData } from '../context/UserContext'

interface PostUserData {
    username: string
    firstName: string
    lastName: string
    birthDate: string
    sex: string
    address: string
    email: string
    phoneNumber: string
}

async function reqGetUser() {
    if (!getToken().accessToken) throw new Error('no token')
    try {
        const res = await request.get('/user/info')
        return res.data as UserData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}

async function reqPostInfo(data: PostUserData) {
    if (!getToken().accessToken) throw new Error('no token')
    try {
        const res = await request.post('/user/info', data)
        return res.data as UserData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}

async function reqPostAvatar(file: File) {
    if (!getToken().accessToken) throw new Error('no token')
    const formData = new FormData()
    formData.append("file", file)
    try {
        const res = await request.post('/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return res.data as UserData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}

export {
    reqGetUser,
    reqPostAvatar,
    reqPostInfo
}