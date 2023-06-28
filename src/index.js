import express from 'express'
import router from './routes/route.js'
const app = express()
app.use('/', router)
app.use(express.json({ extended: true }))
app.listen(3000, () => {
    console.log("server start on PORT on: ", 3000)
})