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
    for (const key in data) {
        if (data[key as keyof typeof data] === '') delete data[key as keyof typeof data]
    }
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
    const loaderElement = document.querySelector('#avatar-loader') as HTMLDivElement
    if (!getToken().accessToken) throw new Error('no token')
    const formData = new FormData()
    formData.append("file", file)
    try {
        const res = await request.post('/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(progressEvent) {
                if (progressEvent.progress) {
                    const percent = 100 * progressEvent.progress
                    if (percent !== 100) loaderElement.style.background = `conic-gradient(#92c72e ${progressEvent.progress * 100}%, #f4f4f4 0)`
                }
            },
        })
        loaderElement.style.background = ''
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