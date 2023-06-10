import { RowDataPacket } from "mysql2/promise"
import database from "./database.js"
import { Category } from "../models/index.js"
import { Cache } from "js-simple-cache"

const categoriesCache = new Cache('categoryID', 1000)
interface DBCategory {
    "category_id": number
    "category_name": string
    "description": string
    "icon": string
}
async function initializeCategory() {
    console.log('\x1b[1m%s\x1b[0m', 'Initializing categories data...')
    try {
        const queryString = [
            'SELECT category_id, category_name, description, icon',
            'FROM categories'
        ].join(' ')
        const [rows] = await database.query(queryString) as RowDataPacket[]
        rows.forEach((row: DBCategory) => {
            const categoryID = row['category_id']
            const categoryName = row['category_name']
            const description = row['description']
            const icon = row['icon']
            const category = new Category(categoryID, categoryName, description, icon)
            categoriesCache.set(category)
        })
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', `Fail to initialize category data: ${error.message}`)
        throw new Error(`Fail to initialize category data: ${error.message}`)
    }
}

export {
    initializeCategory,
    categoriesCache
}