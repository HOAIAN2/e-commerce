import { useParams } from 'react-router-dom'
import { reqGetProduct, ProductFull } from '../utils/product'
import { useEffect, useState } from 'react'

function ProductPage() {
    const [data, setData] = useState<ProductFull | null>(null)
    const { id } = useParams()
    useEffect(() => {
        reqGetProduct(Number(id))
            .then(data => {
                document.title = data.productName
                setData(data)
            })
    }, [id])
    data && console.log(data)
    return (
        <div className='footer'></div>
    )
}

export default ProductPage