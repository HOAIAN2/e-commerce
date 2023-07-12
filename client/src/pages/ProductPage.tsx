import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { reqGetProduct, reqGetProductsSuggest, ProductFull, ProductList } from '../utils/product'
import NotFound from './NotFound'
import Loading from '../components/Loading'
import ProductRating from '../components/ProductRating'
import { baseIMG } from '../utils/api-config'
import './ProductPage.scss'

function ProductPage() {
    const [data, setData] = useState<ProductFull | null>(null)
    const [suggestProducts, setSuggestProducts] = useState<ProductList | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    useEffect(() => {
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
        reqGetProductsSuggest(Number(id))
            .then(data => {
                setSuggestProducts(data)
            })
            .catch(() => {
                setNotFound(true)
            })
    }, [id])
    data && console.log(data)
    suggestProducts && console.log(suggestProducts)
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
                        <span>{'total rating count: ' + data?.ratingCount}</span>
                        <span>{'sold quantity: ' + data?.soldQuantity}</span>
                    </div>
                    <div>{data?.price.toLocaleString('en-us') + ' VND'}</div>
                    {data?.discount ? <span>{'-' + data?.discount * 100 + '%'}</span> : null}
                </div>
            </div>
        </div>
    )
}

export default ProductPage