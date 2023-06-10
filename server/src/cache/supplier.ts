import { Supplier } from "../models/index.js"
import database from "./database.js"
import { Cache } from "js-simple-cache"
import { RowDataPacket } from "mysql2/promise"

const suppliersCache = new Cache('supplierID', 1000)
interface DBSupplier {
    "supplier_id": number
    "supplier_name": string
    "address": string
    "email": string
    "phone_number": string
}
async function initializeSupplier() {
    console.log('\x1b[1m%s\x1b[0m', 'Initializing supplires data...')
    try {
        const queryString = [
            'SELECT supplier_id, supplier_name, address, email, phone_number',
            'FROM suppliers'
        ].join(' ')
        const [rows] = await database.query(queryString) as RowDataPacket[]
        rows.forEach((row: DBSupplier) => {
            const supplierID = row['supplier_id']
            const supplierName = row['supplier_name']
            const address = row['address']
            const email = row['email']
            const phoneNumber = row['phone_number']
            const supplier = new Supplier(supplierID, supplierName, address, email, phoneNumber)
            suppliersCache.set(supplier)
        })
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', `Fail to initialize suppliers data: ${error.message}`)
        throw new Error(`Fail to initialize suppliers data: ${error.message}`)
    }
}

export {
    initializeSupplier,
    suppliersCache
}