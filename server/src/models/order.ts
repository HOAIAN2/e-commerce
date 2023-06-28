import Voucher from "./voucher.js"

class Order {
    orderID: number
    userID: number
    orderDate: Date | null
    paidMethod: string | null
    paid: boolean
    products: Detail[]
    total: number
    voucher: Voucher | null
    constructor(orderID: number, userID: number, orderDate: string | null, paidMethod: string, paid: boolean) {
        this.orderID = orderID
        this.userID = userID
        orderDate ? this.orderDate = new Date(orderDate) : this.orderDate = null
        this.paidMethod = paidMethod
        this.paid = paid || false
        this.products = []
        this.total = 0
        this.voucher = null
    }
    addProduct(productID: number, productName: string, quantity: number, price: number, discount: number | null) {
        this.products.push(new Detail(productID, productName, quantity, price, discount))
    }
    removeProduct(productID: number) {
        const index = this.products.findIndex(product => {
            return product.productID === productID
        })
        this.products.splice(index, 1)
    }
    setVoucher(voucher: Voucher) {
        this.voucher = voucher
    }
    has(productID: number) {
        return Boolean(this.products.some(product => product.productID === productID))
    }
    paidOrder(paidMethod: string, orderDate: string) {
        this.paidMethod = paidMethod
        this.total = this.products.reduce((sum, product) => {
            return sum + product.total()
        }, 0)
        if (this.voucher) {
            this.total = this.total * (1 - this.voucher.voucherDiscount)
        }
        this.orderDate = new Date(orderDate)
        this.paid = true
    }
}

class Detail {
    productID: number
    productName: string
    quantity: number
    price: number
    discount: number | null
    constructor(productID: number, productName: string, quantity: number, price: number, discount: number | null) {
        this.productID = productID
        this.productName = productName
        this.quantity = quantity
        this.price = price
        this.discount = discount
    }
    setQuantity(quantity: number) {
        this.quantity = quantity
    }
    total() {
        if (!this.price) return 0
        if (!this.discount) return (this.price * this.quantity)
        return (1 - this.discount) * (this.price * this.quantity)
    }
}

export default Order