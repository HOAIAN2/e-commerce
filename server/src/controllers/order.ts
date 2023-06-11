import { FastifyRequest, FastifyReply } from "fastify"
import {
    dbSelectOrderByID,
    dbInsertOrder,
    dbInsertOrderDetail,
    dbUpdateOrderDetail,
    dbDeleteOrderDetail,
    dbMakePayment,
    dbSelectUserByUsername,
    dbSelectOrderFromUser,
    dbCheckUserBought
} from "../cache/index.js"
import { generateErrorMessage } from "../services/index.js"
import { readTokenFromRequest } from "../services/auth.js"

interface GetOrderByID {
    id: number
}
interface GetOrders {
    from: number
}
interface CreateOrder {
    productID: number
    quantity: number
}
interface AddProduct {
    orderID: number
    productID: number
    quantity: number
}
interface DeleteProduct {
    orderID: number
    productIDs: number[]
}
interface MakePayment {
    orderID: number
    paidMethodID: number
}
async function handleGetOrderByID(request: FastifyRequest, reply: FastifyReply) {
    const token = readTokenFromRequest(request)
    if (!token) return reply.status(401).send()
    const { id } = request.params as GetOrderByID
    try {
        let order = await dbSelectOrderByID(id)
        if (!order) return reply.status(404).send()
        if (token.id !== order.userID) return reply.status(401).send()
        return reply.send(order)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleGetOrders(request: FastifyRequest, reply: FastifyReply) {
    const token = readTokenFromRequest(request)
    if (!token) return reply.status(401).send()
    const { from } = request.query as GetOrders
    try {
        const user = await dbSelectUserByUsername(token.username)
        if (!user) return reply.status(404).send()
        const orders = await dbSelectOrderFromUser(user.userID, from)
        return reply.send(orders)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleCreateOrder(request: FastifyRequest, reply: FastifyReply) {
    const token = readTokenFromRequest(request)
    if (!token) return reply.status(401).send()
    const { productID, quantity } = request.body as CreateOrder
    try {
        const order = await dbInsertOrder(token.id, productID, quantity)
        const user = await dbSelectUserByUsername(token.username)
        user?.setOrderCount()
        return reply.send(order)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleAddProduct(request: FastifyRequest, reply: FastifyReply) {
    const token = readTokenFromRequest(request)
    if (!token) return reply.status(401).send()
    const { orderID, productID, quantity } = request.body as AddProduct
    try {
        let order = await dbSelectOrderByID(orderID)
        if (!order) return reply.status(400).send()
        if (token.id !== order.userID) return reply.status(401).send()
        if (order.has(productID)) order = await dbUpdateOrderDetail(orderID, productID, quantity)
        else order = await dbInsertOrderDetail(orderID, productID, quantity)
        return reply.send(order)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleDeleteProduct(request: FastifyRequest, reply: FastifyReply) {
    const token = readTokenFromRequest(request)
    if (!token) return reply.status(401).send()
    const { orderID, productIDs } = request.body as DeleteProduct
    try {
        let order = await dbSelectOrderByID(orderID)
        if (!order) return reply.status(400).send()
        if (token.id !== order.userID) return reply.status(401).send()
        order = await dbDeleteOrderDetail(orderID, productIDs)
        return reply.send(order)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleMakePayment(request: FastifyRequest, reply: FastifyReply) {
    const token = readTokenFromRequest(request)
    if (!token) return reply.status(401).send()
    const { orderID, paidMethodID } = request.body as MakePayment
    try {
        let order = await dbSelectOrderByID(orderID)
        if (!order) return reply.status(400).send()
        if (token.id !== order.userID) return reply.status(401).send()
        order = await dbMakePayment(orderID, paidMethodID)
        return reply.send(order)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
async function handleCheckUserBought(request: FastifyRequest, reply: FastifyReply) {
    const token = readTokenFromRequest(request)
    if (!token) return reply.status(401).send()
    const { id } = request.params as GetOrderByID
    try {
        const result = await dbCheckUserBought(token.id, id)
        return reply.send(result)
    } catch (error) {
        return reply.status(500).send(generateErrorMessage("Server error"))
    }
}
export {
    handleGetOrderByID,
    handleGetOrders,
    handleCreateOrder,
    handleAddProduct,
    handleDeleteProduct,
    handleMakePayment,
    handleCheckUserBought
}