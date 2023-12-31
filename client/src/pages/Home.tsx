import { useEffect, useState } from 'react'
import { reqGetProductsHome, ProductList } from '../utils/product'
import Product from '../components/Product'
import { baseIMG } from '../utils/api-config'
import './Home.scss'

function Home() {
    const [products, setProducts] = useState([] as ProductList)
    useEffect(() => {
        window.scrollTo(0, 0)
        reqGetProductsHome()
            .then(data => {
                setProducts(data)
            })
        document.title = 'Online shoping'
    }, [])
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