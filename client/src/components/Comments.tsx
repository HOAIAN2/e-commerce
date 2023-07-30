import { useEffect, useRef, useState } from "react"
import { ProductFull } from "../utils/product"
import { useUserData } from "../context/hooks"
import { baseIMG } from "../utils/api-config"
import { useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import CommentItem from "./CommentItem"
import { Comment, reqGetComments, reqPostComment } from '../utils/comment'
import { reqGetProduct } from "../utils/product"
import { getLanguage } from "../utils/languages"
import './Comments.scss'

interface Language {
    comments: string
    latest: string
    oldest: string
    write: string
    loaderMore: string
}

function Comments({ product, setProduct }: { product: ProductFull, setProduct: React.Dispatch<React.SetStateAction<ProductFull | null>> }) {
    const { user } = useUserData()
    const [commentOrder, setCommentOrder] = useState('Latest')
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState<Comment[]>([])
    const commentRef = useRef<HTMLTextAreaElement>(null)
    const [language, setLanguage] = useState<Language>()
    const navigate = useNavigate()
    const location = useLocation()
    function handleSendComment() {
        if (comment === '') return
        reqPostComment(product.productID, comment)
            .then((data) => {
                setComments([data, ...comments])
                setComment('')
                return reqGetProduct(product.productID)
            })
            .then(data => {
                setProduct(data)
            })
            .catch(error => {
                console.error(error)
            })
    }
    function handleLoadComments() {
        //
    }
    useEffect(() => {
        if (commentRef.current) {
            commentRef.current.style.height = 'auto'
            commentRef.current.style.height = commentRef.current.scrollHeight + 'px'
        }
    }, [comment])
    useEffect(() => {
        reqGetComments(product.productID)
            .then(data => {
                setComments(data)
            })
    }, [product.productID])
    useEffect(() => {
        let orderMode = 'DESC'
        if (commentOrder === language?.oldest) orderMode = 'ASC'
        reqGetComments(product.productID, orderMode)
            .then(data => {
                setComments(data)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commentOrder])
    useEffect(() => {
        const language = getLanguage()
        import(`./languages/${language}Comments.json`)
            .then((data: Language) => {
                setLanguage(data)
            })
    })
    return (
        <div className='comments' >
            <div className='comment-count'>
                <span>{language?.comments} ({product.commentCount})</span>
                <select value={commentOrder}
                    onChange={e => {
                        setCommentOrder(e.target.value)
                    }}>
                    <option>{language?.latest}</option>
                    <option>{language?.oldest}</option>
                </select>
            </div>
            <div className='comment-writter'>
                <div className='left'>
                    <div className='avatar'>
                        {user === null ? <img src={`${baseIMG}default/user.png`} alt='' /> : <img src={user.avatar} alt='' />}
                    </div>
                </div>
                <div className='right'>
                    <textarea
                        ref={commentRef}
                        placeholder={language?.write}
                        value={comment}
                        onFocus={() => {
                            if (!user) {
                                navigate('/login', { state: { from: location } })
                            }
                        }}
                        onInput={(e) => { setComment(e.currentTarget.value) }}
                        maxLength={255}></textarea>
                    <button onClick={handleSendComment}>
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                </div>
            </div>
            <div className='comment-list'>
                {comments.map(comment => {
                    return <CommentItem key={comment.commentID} data={comment} />
                })}
                {comments.length !== product.commentCount ? <button onClick={handleLoadComments}>{language?.loaderMore}</button> : null}
            </div>
        </ div>
    )
}

export default Comments