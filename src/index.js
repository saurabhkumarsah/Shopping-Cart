import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import multer from 'multer'
import router from './routes/route.js'
dotenv.config()

const app = express()
const { MONGO_URI, PORT } = process.env

app.use(express.json())
app.use(multer().any())

app.use('/', router)

app.listen(PORT, () => {
    console.log("server start on PORT on: ", PORT)
})

mongoose.connect(MONGO_URI)
    .then(() => console.log("DB is connected..."))
    .catch((err) => console.log(err))