import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { reqGetProduct, reqGetProductsSuggest, ProductFull, ProductList } from '../utils/product'
import NotFound from './NotFound'
import Loading from '../components/Loading'

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
        <div className='product-page'></div>
    )
}

export default ProductPage