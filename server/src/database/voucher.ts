import { Cache } from "js-simple-cache"
import { Voucher } from "../models/index.js"
import { RowDataPacket } from "mysql2/promise"
import database from "./database.js"

const vouchersCache = new Cache('voucherID', 1000)
interface DBVoucher {
    "voucher_id": string
    "voucher_name": string
    "voucher_discount": number
    "expiry_date": string
    "description": string
}

async function initializeVoucher() {
    console.log('\x1b[1m%s\x1b[0m', 'Initializing vouchers data...')
    try {
        const queryString = [
            'SELECT voucher_id, voucher_name, voucher_discount, expiry_date, description FROM vouchers'
        ].join(' ')
        const [rows] = await database.query(queryString) as RowDataPacket[]
        rows.forEach((row: DBVoucher) => {
            const voucherID = row['voucher_id']
            const voucherName = row['voucher_name']
            const voucherDiscount = row['voucher_discount']
            const expiryDate = row['expiry_date']
            const description = row['description']
            const voucher = new Voucher(voucherID, voucherName, voucherDiscount, expiryDate, description)
            vouchersCache.set(voucher)
        })
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', `Fail to initialize vouchers data: ${error.message}`)
        throw new Error(`Line16 user.js: Fail to initialize vouchers data: ${error.message}`)
    }
}

export {
    initializeVoucher,
    vouchersCache
}