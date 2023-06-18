import request, { getTokenHeader, getToken } from './api-config'

export type ProductList = ProductItem[]

export interface ProductItem {
    productID: number
    productName: string
    supplierName: string
    category: string
    price: number
    quantity: number
    soldQuantity: number
    images: string[]
    discount: number
    ratingCount: number
    description: string
    rating: number
}

async function reqGetProductsHome() {
    try {
        const res = await request.get('/product/home')
        return res.data as ProductList
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}

export {
    reqGetProductsHome
}