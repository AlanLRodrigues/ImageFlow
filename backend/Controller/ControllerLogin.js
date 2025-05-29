const { where } = require("sequelize")
const User = require("../Model/User")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
        }

        const AuthLogin = await User.findOne({
            where: { email }
        });

        if (!AuthLogin){
            return res.status(409).json({message:'E-mail não encontrado, cadastre-se ou tente novamente!'});
        }

        const AuthPassword = await bcrypt.compare(password, AuthLogin.password);

        if (!AuthPassword) {
            return res.status(401).json({message:'Senha incorreta!'});
        }

        const token = jwt.sign(
            { id: AuthLogin.id_user, name: AuthLogin.name_user, email: AuthLogin.email },
            process.env.JWT_KEY,
            { expiresIn: '6h' }
        );
        // AQUI: envia o token via cookie
        res.cookie('token', token, {
            httpOnly: false,
            secure: false,         // coloque true se usar HTTPS
            sameSite: 'Lax',       // compatível com credentials: 'include'
            maxAge: 24 * 60 * 60 * 1000
        }).status(201).json({ message: 'Login feito com sucesso!'});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Erro ao fazer login, tente novamente!' });
    }
};
