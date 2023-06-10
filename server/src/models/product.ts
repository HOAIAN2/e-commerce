class Product {
    productID: number
    productName: string
    supplierID: number
    supplierName: string
    category: string
    price: number
    quantity: number
    soldQuantity: number
    unitInOrder: number
    images: string[]
    discount: number | null
    description: string | null
    rating: number
    ratingCount: number
    commentCount: number
    constructor(productID: number, productName: string, supplierName: string, category: string,
        price: number, quantity: number, soldQuantity: number,
        unitInOrder: number, discount: number, images: string[], description: string,
        rating: string, ratingCount: number, supplierID: number, commentCount: number) {
        this.productID = productID
        this.productName = productName
        this.supplierID = supplierID
        this.supplierName = supplierName
        this.category = category
        this.price = price
        this.quantity = quantity
        this.soldQuantity = soldQuantity
        this.unitInOrder = unitInOrder
        this.discount = discount
        this.images = images
        this.description = description
        this.rating = parseFloat(rating) || 0
        this.ratingCount = ratingCount || 0
        this.commentCount = commentCount || 0
    }
    updateUnitInOrder(delta: number) {
        this.unitInOrder += delta
    }
    updateQuantity(delta: number) {
        this.quantity += delta
    }
    updateSoldQuantity(quantity: number) {
        this.soldQuantity += quantity
    }
    updateCommentCount(increase: number) {
        this.commentCount += increase
    }
    updateRatingCount() {
        this.ratingCount += 1
    }
    updateRating(rating: number) {
        this.rating = rating
    }
}

export default Product