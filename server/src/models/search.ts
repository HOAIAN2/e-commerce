import Product from "./product.js"

class SearchSession {
    query: string
    data: Product[]
    constructor(query: string, data: Product[]) {
        this.query = query
        this.data = data
    }
}

export default SearchSession