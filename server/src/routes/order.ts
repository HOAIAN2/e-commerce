import { FastifyInstance, RegisterOptions, FastifySchema } from "fastify"
import {
    handleAddProduct,
    handleDeleteProduct,
    handleCreateOrder,
    handleGetOrders,
    handleGetOrderByID,
    handleMakePayment
} from "../controllers/index.js"
import { authenticateToken } from "../services/auth.js"

const getOrderByIDSchema: FastifySchema = {
    tags: ['Order'],
    headers: {
        type: 'object',
        properties: {
            'authorization': { type: 'string' }
        },
        required: ['authorization']
    },
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                orderID: { type: 'integer' },
                userID: { type: 'integer' },
                orderDate: { type: ['string', 'null'] },
                paidMethod: { type: ['string', 'null'] },
                paid: { type: 'boolean' },
                products: {
                    type: 'array',
                    items: {
                        properties: {
                            productID: { type: 'integer' },
                            productName: { type: 'string' },
                            price: { type: 'integer' },
                            quantity: { type: 'integer' },
                            discount: { type: 'number' }
                        }
                    }
                },
                total: { type: 'number' },
                voucher: {
                    type: ['object', 'null'],
                    properties: {
                        voucherID: { type: 'string' },
                        voucherName: { type: 'string' },
                        voucherDiscount: { type: 'number' },
                        expiryDate: { type: 'string' },
                        description: { type: 'string' },
                    }
                }
            }
        }
    }
}
const getOrdersSchema: FastifySchema = {
    tags: ['Order'],
    headers: {
        type: 'object',
        properties: {
            'authorization': { type: 'string' }
        },
        required: ['authorization']
    },
    querystring: {
        type: 'object',
        properties: {
            from: { type: 'integer' },
        },
    },
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    orderID: { type: 'integer' },
                    userID: { type: 'integer' },
                    orderDate: { type: ['string', 'null'] },
                    paidMethod: { type: ['string', 'null'] },
                    paid: { type: 'boolean' },
                    products: {
                        type: 'array',
                        items: {
                            properties: {
                                productID: { type: 'integer' },
                                productName: { type: 'string' },
                                price: { type: 'integer' },
                                quantity: { type: 'integer' },
                                discount: { type: 'number' }
                            }
                        }
                    },
                    total: { type: 'number' },
                    voucher: {
                        type: ['object', 'null'],
                        properties: {
                            voucherID: { type: 'string' },
                            voucherName: { type: 'string' },
                            voucherDiscount: { type: 'number' },
                            expiryDate: { type: 'string' },
                            description: { type: 'string' },
                        }
                    }
                }
            }
        }
    }
}
const createOrderSchema: FastifySchema = {
    tags: ['Order'],
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
            quantity: { type: 'integer' }
        },
        required: ['productID', 'quantity'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                orderID: { type: 'integer' },
                userID: { type: 'integer' },
                orderDate: { type: ['string', 'null'] },
                paidMethod: { type: ['string', 'null'] },
                paid: { type: 'boolean' },
                products: {
                    type: 'array',
                    items: {
                        properties: {
                            productID: { type: 'integer' },
                            productName: { type: 'string' },
                            price: { type: 'integer' },
                            quantity: { type: 'integer' },
                            discount: { type: 'number' }
                        }
                    }
                },
                total: { type: 'number' },
                voucher: {
                    type: ['object', 'null'],
                    properties: {
                        voucherID: { type: 'string' },
                        voucherName: { type: 'string' },
                        voucherDiscount: { type: 'number' },
                        expiryDate: { type: 'string' },
                        description: { type: 'string' },
                    }
                }
            }
        }
    }
}
const addProductSchema: FastifySchema = {
    tags: ['Order'],
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
            orderID: { type: 'integer' },
            productID: { type: 'integer' },
            quantity: { type: 'integer' }
        },
        required: ['orderID', 'productID', 'quantity'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                orderID: { type: 'integer' },
                userID: { type: 'integer' },
                orderDate: { type: ['string', 'null'] },
                paidMethod: { type: ['string', 'null'] },
                paid: { type: 'boolean' },
                products: {
                    type: 'array',
                    items: {
                        properties: {
                            productID: { type: 'integer' },
                            productName: { type: 'string' },
                            price: { type: 'integer' },
                            quantity: { type: 'integer' },
                            discount: { type: 'number' }
                        }
                    }
                },
                total: { type: 'number' },
                voucher: {
                    type: ['object', 'null'],
                    properties: {
                        voucherID: { type: 'string' },
                        voucherName: { type: 'string' },
                        voucherDiscount: { type: 'number' },
                        expiryDate: { type: 'string' },
                        description: { type: 'string' },
                    }
                }
            }
        }
    }
}
const deleteProductSchema: FastifySchema = {
    tags: ['Order'],
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
            orderID: { type: 'integer' },
            productIDs: {
                type: 'array',
                items: {
                    type: 'integer'
                }
            }
        }
    },
    response: {
        200: {
            type: 'object',
            properties: {
                orderID: { type: 'integer' },
                userID: { type: 'integer' },
                orderDate: { type: ['string', 'null'] },
                paidMethod: { type: ['string', 'null'] },
                paid: { type: 'boolean' },
                products: {
                    type: 'array',
                    items: {
                        properties: {
                            productID: { type: 'integer' },
                            productName: { type: 'string' },
                            price: { type: 'integer' },
                            quantity: { type: 'integer' },
                            discount: { type: 'number' }
                        }
                    }
                },
                total: { type: 'number' },
                voucher: {
                    type: ['object', 'null'],
                    properties: {
                        voucherID: { type: 'string' },
                        voucherName: { type: 'string' },
                        voucherDiscount: { type: 'number' },
                        expiryDate: { type: 'string' },
                        description: { type: 'string' },
                    }
                }
            }
        }
    }
}
const makePaymentSchema: FastifySchema = {
    tags: ['Order'],
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
            orderID: { type: 'integer' },
            paidMethodID: { type: 'integer' },
        },
        required: ['orderID', 'paidMethodID'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                orderID: { type: 'integer' },
                userID: { type: 'integer' },
                orderDate: { type: ['string', 'null'] },
                paidMethod: { type: ['string', 'null'] },
                paid: { type: 'boolean' },
                products: {
                    type: 'array',
                    items: {
                        properties: {
                            productID: { type: 'integer' },
                            productName: { type: 'string' },
                            price: { type: 'integer' },
                            quantity: { type: 'integer' },
                            discount: { type: 'number' }
                        }
                    }
                },
                total: { type: 'number' },
                voucher: {
                    type: ['object', 'null'],
                    properties: {
                        voucherID: { type: 'string' },
                        voucherName: { type: 'string' },
                        voucherDiscount: { type: 'number' },
                        expiryDate: { type: 'string' },
                        description: { type: 'string' },
                    }
                }
            }
        }
    }
}
async function orderRoutes(app: FastifyInstance, options: RegisterOptions) {
    app.get('/:id', {
        preHandler: [authenticateToken],
        handler: handleGetOrderByID,
        schema: getOrderByIDSchema
    })
    app.get('/', {
        preHandler: [authenticateToken],
        handler: handleGetOrders,
        schema: getOrdersSchema
    })
    app.post('/create', {
        preHandler: [authenticateToken],
        handler: handleCreateOrder,
        schema: createOrderSchema
    })
    app.post('/product', {
        handler: handleAddProduct,
        schema: addProductSchema
    })
    app.delete('/product', {
        preHandler: [authenticateToken],
        handler: handleDeleteProduct,
        schema: deleteProductSchema
    })
    app.post('/pay', {
        handler: handleMakePayment,
        schema: makePaymentSchema
    })
}

export default orderRoutes