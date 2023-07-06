import express from 'express'
import { createUser, logIn } from '../controllers/userController.js'

const router = express.Router()

router.get('/test', (req, res) => {
    res.send({ status: true, message: "Testing" })
})


// USER ROUTES
router.post('/register', createUser)
router.post('/login', logIn)

export default router