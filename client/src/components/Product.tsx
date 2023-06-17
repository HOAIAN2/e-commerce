import { reqGetProductsHome, ProductItem } from '../utils/product'
function Product({ data }: { data: ProductItem }) {
    return (
        <div>
            {JSON.stringify(data)}
        </div>
    )
}

export default Product