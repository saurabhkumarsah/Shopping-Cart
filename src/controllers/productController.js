import moment from 'moment'
import { uploadFile } from "../aws/aws.js"
import productModel from "../models/productModel.js"
import { isValidField, isValidObjId, isValidSize } from "../util/validator/validator.js"

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        delete req.body.deletedAt
        if (Object.keys(req.body).length < 1) {
            return res.status(400).send({ status: false, message: "Data missing" })
        }
        // Add URL in profileImage
        const files = req.files
        if (files && files.length > 0) {
            req.body.productImage = await uploadFile(files[0])
        }
        else {
            return res.status(400).send({ status: false, msg: "Product Image is missing" })
        }

        const { title, description, price, currencyId, currencyFormat, availableSizes } = req.body

        if (!isValidField(title && description && price && currencyId && currencyFormat && availableSizes)) {
            return res.status(400).send({ status: false, message: "Required fields are Missing" })
        }

        const isUniquetitle = await productModel.findOne({ title: title })

        if (isUniquetitle) {
            return res.status(400).send({ status: false, message: "Title is already exist" })
        }

        if (!isValidSize(availableSizes)) {
            return res.status(400).send({ status: false, message: "Size's units are not valid" })
        }

        const data = await productModel.create(req.body)
        return res.status(201).send({ status: true, message: "Success", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// GET PRODUCTS USING FILTERS
export const getProducts = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// GET PRODUCT BY PRODUCT ID
export const getProduct = async (req, res) => {
    try {

        const productId = req.params.productId
        if (!isValidObjId(productId)) return res.status(404).send({ status: false, message: "Invalid Product ID" })
        const data = await productModel.findOne({ _id: productId })
        if (!data) return res.status(404).send({ status: false, message: "Not found" })
        return res.status(200).send({ status: true, message: "Success", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const { title, availableSizes } = req.body
        const productId = req.params.productId
        if (!isValidObjId(productId)) return res.status(400).send({ status: false, message: "Invalid Product ID" })

        if (Object.keys(req.body).length < 1) return res.status(400).send({ status: false, message: "Missing Data" })

        const files = req.files
        if (files && files.length > 0) {
            if (files && files.length > 0) {
                req.body.productImage = await uploadFile(files[0])
            }
        }
        if (title) {
            const isUniquetitle = await productModel.findOne({ title: title })
            if (isUniquetitle) {
                return res.status(400).send({ status: false, message: "Title is already exist" })
            }
        }
        if (availableSizes) {
            if (!isValidSize(availableSizes)) {
                return res.status(400).send({ status: false, message: "Size's units are not valid" })
            }
        }

        const data = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, req.body, { new: true })

        if (!data) return res.status(404).send({ status: false, message: "Product not found" })
        return res.status(200).send({ status: true, message: "Success", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId
        if (!isValidObjId(productId)) return res.status(400).send({ status: false, message: "Invalid Product ID" })

        const data = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { isDeleted: true, deletedAt: moment().format() }, { new: true })

        if (!data) return res.status(404).send({ status: false, message: "Product not found" })
        return res.status(200).send({ status: true, message: "Success", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// GET / products
// Returns all products in the collection that arent deleted.
// Filters
// Size(The key for this filter will be 'size')
// Product name(The key for this filter will be 'name'). You should return all the products with name containing the substring recieved in this filter
// Price: greater than or less than a specific value.The keys are 'priceGreaterThan' and 'priceLessThan'.
//     NOTE: For price filter request could contain both or any one of the keys.For example the query in the request could look like { priceGreaterThan: 500, priceLessThan: 2000 } or just { priceLessThan: 1000 } )

// Sort
// Sorted by product price in ascending or descending.The key value pair will look like { priceSort: 1 } or { priceSort: -1 } eg / products ? size = XL & name=Nit % 20grit
// Response format
// On success - Return HTTP status 200. Also return the product documents.The response should be a JSON object like this
// On error - Return a suitable error message with a valid HTTP status code.The response should be a JSON object like this