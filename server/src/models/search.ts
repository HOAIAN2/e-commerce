import Product from "./product.js"
import crypto from "crypto"

class SearchSession {
    sessionID: string
    data: Product[]
    constructor(data: Product[]) {
        this.sessionID = crypto.randomUUID()
        this.data = data
    }
}

export default SearchSession