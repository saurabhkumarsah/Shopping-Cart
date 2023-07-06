import mongoose from "mongoose";
const { Schema, model } = mongoose

const userSchema = new Schema(
    {
        fname: {
            type: String,
            require: true
        },
        lname: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        profileImage: {
            type: String,
            require: true
        },
        phone: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String
        },
        address: {
            shipping: {
                street: {
                    type: String,
                    require: true,
                },
                city: {
                    type: String,
                    require: true,
                },
                pincode: {
                    type: Number,
                    require: true,
                }
            },
            billing: {
                street: {
                    type: String,
                    require: true,
                },
                city: {
                    type: String,
                    require: true,
                },
                pincode: {
                    type: Number,
                    require: true,
                },
            }
        }
    },
    {
        timestamps: true
    }
)
export default model("User", userSchema)