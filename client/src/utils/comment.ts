import request from './api-config'

export interface Comment {
    commentID: number
    userID: number
    avatar: string
    userFirstName: string
    userLastName: string
    productID: number
    comment: string
    rate: number
    soldQuantity: number
    commentDate: string
}

async function reqGetComments(id: number, startIndex?: number, sortMode = 'ASC' || 'DESC') {
    try {
        const res = await request.get('/comment', {
            params: {
                id: id,
                startIndex: startIndex,
                sortMode: sortMode
            }
        })
        return res.data as Comment[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}
async function reqPostComment(id: number, content: string) {
    try {
        const res = await request.post(`/comment/${id}`, {
            content: content
        })
        return res.data as Comment
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}
export {
    reqGetComments,
    reqPostComment
}