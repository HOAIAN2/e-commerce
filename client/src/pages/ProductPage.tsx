import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NotFound from './NotFound'
import { reqGetProduct, reqGetProductsSuggest, ProductFull, ProductList } from '../utils/product'

function ProductPage() {
    const [data, setData] = useState<ProductFull | null>(null)
    const [suggestProducts, setSuggestProducts] = useState<ProductList | null>(null)
    const [notFound, setNotFound] = useState(false)
    const { id } = useParams()
    useEffect(() => {
        reqGetProduct(Number(id))
            .then(data => {
                document.title = data.productName
                setData(data)
            })
            .catch((error: any) => {
                setNotFound(true)
            })
        reqGetProductsSuggest(Number(id))
            .then(data => {
                setSuggestProducts(data)
            })
            .catch((error: any) => {
                setNotFound(true)
            })
    }, [id])
    data && console.log(data)
    suggestProducts && console.log(suggestProducts)
    if (notFound) return <NotFound />
    return (
        <div className='product-page'></div>
    )
}

export default ProductPage