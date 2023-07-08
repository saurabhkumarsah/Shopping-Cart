import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js"
import { uploadFile } from "../aws/aws.js"
import { isValidEmail, isValidField, isValidObjId, isValidPass, isValidPhone } from "../util/validator/validator.js"

// REGISTER USER
export const createUser = async (req, res) => {
    try {

        if (!req.body) {
            return res.status(400).send({ status: false, message: "Missing" })
        }
        const { fname, lname, email, phone, password, address } = req.body

        // Add URL in profileImage
        const files = req.files
        if (files && files.length > 0) {
            req.body.profileImage = await uploadFile(files[0])
        }
        else {
            return res.status(400).send({ status: false, msg: "Profile Image not found" })
        }

        if (!isValidField(fname && lname && email && phone && password && address.shipping.street && address.shipping.city && address.shipping.pincode && address.billing.street && address.billing.city && address.billing.pincode)) {
            return res.status(400).send({ status: false, message: "Required fields are Missing" })
        }

        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "Invalid Mobile Number" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid Email Id" })
        }

        if (!isValidPass(password)) {
            return res.status(400).send({ status: false, message: "Invalid Password" })
        }

        // Encrypt Password Using "bcrypt"
        bcrypt.hash(password, 10, (err, hash) => {
            req.body.password = hash
        })

        const isUniqueEmail = await userModel.findOne({ email: email })
        const isUniquePhone = await userModel.findOne({ phone: phone })

        if (isUniqueEmail) {
            return res.status(400).send({ status: false, message: "Email Id is already exist" })
        }

        if (isUniquePhone) {
            return res.status(400).send({ status: false, message: "Phone Number is already exist" })
        }

        const saveData = await userModel.create(req.body)
        return res.status(201).send({ status: true, message: "User created successfully", data: saveData })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

// LOGING
export const logIn = async (req, res) => {
    try {
        const { SECRET_KEY } = process.env
        const { email, password } = req.body

        if (!email) {
            return res.status(400).send({ status: false, message: "Email Id is missing" })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Password is missing" })
        }

        const saveData = await userModel.findOne({ email: email })

        if (!saveData) {
            return res.status(401).send({ status: false, message: "Credentials are not matched" })
        }

        bcrypt.compare(password, saveData.password, (err, result) => {

            if (!result) {
                return res.status(401).send({ status: false, message: "Credentials are not matched" })
            } else {
                const userId = saveData._id
                const token = jwt.sign({ id: userId.toString() }, SECRET_KEY, { expiresIn: '1h' })

                return res.status(200).send({ status: true, message: "User login successfull", data: { userId, token } })
            }
        })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// GET USER PROFILE
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!isValidObjId(userId)) return res.status(400).send({ status: false, message: "Invalid Product ID" })
        const data = await userModel.findById(userId)

        // if (req.headers.id != userId) return res.status(401).send({ status: false, message: "User Id did not match" })

        return res.status(200).send({ status: true, message: "User profile details", data: data })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!isValidObjId(productId)) return res.status(400).send({ status: false, message: "Invalid Product ID" })
        if (req.headers.id != userId) return res.status(403).send({ status: false, message: "User has not allowed" })

        const { email, phone, password } = req.body

        if (req.files && req.files.length > 0) {
            // Add URL in profileImage
            const files = req.files
            if (files && files.length > 0) {
                req.body.profileImage = await uploadFile(files[0])
            }
            else {
                return res.status(400).send({ status: false, msg: "Profile Image not found" })
            }
        }

        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).send({ status: false, message: "Invalid Email Id" })
            }

            const isUniqueEmail = await userModel.findOne({ email: email })

            if (isUniqueEmail) {
                return res.status(400).send({ status: false, message: "Email Id is already exist" })
            }
        }
        if (password) {
            if (!isValidPass(password)) {
                return res.status(400).send({ status: false, message: "Invalid Password" })
            }
        }
        if (phone) {
            if (!isValidPhone(phone)) {
                return res.status(400).send({ status: false, message: "Invalid Mobile Number" })
            }
            const isUniquePhone = await userModel.findOne({ phone: phone })
            if (isUniquePhone) {
                return res.status(400).send({ status: false, message: "Phone Number is already exist" })
            }

        }
        const updatedData = await userModel.findOneAndUpdate({ _id: userId }, req.body, { new: true })

        return res.status(200).send({ status: true, message: "User profile updated", data: updatedData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}