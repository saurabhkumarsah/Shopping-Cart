import express from 'express'
import { createUser } from '../controllers/userController.js'

const router = express.Router()

router.get('/test', (req, res) => {
    res.send({ status: true, message: "Testing" })
})


// USER ROUTES
router.post('/users', createUser)

export default router