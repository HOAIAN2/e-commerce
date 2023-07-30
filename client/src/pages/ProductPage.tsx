import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { reqGetProduct, reqGetProductsSuggest, ProductFull, ProductList } from '../utils/product'
import NotFound from './NotFound'
import ProductRating from '../components/ProductRating'
import Product from '../components/Product'
import Comments from '../components/Comments'
import { baseIMG } from '../utils/api-config'
import { useLanguage } from '../context/hooks'
import './ProductPage.scss'

interface Language {
    addToCart: string
    only: string
    items: string
    sold: string
}

function ProductPage() {
    const [data, setData] = useState<ProductFull | null>(null)
    const [suggestProducts, setSuggestProducts] = useState<ProductList | null>(null)
    const [notFound, setNotFound] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const { appLanguage } = useLanguage()
    const [language, setLanguage] = useState<Language>()
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
            })
            .catch(() => {
                setNotFound(true)
            })
        reqGetProductsSuggest(Number(id), 4)
            .then(data => {
                setSuggestProducts(data)
            })
            .catch(() => {
                setNotFound(true)
            })
    }, [id])
    useEffect(() => {
        import(`./languages/${appLanguage}ProductPage.json`)
            .then((data: Language) => {
                setLanguage(data)
            })
    }, [appLanguage])
    if (!data) return null
    if (notFound) return <NotFound />
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
                        >{data?.soldQuantity + ' ' + language?.sold}</span>
                        <span>{language?.only} <span
                            className='items-left'
                        >{data?.quantity} {language?.items}</span></span>
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
                    <button className='add-to-cart'>{language?.addToCart}</button>
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