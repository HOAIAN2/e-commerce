import { useEffect, useRef, useState } from "react"
import { ProductFull } from "../utils/product"
import useUserData from "../context/hooks"
import { baseIMG } from "../utils/api-config"
import { useLocation, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import CommentItem from "./CommentItem"
import { Comment, reqGetComments, reqPostComment } from '../utils/comment'
import { reqGetProduct } from "../utils/product"
import './Comments.scss'

function Comments({ product, setProduct }: { product: ProductFull, setProduct: React.Dispatch<React.SetStateAction<ProductFull | null>> }) {
    const { user } = useUserData()
    const [commentOrder, setCommentOrder] = useState('latest')
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState<Comment[]>([])
    const commentRef = useRef<HTMLTextAreaElement>(null)
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
    return (
        <div className='comments' >
            <div className='comment-count'>
                <span>Comment ({product.commentCount})</span>
                <select value={commentOrder}
                    onChange={e => {
                        setCommentOrder(e.target.value)
                    }}>
                    <option>Latest</option>
                    <option>Oldest</option>
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
                        placeholder='Write comment'
                        value={comment}
                        onFocus={() => {
                            console.log(user)
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
                {comments.length !== product.commentCount ? <button onClick={handleLoadComments}>Load more</button> : null}
            </div>
        </ div>
    )
}

export default Comments