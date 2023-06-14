import Product from "./product.js"
import crypto from "crypto"

class SearchSession {
    query: string
    data: Product[]
    constructor(query: string, data: Product[]) {
        this.query = query
        this.data = data
    }
}

export default SearchSession