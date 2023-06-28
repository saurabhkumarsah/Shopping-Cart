import express from 'express'
const router = express.Router()

router.get('/test', (req, res) => {
    res.send({ status: true, message: "Work" })
})
export default router