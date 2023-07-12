import orderModel from "../models/orderModel.js"
import { isValidObjId, isValidStatus } from "../util/validator/validator.js"

export const createOrder = async (req, res) => {
    try {

        const userId = req.params.userId
        if (!isValidObjId(userId)) return res.status(400).send({ status: false, message: "Invalid User ID" })
        if (req.headers.id != userId) return res.status(403).send({ status: false, message: "User has not allowed" })

        if (!req.body) return res.status(400).send({ status: false, message: "Missing Data" })
        req.body.userId = userId
        const { status } = req.body
        const orderData = await orderModel.findOne({ userId: userId })

        if (orderData) return res.status(400).send({ status: false, message: "Order is already exits" })

        let quantReq = 0;
        for (let i = 0; i < req.body.items.length; i++) {
            let quant = req.body.items[i].quantity
            quantReq += quant;
        }
        req.body.totalQuantity = quantReq

        // if (!totalQuantity) return res.status(400).send({ status: false, message: "Missing Total Quantity" })
        if (!isValidStatus(status)) return res.status(400).send({ status: false, message: "Invalid Status" })


        const data = await orderModel.create(req.body)
        return res.status(201).send({ status: true, message: "Success", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

export const updateOrder = async (req, res) => {
    try {

        const userId = req.params.userId
        if (!isValidObjId(userId)) return res.status(400).send({ status: false, message: "Invalid User ID" })
        if (req.headers.id != userId) return res.status(403).send({ status: false, message: "User has not allowed" })

        if (!req.body) return res.status(400).send({ status: false, message: "Missing Data" })

        const { orderId, status } = req.body
        if (!isValidStatus(status)) return res.status(400).send({ status: false, message: "Invalid Status" })
        if (!isValidObjId(orderId)) return res.status(400).send({ status: false, message: "Invalid Order ID" })
        const orderData = await orderModel.findOne({ userId: userId })
        if (!orderData) return res.status(400).send({ status: false, message: "Order is not exist of the User" })

        if (status === "cancelled") {
            const data = await orderModel.findOneAndUpdate({ userId: userId, cancellable: true, isDeleted: false }, { status: status }, { new: true })
            if (!data) return res.status(400).send({ status: false, message: "This order is not cancellable" })
            return res.status(200).send({ status: true, message: "Success", data: data })
        }

        const data = await orderModel.findOneAndUpdate({ userId: userId, isDeleted: false }, { status: status }, { new: true })
        return res.status(200).send({ status: true, message: "Success", data: data })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}