import { reqGetProductsHome, ProductItem } from '../utils/product'
import { baseIMG } from '../utils/api-config'
import ProductRating from './ProductRating'
import './Product.scss'

function Product({ data }: { data: ProductItem }) {
    return (
        <div className='product'>
            <div className='img-container'>
                <img src={baseIMG + 'products/' + data.images[0]} alt="" />
            </div>
            <div className='content-container'>
                <div className='top'>
                    <div className='name'>{data.productName}</div>
                </div>
                <div className='bottom'>
                    <div className='price'>{data.price}</div>
                    <ProductRating rate={data.rating} />
                    <button>Add to cart</button>
                </div>
            </div>
            {/* {JSON.stringify(data)} */}
        </div>
    )
}

export default Product