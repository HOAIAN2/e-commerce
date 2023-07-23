import { FastifyInstance, RegisterOptions, FastifySchema } from "fastify"
import {
    handleGetProductByID,
    handleSearchProduct,
    handleSuggestProductByID,
    handleAddProductRate,
    handleSuggest,
    handleAutoComplete
} from "../controllers/index.js"
import { authenticateToken } from "../services/auth.js"
import { errorReply } from "../services/index.js"

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
            id: { type: 'integer', minimum: 1 }
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
                bought: { type: 'boolean' },
                userRate: { type: 'integer' }
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
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
        required: ['productID', 'rating'],
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
                bought: { type: 'boolean' },
                userRate: { type: 'integer' }
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}
const searchProductSchema: FastifySchema = {
    tags: ['Product'],
    querystring: {
        type: 'object',
        properties: {
            query: { type: 'string' },
            from: { type: 'integer', minimum: 1 }
        },
        required: ['query'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
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
                            ratingCount: { type: 'integer' },
                            // commentCount: { type: 'integer' },
                        }
                    }
                },
                hasNext: { type: 'boolean' }
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}
const suggestProductSchema: FastifySchema = {
    tags: ['Product'],
    querystring: {
        type: 'object',
        properties: {
            id: { type: 'integer', minimum: 1 },
            count: { type: 'integer', minimum: 1 }
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
                    ratingCount: { type: 'integer' },
                    // commentCount: { type: 'integer' },
                }
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}
const suggestProductHomeSchema: FastifySchema = {
    tags: ['Product'],
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
                    ratingCount: { type: 'integer' },
                    // commentCount: { type: 'integer' },
                }
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}
const autoCompleteSchema: FastifySchema = {
    tags: ['Product'],
    querystring: {
        type: 'object',
        properties: {
            query: { type: 'string' }
        },
        required: ['query'],
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
                    // quantity: { type: 'integer' },
                    // soldQuantity: { type: 'integer' },
                    // unitInOrder: { type: 'integer' },
                    images: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    discount: { type: 'number' },
                    // description: { type: 'string' },
                    // rating: { type: 'number' },
                    // ratingCount: { type: 'integer' },
                    // commentCount: { type: 'integer' },
                }
            }
        },
        '4xx': errorReply,
        '5xx': errorReply
    }
}
async function productRoutes(app: FastifyInstance, options: RegisterOptions) {
    app.get('/', {
        config: {
            rateLimit: {
                max: 100,
                timeWindow: '1 minute'
            }
        },
        handler: handleGetProductByID,
        schema: getProductSchema
    })
    app.post('/rate', {
        config: {
            rateLimit: {
                max: 100,
                timeWindow: '1 minute'
            }
        },
        preHandler: [authenticateToken],
        handler: handleAddProductRate,
        schema: postProductRateSchema
    })
    app.get('/search', {
        config: {
            rateLimit: {
                max: 100,
                timeWindow: '1 minute'
            }
        },
        handler: handleSearchProduct,
        schema: searchProductSchema
    })
    app.get('/suggest', {
        config: {
            rateLimit: {
                max: 100,
                timeWindow: '1 minute'
            }
        },
        handler: handleSuggestProductByID,
        schema: suggestProductSchema
    })
    app.get('/home', {
        config: {
            rateLimit: {
                max: 100,
                timeWindow: '1 minute'
            }
        },
        handler: handleSuggest,
        schema: suggestProductHomeSchema
    })
    app.get('/auto-complete', {
        config: {
            rateLimit: {
                max: 100,
                timeWindow: '1 minute'
            }
        },
        handler: handleAutoComplete,
        schema: autoCompleteSchema
    })
}

export default productRoutes