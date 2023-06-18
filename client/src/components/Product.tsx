import { Link } from 'react-router-dom'
import { ProductItem } from '../utils/product'
import { baseIMG } from '../utils/api-config'
import ProductRating from './ProductRating'
import './Product.scss'

function Product({ data }: { data: ProductItem }) {
    return (
        <div className='product'>
            {/* <div className='img-container'> */}
            <Link className='img-container' to={'/product/' + data.productID}>
                <img src={baseIMG + 'products/' + data.images[0]} alt="" />
            </Link>
            {/* </div> */}
            <div className='content-container'>
                {/* <div className='top'> */}
                <div className='name'>{data.productName}</div>
                <div className='rate'>
                    <ProductRating rate={data.rating} />({data.ratingCount})
                </div>
                {/* </div> */}
                {/* <div className='bottom'> */}
                <div className='price'>{data.price.toLocaleString('vi') + 'đ'}</div>
                <button>Add to cart</button>
                {/* </div> */}
            </div>
        </div>
    )
}

export default Product