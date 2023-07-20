import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { reqGetProduct, reqGetProductsSuggest, ProductFull, ProductList } from '../utils/product'
import NotFound from './NotFound'
import Loading from '../components/Loading'
import ProductRating from '../components/ProductRating'
import Product from '../components/Product'
import Comments from '../components/Comments'
import { baseIMG } from '../utils/api-config'
import './ProductPage.scss'

function ProductPage() {
    const [data, setData] = useState<ProductFull | null>(null)
    const [suggestProducts, setSuggestProducts] = useState<ProductList | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const { id } = useParams()
    function handleUpdateQuantity(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (e.currentTarget.textContent === '+') {
            if (data && quantity < data?.quantity) setQuantity(quantity + 1)
        }
        else {
            if (quantity >= 2) setQuantity(quantity - 1)
        }
    }
    useEffect(() => {
        window.scrollTo(0, 0)
        reqGetProduct(Number(id))
            .then(data => {
                document.title = data.productName
                setData(data)
                setLoading(false)
            })
            .catch(() => {
                setNotFound(true)
                setLoading(false)
            })
        reqGetProductsSuggest(Number(id), 4)
            .then(data => {
                setSuggestProducts(data)
            })
            .catch(() => {
                setNotFound(true)
            })
    }, [id])
    // data && console.log(data)
    // suggestProducts && console.log(suggestProducts)
    if (notFound) return <NotFound />
    if (loading) return <Loading />
    return (
        <div className='product-page'>
            <div className='content'>
                <div className='left'>
                    <img src={baseIMG + 'products/' + data?.images} alt="" />
                </div>
                <div className='right'>
                    <div className='title'>{data?.productName}</div>
                    <div className='sub-title'>
                        <span>{data?.rating}</span>
                        {data && <ProductRating rate={data?.rating} />}
                        <span
                            style={
                                {
                                    borderRight: '1px solid black',
                                    marginRight: '15px',
                                    paddingRight: '15px'
                                }
                            }>
                            {'(' + data?.ratingCount + ')'}
                        </span>
                        <span
                            style={
                                {
                                    borderRight: '1px solid black',
                                    marginRight: '15px',
                                    paddingRight: '15px'
                                }
                            }
                        >{data?.soldQuantity + ' sold'}</span>
                        <span>Only <span
                            className='items-left'
                        >{data?.quantity} items</span>left</span>
                    </div>
                    <div className='price'>{data?.price.toLocaleString('en-us') + ' VND'}</div>
                    {data?.discount ? <span>{'-' + data?.discount * 100 + '%'}</span> : null}
                    <div className='select-quantity'>
                        <button onClick={handleUpdateQuantity}>-</button>
                        <div>
                            <span>{quantity}</span>
                        </div>
                        <button onClick={handleUpdateQuantity}>+</button>
                    </div>
                    <button className='add-to-cart'>Add to cart</button>
                </div>
            </div>
            <div className='suggest-products'>
                {suggestProducts?.map(product => <Product key={product.productID} data={product} />)}
            </div>
            {data !== null ? <Comments product={data} setProduct={setData} /> : null}
        </div>
    )
}

export default ProductPage