import { useEffect, useState } from 'react'
import { reqGetProductsHome, ProductList } from '../utils/product'
import Product from '../components/Product'
import './Home.scss'

function Home() {
    const [products, setProducts] = useState([] as ProductList)
    useEffect(() => {
        reqGetProductsHome()
            .then(data => {
                setProducts(data)
            })
    }, [])
    return (
        <div className='home-container'>
            <div className='banner'></div>
            <div className='products-list'>
                {products.map(product => <Product key={product.productID} data={product} />)}
            </div>
        </div>
    )
}

export default Home