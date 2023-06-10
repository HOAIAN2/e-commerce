class Voucher {
    voucherID: string
    voucherName: string
    voucherDiscount: number
    expiryDate: Date
    description: string
    constructor(voucherID: string, voucherName: string, voucherDiscount: number, expiryDate: string, description: string) {
        this.voucherID = voucherID
        this.voucherName = voucherName
        this.voucherDiscount = voucherDiscount
        this.expiryDate = new Date(expiryDate)
        this.description = description
    }
}

export default Voucher