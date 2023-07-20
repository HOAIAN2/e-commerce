import { baseIMG } from '../utils/api-config'
import './CommentItem.scss'
import ProductRating from './ProductRating'
import { Comment } from '../utils/comment'

function CommentItem({ data }: { data: Comment }) {
    return (
        <div className="comment-item">
            <div className='content-left'>
                <div className='avatar'>
                    <img src={`${baseIMG}avatars/${data.avatar}`} alt="" />
                </div>
            </div>
            <div className='content-right'>
                <div className='content-title'>
                    <span className="name">{`${data.userLastName} ${data.userFirstName}`}</span>
                    <ProductRating rate={data.rate} />
                    <span className="date">{new Date(data.commentDate).toLocaleDateString()}</span>
                </div>
                <div className='content-data'>
                    <p>{data.comment}</p>
                </div>
            </div>
        </div>
    )
}

export default CommentItem