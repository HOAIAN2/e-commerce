import { FastifyRequest, FastifyReply } from "fastify"
import {
    dbSelectProductByID,
    dbSelectProduct,
    searchCache,
    productsCache,
    dbSelectRating,
    dbInsertRating,
    dbUpdateRating,
    dbCheckUserBought
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
            const bought = await dbCheckUserBought(tokenData.id, id)
            if (bought.bought === true) {
                const rate = await dbSelectRating(tokenData.id, product.productID)
                return reply.send({ ...product, bought: bought.bought, userRate: rate?.rate })
            }
            return reply.send(product)
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
        return reply.send({ ...product, bought: true, userRate: rating })
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleSearchProduct(request: FastifyRequest, reply: FastifyReply) {
    let result: SearchSession | undefined
    let hasNext = true
    const { query, from } = request.query as SearchProductParams
    try {
        if (searchCache.has(query)) {
            result = searchCache.get(query) as SearchSession
            const finalResult = structuredClone(result)
            if (!finalResult) return reply.status(400).send()
            if (from) {
                const index = finalResult?.data.findIndex(item => item.productID === from)
                if (index !== -1) {
                    finalResult.data = finalResult.data.slice((index + 1), (index + 61))
                    if (!result.data[index + 62]) hasNext = false
                    return reply.send({ data: finalResult.data, hasNext: hasNext })
                }
            }
            else {
                finalResult.data = finalResult.data.slice(0, 60)
                if (!result.data[61]) hasNext = false
                return reply.send({ data: finalResult.data, hasNext: hasNext })
            }
        }
        else {
            const searchResult = await dbSelectProduct(query)
            result = new SearchSession(query, searchResult)
            searchCache.set(result, (60 * 10 * 1000))
            const finalResult = structuredClone(result)
            finalResult.data = finalResult.data.slice(0, 60)
            if (!result.data[61]) hasNext = false
            return reply.send({ data: finalResult.data, hasNext: hasNext })
        }
    } catch (error) {
        console.log(error)
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
        result.splice(result.findIndex(product => product.productID === id), 1)
        const set = new Set()
        while (set.size < count) {
            set.add(Math.floor(Math.random() * (result.length - 1)))
        }
        const finalResult: Product[] = []
        set.forEach((key: any) => {
            if (result[key]) finalResult.push(result[key])
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
async function handleAutoComplete(request: FastifyRequest, reply: FastifyReply) {
    const { query } = request.query as SearchProductParams
    const result = productsCache.search({
        searchValue: query,
        searchFields: ['productName', 'category', 'supplierName'],
        deepScan: true,
        nocase: true
    }) as Product[]
    return reply.send(result.slice(result.length - 5))
}
export {
    handleGetProductByID,
    handleSearchProduct,
    handleSuggestProductByID,
    handleSuggest,
    handleAddProductRate,
    handleAutoComplete
}