import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ProductList, reqGetProductsSearch } from '../utils/product'
import NotFound from './NotFound'
import Product from '../components/Product'
import { getLanguage } from '../utils/languages'
import './Search.scss'

interface Language {
    loadMore: string
}

function Search() {
    const [products, setProducts] = useState([] as ProductList)
    const [hasNext, setHasNext] = useState(true)
    const [notFound, setNotfound] = useState(false)
    const [language, setLanguage] = useState<Language>()
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
        setNotfound(false)
        reqGetProductsSearch(searchParam.get('name') as string)
            .then(data => {
                if (data.data.length === 0) return setNotfound(true)
                window.scrollTo(0, 0)
                setProducts(data.data)
                setHasNext(data.hasNext)
            })
            .catch(() => {
                navigate('/')
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam.get('name')])
    useEffect(() => {
        const language = getLanguage()
        import(`./languages/${language}Search.json`)
            .then((data: Language) => {
                setLanguage(data)
            })
    })
    if (notFound) return <NotFound />
    return (
        <div className='search-page'>
            <div className='products-list'>
                {products.map(product => <Product key={product.productID} data={product} />)}
            </div>
            {hasNext && <button
                onClick={handleLoadMore}
                className='load-more'>{language?.loadMore}</button>}
        </div>
    )
}

export default Search