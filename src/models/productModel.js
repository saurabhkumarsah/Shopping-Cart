import mongoose from "mongoose";
const { Schema, model } = mongoose

const productSchema = new Schema(
    {
        title: {
            type: String,
            require: true,
            unique: true
        },
        description: {
            type: String,
            require: true
        },
        price: {            //valid number/decimal 
            type: Number,
            require: true
        },
        currencyId: {       //INR
            type: String,
            require: true
        },
        currencyFormat: {   //Rupee symbol (₹)
            type: String,
            require: true
        },
        isFreeShipping: {
            type: Boolean,
            default: false
        },
        productImage: {
            type: String,
            require: true
        },
        style: {
            type: String
        },
        availableSizes: {   //array of string, at least one size, enum["S", "XS", "M", "X", "L", "XXL", "XL"]
            type: [String],
            require: true,
            enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
        },
        installments: {
            type: Number
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)
export default model("Product", productSchema)