class User {
    static #checkSex(sex = 'M') {
        if (sex.toLowerCase() === 'm') return 'male'
        else return 'female'
    }
    userID: number
    role: string
    username: string
    firstName: string
    lastName: string
    birthDate: Date
    sex: string
    address: string
    email: string
    phoneNumber: string
    avatar: string
    orderCount: number
    hashedPassword: string
    constructor(userID: number, role: string, username: string, firstName: string, lastName: string,
        birthDate: string, sex: string, address: string, email: string,
        phoneNumber: string, avatar: string, orderCount: number, hashedPassword: string) {
        this.userID = userID
        this.role = role
        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.birthDate = new Date(birthDate)
        this.sex = User.#checkSex(sex)
        this.address = address
        this.email = email
        this.phoneNumber = phoneNumber
        this.avatar = avatar
        this.orderCount = orderCount
        this.hashedPassword = hashedPassword
    }
    setUsername(username: string) {
        this.username = username
    }
    setFirstName(firstName: string) {
        this.firstName = firstName
    }
    setLastName(lastName: string) {
        this.lastName = lastName
    }
    setBirthDate(birthDate: string) {
        this.birthDate = new Date(birthDate)
    }
    setSex(sex: string) {
        this.sex = User.#checkSex(sex)
    }
    setAddress(address: string) {
        this.address = address
    }
    setEmail(email: string) {
        this.email = email
    }
    setPhoneNumber(phoneNumber: string) {
        this.phoneNumber = phoneNumber
    }
    setPassword(hashedPassword: string) {
        this.hashedPassword = hashedPassword
    }
    setAvatar(avatar: string) {
        this.avatar = avatar
    }
    setOrderCount() {
        this.orderCount += 1
    }
}

export default User