import { FastifyInstance, RegisterOptions, FastifySchema } from "fastify"
import {
    handleGetProductByID,
    handleSearchProduct,
    handleSuggestProductByID,
    handleAddProductRate
} from "../controllers/index.js"
import { authenticateToken } from "../services/auth.js"

const getProductSchema: FastifySchema = {
    tags: ['Product'],
    headers: {
        type: 'object',
        properties: {
            'authorization': { type: 'string' }
        },
        // required: ['authorization']
    },
    querystring: {
        type: 'object',
        properties: {
            id: { type: 'integer' }
        },
        required: ['id'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                productID: { type: 'integer' },
                productName: { type: 'string' },
                supplierID: { type: 'integer' },
                supplierName: { type: 'string' },
                category: { type: 'string' },
                price: { type: 'integer' },
                quantity: { type: 'integer' },
                soldQuantity: { type: 'integer' },
                // unitInOrder: { type: 'integer' },
                images: {
                    type: 'array',
                    items: { type: 'string' }
                },
                discount: { type: 'number' },
                description: { type: 'string' },
                rating: { type: 'number' },
                ratingCount: { type: 'integer' },
                commentCount: { type: 'integer' },
                userRate: { type: 'integer' }
            }
        }
    }
}
const postProductRateSchema: FastifySchema = {
    tags: ['Product'],
    headers: {
        type: 'object',
        properties: {
            'authorization': { type: 'string' }
        },
        required: ['authorization']
    },
    body: {
        type: 'object',
        properties: {
            productID: { type: 'integer' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
        },
        required: ['orderID', 'paidMethodID'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                productID: { type: 'integer' },
                productName: { type: 'string' },
                supplierID: { type: 'integer' },
                supplierName: { type: 'string' },
                category: { type: 'string' },
                price: { type: 'integer' },
                quantity: { type: 'integer' },
                soldQuantity: { type: 'integer' },
                // unitInOrder: { type: 'integer' },
                images: {
                    type: 'array',
                    items: { type: 'string' }
                },
                discount: { type: 'number' },
                description: { type: 'string' },
                rating: { type: 'number' },
                ratingCount: { type: 'integer' },
                commentCount: { type: 'integer' },
                userRate: { type: 'integer' }
            }
        }
    }
}
const searchProductSchema: FastifySchema = {
    tags: ['Product'],
    querystring: {
        type: 'object',
        properties: {
            query: { type: 'string' },
            sessionID: { type: 'string' },
            from: { type: 'integer' }
        },
        required: ['query'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                sessionID: { type: 'string' },
                data: {
                    type: 'array',
                    items: {
                        properties: {
                            productID: { type: 'integer' },
                            productName: { type: 'string' },
                            // supplierID: { type: 'integer' },
                            supplierName: { type: 'string' },
                            category: { type: 'string' },
                            price: { type: 'integer' },
                            quantity: { type: 'integer' },
                            soldQuantity: { type: 'integer' },
                            // unitInOrder: { type: 'integer' },
                            images: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            discount: { type: 'number' },
                            // description: { type: 'string' },
                            rating: { type: 'number' },
                            // ratingCount: { type: 'integer' },
                            // commentCount: { type: 'integer' },
                        }
                    }
                }
            }
        }
    }
}
const suggestProductSchema: FastifySchema = {
    tags: ['Product'],
    querystring: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
            count: { type: 'integer' }
        },
        required: ['id', 'count'],
    },
    response: {
        200: {
            type: 'array',
            items: {
                properties: {
                    productID: { type: 'integer' },
                    productName: { type: 'string' },
                    // supplierID: { type: 'integer' },
                    supplierName: { type: 'string' },
                    category: { type: 'string' },
                    price: { type: 'integer' },
                    quantity: { type: 'integer' },
                    soldQuantity: { type: 'integer' },
                    // unitInOrder: { type: 'integer' },
                    images: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    discount: { type: 'number' },
                    description: { type: 'string' },
                    rating: { type: 'number' },
                    // ratingCount: { type: 'integer' },
                    // commentCount: { type: 'integer' },
                }
            }
        }
    }
}
async function productRoutes(app: FastifyInstance, options: RegisterOptions) {
    app.get('/:id', {
        handler: handleGetProductByID,
        schema: getProductSchema
    })
    app.post('/rate', {
        preHandler: [authenticateToken],
        handler: handleAddProductRate,
        schema: postProductRateSchema
    })
    app.get('/search', {
        handler: handleSearchProduct,
        schema: searchProductSchema
    })
    app.get('/suggest', {
        handler: handleSuggestProductByID,
        schema: suggestProductSchema
    })
}

export default productRoutes