import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key']
        const { SECRET_KEY } = process.env

        if (!token) return res.status(401).send({ status: false, message: "Token is missing" })

        const decoded = jwt.verify(token, SECRET_KEY)
        req.headers.id = decoded.id
        // if (decoded.id != userId) return res.status(403).send({ status: false, message: "User has not permissioned" })

        return next()

    } catch (error) {
        if (error.message == "invalid token") return res.status(401).send({ status: false, message: "Invalid token" })
        if (error.message == "jwt expired") return res.status(401).send({ status: false, message: "Expired token" })
        return res.status(500).send({ status: false, message: error.message })
    }
}

export const auth_2 = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')
        const { SECRET_KEY } = process.env

        if (!token) return res.status(401).send({ status: false, message: "Token is missing" })

        const decoded = jwt.verify(token[1], SECRET_KEY)
        req.headers.id = decoded.id
        // if (decoded.id != userId) return res.status(403).send({ status: false, message: "User has not permissioned" })

        return next()

    } catch (error) {
        if (error.message == "invalid token") return res.status(401).send({ status: false, message: "Invalid token" })
        if (error.message == "jwt expired") return res.status(401).send({ status: false, message: "Expired token" })
        return res.status(500).send({ status: false, message: error.message })
    }
}