import request, { getTokenHeader, getToken } from './api-config'

export type ProductList = ProductItem[]

export type ProductSearch = {
    data: ProductItem[]
    hasNext: boolean
}

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

export interface ProductFull {
    productID: number
    productName: string
    supplierID: number
    supplierName: string
    category: string
    price: number
    quantity: number
    soldQuantity: number
    images: string[]
    discount: number
    description: string
    rating: number
    ratingCount: number
    commentCount: number
}
interface Options {
    headers?: {
        Authorization: string
    },
    params: {
        id: number
    }
}
async function reqGetProductsHome() {
    try {
        const res = await request.get('/product/home')
        return res.data as ProductList
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}

async function reqGetProduct(id: number) {
    // let options: Options = {
    //     headers: {
    //         Authorization: getTokenHeader()
    //     },
    //     params: {
    //         id: id
    //     }
    // }
    // if (!getToken().accessToken) options = {
    //     params: {
    //         id: id
    //     }
    // }
    try {
        const res = await request.get('/product', {
            params: {
                id: id
            }
        })
        return res.data as ProductFull
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}

async function reqGetProductsAutoComplete(query: string) {
    try {
        const res = await request.get('/product/auto-complete', {
            params: {
                query: query
            }
        })
        return res.data as ProductList
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}

async function reqGetProductsSuggest(id: number, count: number) {
    try {
        const res = await request.get('/product/suggest', {
            params: {
                id: id,
                count: count
            }
        })
        return res.data as ProductList
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}

async function reqGetProductsSearch(query: string, from?: number) {
    try {
        const res = await request.get('/product/search', {
            params: {
                query: query,
                from: from
            }
        })
        return res.data as ProductSearch
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        throw new Error(message)
    }
}

export {
    reqGetProductsHome,
    reqGetProduct,
    reqGetProductsSuggest,
    reqGetProductsAutoComplete,
    reqGetProductsSearch
}