class Supplier {
    supplierID: number
    supplierName: string
    address: string
    email: string
    phoneNumber: string
    constructor(supplierID: number, supplierName: string, address: string, email: string, phoneNumber: string) {
        this.supplierID = supplierID
        this.supplierName = supplierName
        this.address = address
        this.phoneNumber = phoneNumber
        this.email = email
    }
}

export default Supplier