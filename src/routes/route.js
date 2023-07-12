import express from 'express'
import { createUser, getProfile, logIn, updateProfile } from '../controllers/userController.js'
import { auth, auth_2 } from '../middleware/authentication.js'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/productController.js'
import { createCart, deleteCart, getCart, updateCart } from '../controllers/cartController.js'
import { createOrder, updateOrder } from '../controllers/orderController.js'

const router = express.Router()

router.get('/test', (req, res) => {
    res.send({ status: true, message: "Testing" })
})


// USER ROUTES
router.post('/register', createUser)
router.post('/login', logIn)
router.get('/user/:userId/profile', auth, getProfile)
router.put('/user/:userId/profile', auth, updateProfile)

// PRODUCT ROUTES
router.post('/products', createProduct)
router.get('/products', getProducts)
router.get('/products/:productId', getProduct)
router.put('/products/:productId', updateProduct)
router.delete('/products/:productId', deleteProduct)

// CART ROUTES
router.post('/users/:userId/cart', auth_2, createCart)
router.put('/users/:userId/cart', auth_2, updateCart)
router.get('/users/:userId/cart', auth_2, getCart)
router.delete('/users/:userId/cart', auth_2, deleteCart)

// ORDER ROUTES
router.post('/users/:userId/orders', auth, createOrder)
router.put('/users/:userId/orders', auth, updateOrder)

export default router