class Comment {
    commentID: number
    userID: number
    avatar: string
    userFirstName: string
    userLastName: string
    productID: number
    comment: string
    rate: number
    commentDate: Date
    constructor(commentID: number, userID: number, avatar: string, userFirstName: string,
        userLastName: string, productID: number, comment: string, rate: number, commentDate: string) {
        this.commentID = commentID
        this.userID = userID
        this.avatar = avatar
        this.userFirstName = userFirstName
        this.userLastName = userLastName
        this.productID = productID
        this.comment = comment
        this.rate = rate
        this.commentDate = new Date(commentDate)
    }
}

export default Comment