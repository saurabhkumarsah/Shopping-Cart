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
            street: {
                type: String,
                require: true,
            },
            city: {
                type: String,
                require: true,
            },
            pincode: {
                type: number,
                require: true,
            },
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
                type: number,
                require: true,
            },
        }
    },
    {
        timestamps: true
    }
)
export default model(USER, userSchema)

// {
//     fname: { string, mandatory },
//     lname: { string, mandatory },
//     email: { string, mandatory, valid email, unique },
//     profileImage: { string, mandatory }, // s3 link
//     phone: { string, mandatory, unique, valid Indian mobile number },
//     password: { string, mandatory, minLen 8, maxLen 15 }, // encrypted password
//     address: {
//         shipping: {
//             street: { string, mandatory },
//             city: { string, mandatory },
//             pincode: { number, mandatory }
//         },
//         billing: {
//             street: { string, mandatory },
//             city: { string, mandatory },
//             pincode: { number, mandatory }
//         }
//     },
//     createdAt: { timestamp },
//     updatedAt: { timestamp }
// }