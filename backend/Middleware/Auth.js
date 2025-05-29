const jwt = require('jsonwebtoken')

const Authenticate = (req, res, next) => {
    const token = req.cookies.token
    
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email
        }
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' })
    }
}

module.exports = Authenticate