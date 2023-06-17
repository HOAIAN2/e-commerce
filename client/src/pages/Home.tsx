import { useEffect, useState } from 'react'
import { reqGetProductsHome, ProductList } from '../utils/product'
import Product from '../components/Product'
function Home() {
    const [products, setProducts] = useState([] as ProductList)
    useEffect(() => {
        reqGetProductsHome()
            .then(data => {
                setProducts(data)
            })
    }, [])
    return (
        <>
            {products.map(product => <Product key={product.productID} data={product} />)}
        </>
    )
}

export default Home