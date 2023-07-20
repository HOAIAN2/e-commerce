import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ProductList, reqGetProductsSearch } from '../utils/product'
import Product from '../components/Product'
import Loading from '../components/Loading'
import './Search.scss'

function Search() {
    const [products, setProducts] = useState([] as ProductList)
    const [loading, setLoading] = useState(true)
    const [hasNext, setHasNext] = useState(true)
    const navigate = useNavigate()
    const [searchParam] = useSearchParams()
    function handleLoadMore() {
        reqGetProductsSearch(searchParam.get('name') as string, products.at(-1)?.productID)
            .then(data => {
                setProducts([...products, ...data.data])
                setHasNext(data.hasNext)
            })
    }
    useEffect(() => {
        setLoading(true)
        reqGetProductsSearch(searchParam.get('name') as string)
            .then(data => {
                window.scrollTo(0, 0)
                setProducts(data.data)
                setHasNext(data.hasNext)
                setLoading(false)
            })
            .catch(() => {
                navigate('/')
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam.get('name')])
    if (loading) return <Loading />
    return (
        <div className='search-page'>
            <div className='products-list'>
                {products.map(product => <Product key={product.productID} data={product} />)}
            </div>
            {hasNext && <button
                onClick={handleLoadMore}
                className='load-more'>Load more</button>}
        </div>
    )
}

export default Search