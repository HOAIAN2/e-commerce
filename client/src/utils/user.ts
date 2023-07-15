import request, { getTokenHeader, getToken } from './api-config'
import { reqGetToken } from './auth'
import { UserData } from '../context/UserContext'

async function reqGetUser() {
    if (!getToken().accessToken) throw new Error('no token')
    try {
        const res = await request.get('/user/info', {
            headers: {
                Authorization: getTokenHeader()
            }
        })
        return res.data as UserData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response.status === 403) {
            try {
                await reqGetToken()
                const res = await request.get('/user/info', {
                    headers: {
                        Authorization: `Bearer ${getToken().accessToken}`
                    }
                })
                return res.data as UserData
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                throw new Error(error)
            }
        }
        else throw new Error(error)
    }
}

async function reqPostAvatar(file: File) {
    if (!getToken().accessToken) throw new Error('no token')
    const formData = new FormData();
    formData.append("file", file);
    try {
        const res = await request.post('/user/avatar', formData, {
            headers: {
                Authorization: getTokenHeader(),
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
    reqPostAvatar
}