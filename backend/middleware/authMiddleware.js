import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({ message: 'not authorized, no token' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = { id: decoded.id }

        next()
    } catch (error) {
        return res.status(401).json({ message: 'not authorized, token failed' })
    }
}

export default verifyToken