import cartModel from "../models/cartModel.js"
import productModel from "../models/productModel.js"
import { isValidObjId, isValidTypeNumber } from "../util/validator/validator.js"

// CREATE CART
export const createCart = async (req, res) => {
    try {

        const userId = req.params.userId
        if (!isValidObjId(userId)) return res.status(400).send({ status: false, message: "Invalid User ID" })
        if (req.headers.id != userId) return res.status(403).send({ status: false, message: "User has not allowed" })

        if (!req.body) return res.status(400).send({ status: false, message: "Missing Data" })
        const { items } = req.body
        if (items.length === 0) return res.status(400).send({ status: false, message: "Missing Items" })

        // ITERATE ITEMS OF REQUEST OF BODY
        let totalPrice = 0, totalItems = 0;
        for (let i = 0; i < items.length; i++) {
            if (!(items[i].hasOwnProperty('productId') && items[i].hasOwnProperty('quantity'))) {
                return res.status(400).send({ status: false, message: "Missing Product and Quantity" })
            }

            let productId = items[i].productId
            let quant = items[i].quantity

            if (!isValidObjId(productId)) return res.status(400).send({ status: false, message: "Invalid Product ID" })
            let proData = await productModel.findOne({ _id: productId, isDeleted: false })

            if (!isValidTypeNumber(quant)) return res.status(400).send({ status: false, message: "Invalid Quantity Data Type" })
            if (!proData) return res.status(400).send({ status: false, message: "Product is not exist" })
            if (quant < 1) return res.status(400).send({ status: false, message: "Quantity must be greater than one(1)." })

            totalPrice += proData.price * quant;
            totalItems += quant;
        }
        // ASSIGNING VALUE OF TOTAL ITEMS AND PRICES
        req.body.userId = userId
        req.body.totalItems = totalItems
        req.body.totalPrice = totalPrice

        // CHECKING CART IS PRESENT OR NOT
        const isPresentCart = await cartModel.findOne({ userId: userId })
        if (isPresentCart) {
            // UPDATE CART AND ADD ON ITEMS

            let items = isPresentCart.items
            for (let i = 0; i < items.length; i++) {
                let proData = await productModel.findOne({ _id: items[i].productId })

                req.body.totalItems += items[i].quantity
                req.body.totalPrice += proData.price * items[i].quantity
            }

            const updateReq = {
                $push: { items: { $each: req.body.items } },
                totalItems: req.body.totalItems,
                totalPrice: req.body.totalPrice
            }

            const saveData = await cartModel.findOneAndUpdate({ userId: userId }, updateReq, { new: true })
            return res.status(201).send({ status: true, message: "Success", data: saveData })

        } else {
            // CREATE CART
            const saveData = await cartModel.create(req.body)
            return res.status(201).send({ status: true, message: "Success", data: saveData })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// UPDATE CART DETAILS
export const updateCart = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!isValidObjId(userId)) return res.status(400).send({ status: false, message: "Invalid User ID" })
        if (req.headers.id != userId) return res.status(403).send({ status: false, message: "User has not allowed" })

        if (!req.body) return res.status(400).send({ status: false, message: "Missing Data" })
        const { cartId, productId, removeProduct } = req.body
        if (!isValidObjId(cartId)) return res.status(400).send({ status: false, message: "Invalid User ID" })
        if (!isValidObjId(productId)) return res.status(400).send({ status: false, message: "Invalid User ID" })

        let productData = await productModel.findOne({ _id: productId, isDeleted: false })
        let cartData = await cartModel.findOne({ _id: cartId })

        if (!productData) return res.status(400).send({ status: false, message: "Product is not exist" })
        if (!cartData) return res.status(400).send({ status: false, message: "Cart is not exist" })

        let quant = 0
        for (let i = 0; i < cartData.items.length; i++) {
            if (cartData.items[i].productId == productId) {
                quant = cartData.items[i].quantity;
                break;
            }
        }


        let price = productData.price * quant
        if (removeProduct === 0) {
            const data = await cartModel.findOneAndUpdate({ userId: userId }, { $pull: { items: productId }, $inc: { totalPrice: -price, totalItems: -quant } }, { new: true })
            return res.send({ status: true, message: "Success", data: data })
        } else if (removeProduct === 1) {
            if (quant === 1) {
                const data = await cartModel.findOneAndUpdate({ userId: userId }, { $pull: { items: productId }, $inc: { totalPrice: -price, totalItems: -quant } }, { new: true })
                return res.send({ status: true, message: "Success", data: data })
            } else {
                const data = await cartModel.findOneAndUpdate({ userId: userId }, { $pull: { items: productId }, $push: { productId: productId, quantity: qunat - 1 }, $inc: { totalPrice: -productData.price, totalItems: -1 } }, { new: true })
                return res.send({ status: true, message: "Success", data: data })
            }
        } else {
            return res.status(400).send({ status: false, message: "Invalid value of remove Product" })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// FETCH CART DETAILS
export const getCart = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!isValidObjId(userId)) return res.status(400).send({ status: false, message: "Invalid User ID" })
        if (req.headers.id != userId) return res.status(403).send({ status: false, message: "User has not allowed" })

        const isPresentCart = await cartModel.findOne({ userId: userId }).populate(productId)
        if (!isPresentCart) return res.status(400).send({ status: false, message: "Cart is not exist of the user" })

        return res.status(200).send({ status: true, message: "Success", data: isPresentCart })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// DELETE CART ITEMS
export const deleteCart = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!isValidObjId(userId)) return res.status(400).send({ status: false, message: "Invalid User ID" })
        if (req.headers.id != userId) return res.status(403).send({ status: false, message: "User has not allowed" })

        const isPresentCart = await cartModel.findOneAndUpdate({ userId: userId }, { itmes: [0], totalItems: 0, totalPrice: 0 }, { new: true })
        if (!isPresentCart) return res.status(400).send({ status: false, message: "Cart is not exist of the user" })

        return res.status(200).send({ status: true, message: "Success", data: isPresentCart })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





/**
 * Check Authentication and Authorization (Using bearer token) *
 * If cart is exist of the user then update cart of the user
 * If cart is not exist then create new cart of the user
 * Check item lenght must be greater than zero
 * Check each element of item must have product and quantity
 * Check product and quantity of each element of item is valid or not (productid is valid, product is exist and quantity must be greather than zero)
 * There should have totalPrice and totalItems
 */