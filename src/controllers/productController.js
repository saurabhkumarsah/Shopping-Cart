import { uploadFile } from "../aws/aws.js"
import productModel from "../models/productModel.js"
import { isValidField, isValidSize } from "../util/validator/validator.js"

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        delete req.body.deletedAt
        if (!req.body) {
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

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// Products API(No authentication required)
// POST / products
// Create a product document from request body.
// Upload product image to S3 bucket and save image public url in document.
// Response format
// On success - Return HTTP status 201. Also return the product document.The response should be a JSON object like this
// On error - Return a suitable error message with a valid HTTP status code.The response should be a JSON object like this

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

// GET / products /: productId
// Returns product details by product id
// Response format
// On success - Return HTTP status 200. Also return the product documents.The response should be a JSON object like this
// On error - Return a suitable error message with a valid HTTP status code.The response should be a JSON object like this

// PUT / products /: productId
// Updates a product by changing at least one or all fields
// Check if the productId exists(must have isDeleted false and is present in collection).If it doesn't, return an HTTP status 404 with a response body like this
// Response format
// On success - Return HTTP status 200. Also return the updated product document.The response should be a JSON object like this
// On error - Return a suitable error message with a valid HTTP status code.The response should be a JSON object like this

// DELETE / products /: productId
// Deletes a product by product id if it's not already deleted
// Response format
// On success - Return HTTP status 200. The response should be a JSON object like this