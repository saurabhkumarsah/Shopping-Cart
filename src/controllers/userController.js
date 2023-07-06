import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js"
import { uploadFile } from "../aws/aws.js"
import { isValidEmail, isValidField, isValidPass, isValidPhone } from "../util/validator/validator.js"

export const createUser = async (req, res) => {
    try {
        const { fname, lname, email, phone, password, address } = req.body

        // Add URL in profileImage
        const files = req.files
        if (files && files.length > 0) {
            req.body.profileImage = await uploadFile(files[0])
        }
        else {
            return res.status(400).send({ status: false, msg: "Profile Image not found" })
        }


        if (!req.body) {
            return res.status(400).send({ status: false, message: "Missing" })
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


export const logIn = async (req, res) => {
    try {
        const { SECRET_KEY } = process.env
        const { email, password } = req.body

        if (!email) {
            return res.status(400).send({ status: false, message: "Email Id is missing" })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Email Id is missing" })
        }

        const saveData = await userModel.findOne({ email: email })
        console.log(saveData);
        if (!saveData) {
            return res.status(401).send({ status: false, message: "Credentials are not matched" })
        }
 
        bcrypt.compare(password, saveData.password, (err, result) => {
            console.log(result)
            if (result === false) {
                return res.status(401).send({ status: false, message: "Credentials are not matched" })
            }
        })

        const userId = saveData._id
        jwt.sign({ id: userId.toString() }, SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
            console.log("sign");
            return res.status(200).send({ status: true, message: "User login successfull", data: { userId, token } })
        })


    } catch (error) {
        console.log("catch");
        return res.status(500).send({ status: false, message: error.message })
    }
}