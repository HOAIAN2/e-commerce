import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductList, reqGetProductsSearch } from '../utils/product'
import Product from '../components/Product'
import Loading from '../components/Loading'
import './Search.scss'

function Search() {
    const [products, setProducts] = useState([] as ProductList)
    const [loading, setLoading] = useState(true)
    const [searchParam] = useSearchParams()
    function handleLoadMore() {
        reqGetProductsSearch(searchParam.get('name') as string, products.at(-1)?.productID)
            .then(data => {
                setProducts([...products, ...data])
            })
    }
    useEffect(() => {
        setLoading(true)
        reqGetProductsSearch(searchParam.get('name') as string)
            .then(data => {
                window.scrollTo(0, 0)
                setProducts(data)
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam.get('name')])
    if (loading) return <Loading />
    return (
        <div className='search-page'>
            <div className='products-list'>
                {products.map(product => <Product key={product.productID} data={product} />)}
            </div>
            <button
                onClick={handleLoadMore}
                className='load-more'>Load more</button>
        </div>
    )
}

export default Search