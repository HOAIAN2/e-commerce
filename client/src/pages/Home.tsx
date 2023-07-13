import { useEffect, useState } from 'react'
import { reqGetProductsHome, ProductList } from '../utils/product'
import Product from '../components/Product'
import { baseIMG } from '../utils/api-config'
import Loading from '../components/Loading'
import './Home.scss'

function Home() {
    const [products, setProducts] = useState([] as ProductList)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        window.scrollTo(0, 0)
        reqGetProductsHome()
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
    }, [])
    if (loading) return <Loading />
    return (
        <div className='home-container'>
            <div className='banner'>
                <img src={baseIMG + 'default/banner.jpg'} alt="" />
            </div>
            <div className='products-list'>
                {products.map(product => <Product key={product.productID} data={product} />)}
            </div>
        </div>
    )
}

export default Home