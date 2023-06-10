class Category {
    categoryID: number
    categoryName: string
    description: string
    icon: string
    constructor(categoryID: number, categoryName: string, description: string, icon: string) {
        this.categoryID = categoryID
        this.categoryName = categoryName
        this.description = description
        this.icon = icon
    }
}

export default Category