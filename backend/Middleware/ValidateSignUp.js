    const {check, validationResult} = require('express-validator')

    const ValidateSignUp = [
        check('email')
            .isEmail()
            .withMessage('E-mail inválido...'),

        check('password')
            .isLength({min: 5})
            .withMessage('A senha deve ter no mínimo 5 caracteres'),

        (req, res, next) => {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
            }

            next()
        }
    ]

    module.exports = ValidateSignUp