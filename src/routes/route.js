import express from 'express'
import { createUser, getProfile, logIn, updateProfile } from '../controllers/userController.js'
import { auth, auth_2 } from '../middleware/authentication.js'
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from '../controllers/productController.js'
import { createCart } from '../controllers/cartController.js'

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

export default router