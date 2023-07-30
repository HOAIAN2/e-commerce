import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProductItem } from '../utils/product'
import { baseIMG } from '../utils/api-config'
import ProductRating from './ProductRating'
import { getLanguage } from '../utils/languages'
import './Product.scss'

interface Language {
    addToCart: string
}

function Product({ data }: { data: ProductItem }) {
    const [language, setLanguage] = useState<Language>()
    useEffect(() => {
        const language = getLanguage()
        import(`./languages/${language}Product.json`)
            .then((data: Language) => {
                setLanguage(data)
            })
    })
    return (
        <div className='product'>
            <Link className='img-container' to={'/product/' + data.productID}>
                <img src={baseIMG + 'products/' + data.images[0]} alt="" />
            </Link>
            <div className='content-container'>
                <div className='name'>{data.productName}</div>
                <div className='rate'>
                    <ProductRating rate={data.rating} />({data.ratingCount})
                </div>
                <div className='price'>{data.price.toLocaleString('vi') + 'đ'}</div>
                <button>{language?.addToCart}</button>
            </div>
        </div>
    )
}

export default Product