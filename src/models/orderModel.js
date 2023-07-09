import mongoose from "mongoose";
const { Schema, model } = mongoose

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            require: true,
            unique: true
        },
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                require: true
            },
            quantity: {
                type: Number,
                require: true,
                min: 1
            }
        }],
        totalPrice: {
            type: Number,
            require: true   //number, mandatory, comment: "Holds total price of all the items in the cart" 
        },
        totalItems: {
            type: Number,
            require: true   //number, mandatory, comment: "Holds total number of items in the cart"
        },
        totalQuantity: {   //number, mandatory, comment: "Holds total number of quantity in the cart"
            type: Number,
            require: true
        },
        cancellable: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending"
        },
        deletedAt: {
            type: Date
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)
export default model("Order", orderSchema)