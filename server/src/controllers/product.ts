import { FastifyRequest, FastifyReply } from "fastify"
import {
    dbSelectProductByID,
    dbSelectProduct,
    searchCache,
    productsCache,
    dbSelectRating,
    dbInsertRating,
    dbUpdateRating
} from "../cache/index.js"
import { generateErrorMessage } from "../services/index.js"
import { SearchSession, Product } from "../models/index.js"
import { readTokenFromRequest, verifyAccessToken, TokenData } from "../services/auth.js"

interface GetProductByIDParam {
    id: number
}
interface SuggestProductByIDParam {
    id: number
    count: number
}
interface SearchProductParams {
    query: string
    sessionID: string
    from: number
}
interface RateProductBody {
    productID: number
    rating: number
}
async function handleGetProductByID(request: FastifyRequest, reply: FastifyReply) {
    const authorizationHeader = request.headers.authorization
    const token = authorizationHeader?.split(' ')[1]
    const { id } = request.query as GetProductByIDParam
    let tokenData: TokenData | null = null
    try {
        if (token) {
            tokenData = await verifyAccessToken(token)
        }
    } catch (error) { }
    try {
        const product = await dbSelectProductByID(id)
        if (!product) return reply.status(404).send()
        if (tokenData) {
            const rate = await dbSelectRating(tokenData.id, product.productID)
            return reply.send({ ...product, userRate: rate?.rate })
        }
        return reply.send(product)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleAddProductRate(request: FastifyRequest, reply: FastifyReply) {
    const token = readTokenFromRequest(request)
    if (!token) return reply.status(401).send()
    const { productID, rating } = request.body as RateProductBody
    try {
        const product = await dbSelectProductByID(productID)
        if (!product) return reply.status(404).send()
        const dbRate = await dbSelectRating(token.id, product.productID)
        if (dbRate) dbUpdateRating(token.id, product.productID, rating)
        else dbInsertRating(token.id, product.productID, rating)
        return reply.send({ ...product, userRate: rating })
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleSearchProduct(request: FastifyRequest, reply: FastifyReply) {
    let result: SearchSession | undefined
    const { query, sessionID, from } = request.query as SearchProductParams
    console.log(request.query)
    try {
        if (sessionID) {
            if (searchCache.has(sessionID)) result = searchCache.get(sessionID) as SearchSession
            const finalResult = structuredClone(result)
            if (!finalResult) return reply.status(400).send()
            if (from) {
                const index = finalResult?.data.findIndex(item => item.productID === from)
                if (index !== -1) {
                    finalResult.data = finalResult.data.slice((index + 1), (index + 61))
                    return reply.send(finalResult)
                }
            }
            else {
                finalResult.data = finalResult.data.slice(0, 60)
                return reply.send(finalResult)
            }
        }
        else {
            const searchResult = await dbSelectProduct(query)
            result = new SearchSession(searchResult)
            searchCache.set(result, (60 * 10 * 1000))
            const finalResult = structuredClone(result)
            finalResult.data = finalResult.data.slice(0, 60)
            return reply.send(finalResult)
        }
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleSuggestProductByID(request: FastifyRequest, reply: FastifyReply) {
    const { id, count } = request.query as SuggestProductByIDParam
    try {
        const product = await dbSelectProductByID(id)
        if (!product) return reply.status(404).send()
        const category = product.category
        const result = productsCache.search({
            searchValue: category,
            searchFields: ['productName', 'category', 'supplierName'],
            deepScan: true
        }) as Product[]
        const set = new Set()
        while (set.size < count) {
            set.add(Math.floor(Math.random() * result.length) + 1)
        }
        const finalResult: Product[] = []
        set.forEach((key: any) => {
            finalResult.push(result[key])
        })
        return reply.send(finalResult)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleSuggest(request: FastifyRequest, reply: FastifyReply) {
    const result = productsCache.toArray() as Product[]
    return reply.send(result.slice(result.length - 60))
}
export {
    handleGetProductByID,
    handleSearchProduct,
    handleSuggestProductByID,
    handleSuggest,
    handleAddProductRate
}