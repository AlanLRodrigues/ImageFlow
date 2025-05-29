const { where } = require("sequelize");
const User = require("../Model/User");
const bcrypt = require("bcrypt");

exports.SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;


        // Validação dos dados obrigatórios
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios!' });
        }

        // Validação de dominios
        const allowedDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com', 'sesiedupe.org.br', 'senaiedupe.org.br'];
        const emailDomain = email.split('@')[1]?.toLowerCase(); 

        if (!allowedDomains.includes(emailDomain)) {
            return res.status(400).json({ message: 'Domínio de e-mail não permitido!' });
        }

        // Verifica se o e-mail já está em uso
        const AuthLogin = await User.findOne({ where: { email } });
        if (AuthLogin) {
            return res.status(409).json({ message: 'Esse email já está em uso!' });
        }

        // Cria o usuário com a senha criptografada
        const user = await User.create({
            name_user: name,
            email: email,
            password: await bcrypt.hash(password, 5)
        });

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Erro ao cadastrar, tente novamente!' });
    }
};
