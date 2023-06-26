import { Order, Voucher, Product } from "../models/index.js"
import { Cache } from "js-simple-cache"
import database from "./database.js"
import { vouchersCache } from "./voucher.js"
import { productsCache } from "./product.js"
import { RowDataPacket } from "mysql2/promise"
import { dbSelectProductByID } from "./product.js"

// const orders = []
const ordersCache = new Cache('orderID', 1000)
const userOrders = new Cache('key', 1000)
interface DBOrder {
    "order_id": number
    "user_id": number
    "order_date": string
    "paid_method": string
    "voucher_id": string
    "paid": boolean
    "details": DBOrderDetail[]
}
interface DBOrderDetail {
    "product_id": number
    "product_name": string
    "quantity": number
    "price": number
    "discount": number
}
async function initializeOrder() {
    console.log('\x1b[1m%s\x1b[0m', 'Initializing orders data...')
    try {
        const queryString = [
            "SELECT orders.order_id, user_id, order_date, payment_methods.name AS paid_method, paid, voucher_id,",
            "JSON_ARRAYAGG(JSON_OBJECT('product_id',order_details.product_id,'quantity',",
            "order_details.quantity,'price', order_details.price, 'discount', order_details.discount,'product_name', product_name)) AS details",
            "FROM order_details JOIN products ON order_details.product_id = products.product_id",
            "JOIN orders ON orders.order_id = order_details.order_id",
            "LEFT JOIN payment_methods ON orders.paid_method_id = payment_methods.method_id",
            "GROUP BY orders.order_id",
            "ORDER BY orders.order_id DESC",
            "LIMIT 1000"
        ].join(' ')
        const [rows] = await database.query(queryString) as RowDataPacket[]
        rows.forEach((item: DBOrder) => {
            const orderID = item['order_id']
            const userID = item['user_id']
            const orderDate = item['order_date']
            const paidMethod = item['paid_method']
            const voucherID = item['voucher_id']
            const paid = item['paid']
            const order = new Order(orderID, userID, orderDate, paidMethod, paid)
            if (voucherID) order.setVoucher(vouchersCache.get(voucherID) as Voucher)
            item.details.forEach(product => {
                const productID = product['product_id']
                const productName = product['product_name']
                const quantity = product['quantity']
                const price = product['price']
                const discount = product['discount']
                order.addProduct(productID, productName, quantity, price, discount)
            })
            if (paid) order.paidOrder(paidMethod, orderDate)
            ordersCache.set(order)
        })
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', `Fail to initialize orders data: ${error.message}`)
        throw new Error(`Fail to initialize orders data: ${error.message}`)
    }
}
async function dbSelectOrderFromUser(userID: number, from?: number) {
    let changeAbleString = 'HAVING (user_id = ? AND orders.order_id < ?)'
    if (!from) changeAbleString = 'HAVING (user_id = ?)'
    const result: Order[] = []
    try {
        const queryString = [
            "SELECT orders.order_id, user_id, order_date, payment_methods.name AS paid_method, paid, voucher_id,",
            "JSON_ARRAYAGG(JSON_OBJECT('product_id',order_details.product_id,'quantity',",
            "order_details.quantity,'price', order_details.price, 'discount', order_details.discount,'product_name', product_name)) AS details",
            "FROM order_details JOIN products ON order_details.product_id = products.product_id",
            "RIGHT JOIN orders ON orders.order_id = order_details.order_id",
            "LEFT JOIN payment_methods ON orders.paid_method_id = payment_methods.method_id",
            "GROUP BY orders.order_id",
            changeAbleString,
            "ORDER BY orders.order_id DESC",
            "LIMIT 10"
        ].join(' ')
        const [rows] = await database.query(queryString, [userID, from]) as RowDataPacket[]
        rows.forEach((item: DBOrder) => {
            const orderID = item['order_id']
            const userID = item['user_id']
            const orderDate = item['order_date']
            const paidMethod = item['paid_method']
            const voucherID = item['voucher_id']
            const paid = item['paid']
            const order = new Order(orderID, userID, orderDate, paidMethod, paid)
            if (voucherID) order.setVoucher(vouchersCache.get(voucherID) as Voucher)
            item.details.forEach(product => {
                if (!product.product_id) return
                const productID = product['product_id']
                const productName = product['product_name']
                const quantity = product['quantity']
                const price = product['price']
                const discount = product['discount']
                order.addProduct(productID, productName, quantity, price, discount)
            })
            if (paid) order.paidOrder(paidMethod, orderDate)
            result.push(order)
        })
        return result
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbCheckUserBought(userID: number, productID: number) {
    if (ordersCache.findKey((order: Order) => {
        return (order.has(productID) && order.userID === userID && order.paid === true)
    })) return { bought: true }
    try {
        const queryString = [
            "SELECT orders.order_id , paid, order_details.product_id",
            "FROM orders JOIN order_details ON orders.order_id = order_details.order_id",
            "WHERE ((orders.user_id = ?) AND (order_details.product_id = ?) AND (paid = 1))",
            "LIMIT 1"
        ].join(' ')
        const [rows] = await database.query(queryString, [userID, productID]) as RowDataPacket[]
        if (rows.length !== 0) return { bought: true }
        return { bought: false }
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbSelectOrderByID(orderID: number) {
    if (ordersCache.has(orderID)) return ordersCache.get(orderID) as Order
    try {
        const queryString = [
            "SELECT orders.order_id, user_id, order_date, payment_methods.name AS paid_method, paid, voucher_id,",
            "JSON_ARRAYAGG(JSON_OBJECT('product_id',order_details.product_id,'quantity',",
            "order_details.quantity,'price', order_details.price, 'discount', order_details.discount,'product_name', product_name)) AS details",
            "FROM order_details JOIN products ON order_details.product_id = products.product_id",
            "RIGHT JOIN orders ON orders.order_id = order_details.order_id",
            "LEFT JOIN payment_methods ON orders.paid_method_id = payment_methods.method_id",
            "GROUP BY orders.order_id",
            'HAVING orders.order_id = ?'
        ].join(' ')
        const [rows] = await database.query(queryString, [orderID]) as RowDataPacket[]
        const data = rows[0] as DBOrder
        if (!data) return null
        const orderID1 = data['order_id']
        const userID = data['user_id']
        const orderDate = data['order_date']
        const paidMethod = data['paid_method']
        const voucherID = data['voucher_id']
        const paid = data['paid']
        const order = new Order(orderID1, userID, orderDate, paidMethod, paid)
        data.details.forEach((row: DBOrderDetail) => {
            if (!row.product_id) return
            const productID = row['product_id']
            const productName = row['product_name']
            const quantity = row['quantity']
            const price = row['price']
            const discount = row['discount']
            order.addProduct(productID, productName, quantity, price, discount)
        })
        if (voucherID) order.setVoucher(vouchersCache.get(voucherID) as Voucher)
        if (order.paid) order.paidOrder(paidMethod, orderDate)
        ordersCache.set(order)
        return order
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbIsLatestOrderPaid(userID: number) {
    try {
        const queryString = [
            "SELECT order_id, user_id, paid",
            "FROM orders",
            "WHERE user_id = ?",
            "ORDER BY order_id DESC",
            "LIMIT 1"
        ].join(' ')
        const [rows] = await database.query(queryString, [userID]) as RowDataPacket[]
        const data = rows[0] as DBOrder
        if (!data) return true
        if (data.paid) return true
        return false
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbAddVoucher(orderID: number, voucherID: string) {
    try {
        const queryString = [
            'UPDATE orders',
            'SET voucher_id = ?',
            'WHERE order_id = ?'
        ].join(' ')
        await database.query(queryString, [voucherID, orderID])
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbMakePayment(orderID: number, paymentMethodID: number) {
    try {
        let order = await dbSelectOrderByID(orderID)
        if (!order) throw new Error('Cannot find order')
        if (order.paid) throw new Error('This order was paid')
        if (order.products.length === 0) throw new Error('This order have no product')
        const queryString = [
            'UPDATE orders',
            'SET paid = 1, paid_method_id = ?, order_date = NOW()',
            'WHERE order_id = ?'
        ].join(' ')
        await database.query(queryString, [paymentMethodID, orderID])
        order.products.forEach(product => {
            const delta = product.quantity * -1
            const tempProduct = productsCache.get(product.productID) as Product
            if (tempProduct) {
                tempProduct.updateUnitInOrder(delta)
                tempProduct.updateQuantity(delta)
                tempProduct.updateSoldQuantity(product.quantity)
            }
        })
        ordersCache.remove(orderID)
        order = await dbSelectOrderByID(orderID)
        if (order !== null) ordersCache.set(order)
        return order
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}

async function dbInsertOrder(userID: number, productID: number, quantity: number) {
    try {
        const product = await dbSelectProductByID(productID)
        if (!product) throw new Error(`No product with id: ${productID}`)
        const isLatestOrderPaid = await dbIsLatestOrderPaid(userID)
        if (!isLatestOrderPaid) throw new Error('You must pay order')
        const queryString = [
            'INSERT INTO orders(user_id) VALUES(?)'
        ].join(' ')
        const [result] = await database.query(queryString, [userID]) as RowDataPacket[]
        const newOrder = await dbInsertOrderDetail(result.insertId, productID, quantity)
        return newOrder
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbInsertOrderDetail(orderID: number, productID: number, quantity: number) {
    const queryString = [
        'INSERT INTO order_details(order_id, product_id, quantity)',
        'VALUE(?, ?, ?)'
    ].join(' ')
    try {
        const product = await dbSelectProductByID(productID)
        if (!product) throw new Error(`No product with id: ${productID}`)
        await database.query(queryString, [orderID, productID, quantity])
        const order = await dbSelectOrderByID(orderID)
        if (!order) throw new Error(`No order with id: ${orderID}`)
        // Only God know why this work
        if (order.has(productID) === false) order.addProduct(product.productID, product.productName, quantity, product.price, product.discount)
        product.updateUnitInOrder(quantity)
        // products.products.sort((x, y) => y.unitInOrder - x.unitInOrder)
        return order
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbUpdateOrderDetail(orderID: number, productID: number, quantity: number) {
    const queryString = [
        'UPDATE order_details',
        'SET quantity = ?',
        'WHERE order_id = ? AND product_id = ?'
    ].join(' ')
    try {
        const product = await dbSelectProductByID(productID)
        if (!product) throw new Error(`No product with id: ${productID}`)
        await database.query(queryString, [quantity, orderID, productID])
        const order = await dbSelectOrderByID(orderID)
        if (!order) throw new Error(`No order with id: ${orderID}`)
        const productInOrder = order.products.find(product => product.productID === productID)
        if (!productInOrder) throw new Error(`No product with id: ${productID} in order`)
        const delta = quantity - productInOrder.quantity
        product.updateUnitInOrder(delta)
        // products.products.sort((x, y) => y.unitInOrder - x.unitInOrder)
        order.products.find(product => product.productID === productID)?.setQuantity(quantity)
        return order
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}
async function dbDeleteOrderDetail(orderID: number, productIDs: number[]) {
    const queryString = [
        'DELETE FROM order_details',
        'WHERE order_id = ? AND product_id IN (?)'
    ].join(' ')
    try {
        await database.query(queryString, [orderID, productIDs])
        const order = await dbSelectOrderByID(orderID)
        if (!order) throw new Error(`No order with id: ${orderID}`)
        productIDs.forEach(id => {
            const productInOrder = order.products.find(item => item.productID === id)
            if (!productInOrder) return
            const delta = productInOrder.quantity * -1
            order.removeProduct(id)
            const product = productsCache.get(id) as Product
            if (product) product.updateUnitInOrder(delta)
        })
        // products.products.sort((x, y) => y.unitInOrder - x.unitInOrder)
        return order
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(error.message)
    }
}

export {
    initializeOrder,
    dbInsertOrder,
    dbInsertOrderDetail,
    dbUpdateOrderDetail,
    dbDeleteOrderDetail,
    dbAddVoucher,
    dbMakePayment,
    dbSelectOrderByID,
    dbSelectOrderFromUser,
    dbCheckUserBought,
    ordersCache,
    userOrders
}