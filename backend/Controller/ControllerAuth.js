const jwt = require('jsonwebtoken')

const jwt_key = 'alanlimagatinho123'

exports.UserAuth = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({message:'Acesso não autorizado!'})
    }

    try {
        const uncript = jwt.verify(token, jwt_key)
    } catch (err) {
        res.status(401).json(err)
    }
}