import {
    initializeUser,
    usersCache,
    dbSelectUserByUsername,
    dbInsertUser,
    dbUpdateUserInfo,
    dbUpdateUserAvatar,
    dbUpdateUserPassword
} from "./user.js"

import {
    initializeProduct,
    dbSelectProductByID,
    dbSelectProduct,
    productsCache,
    searchCache
} from "./product.js"

import {
    initializeCategory,
    categoriesCache
} from "./category.js"
import {
    initializeSupplier,
    suppliersCache
} from "./supplier.js"

import {
    initializeVoucher,
    vouchersCache
} from "./voucher.js"

import {
    initializeOrder,
    dbInsertOrder,
    dbInsertOrderDetail,
    dbUpdateOrderDetail,
    dbDeleteOrderDetail,
    dbSelectOrderByID,
    dbSelectOrderFromUser,
    dbAddVoucher,
    dbMakePayment,
    ordersCache
} from "./order.js"

import {
    dbSelectRating,
    dbInsertRating,
    dbUpdateRating
} from "./rating.js"

import {
    dbQueryComments,
    dbInsertComment,
    dbDeleteComment
} from "./comment.js"

import {
    dbIsExistsSession,
    dbInsertSession,
    dbDeleteSession,
    dbDeleteAllUserSession
} from "./session.js"

async function initializeData() {
    console.log('\x1b[1m%s\x1b[0m', 'Initializing data...')
    try {
        // Promise.all only catch one error https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
        const results = await Promise.allSettled([
            initializeUser(),
            initializeProduct(),
            initializeCategory(),
            initializeSupplier(),
            initializeVoucher(),
            initializeOrder(),
        ])
        results.forEach(promise => {
            if (promise.status === 'rejected') throw new Error('Fail to initialize data')
        })
        console.log('\x1b[32m%s\x1b[0m', 'Initialized data')
    } catch (error: any) {
        console.log('\x1b[31m%s\x1b[0m', error.message)
        throw new Error(`Fail to initialize data: ${error.message}`)
    }
}
export {
    initializeData,
    dbSelectUserByUsername,
    dbInsertUser,
    dbUpdateUserInfo,
    dbUpdateUserAvatar,
    dbUpdateUserPassword,
    dbSelectProductByID,
    dbSelectProduct,
    dbInsertOrder,
    dbInsertOrderDetail,
    dbUpdateOrderDetail,
    dbDeleteOrderDetail,
    dbSelectOrderByID,
    dbSelectOrderFromUser,
    dbAddVoucher,
    dbMakePayment,
    dbSelectRating,
    dbInsertRating,
    dbUpdateRating,
    dbQueryComments,
    dbInsertComment,
    dbDeleteComment,
    dbIsExistsSession,
    dbInsertSession,
    dbDeleteSession,
    dbDeleteAllUserSession,
    usersCache,
    productsCache,
    searchCache,
    categoriesCache,
    suppliersCache,
    vouchersCache,
    ordersCache
}