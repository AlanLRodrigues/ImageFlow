const ModelImage = require('../Model/Image')
const path = require('path')

const UploadImg = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Não houve upload do arquivo' });
        }

        const name_img = req.file.filename;

        const upload = await ModelImage.create({
            name_img,
            user_id: req.user.id
        });

        res.json(upload);

    } catch (error) {
        console.error('Erro no backend:', error);
        res.status(500).json({ error: 'Erro ao fazer o upload' });
    }
}

const ShowImg = async (req, res) => {
    try {
        const uploads = await ModelImage.findAll()
        res.json(uploads)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Erro ao buscar imagens' })
    }
}

module.exports = { UploadImg, ShowImg }