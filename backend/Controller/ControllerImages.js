const { where } = require('sequelize')
const path = require('path')
const fs = require('fs')
const Image = require('../Model/Image')
const User = require('../Model/User')

// Função de mostrar as imagens no front
const ShowImg = async (req, res) => {
    try {
        const user_id = req.user.id
        const response = await Image.findAll({where:{user_id}})

        res.status(201).json(response)
    } catch (err) {
        res.status(401).json({message:"Erro ao buscar imagens!", err: err})
        console.log(err)
    }
}

// Função de deletar as imagens pelo o front
const DeleteImg = async (req, res) => {
    try {
        const imageId = req.params.id
        const userId = req.user.id

        const image = await Image.findOne({
            where: {
                id_img: imageId,
                user_id: userId
            }
        })

        if (!image) {
            return res.status(404).json({message: 'Arquivo não encontrada ou não te pertence...'})
        }

        // Caminho da imagem
        const imagePath = path.join(__dirname, '..', 'Upload', image.name_img)


        // Apaga a imagem na pasta "Upload"
        fs.unlink(imagePath, async (err) => {
            if (err) {
                console.log('Erro ao apagar o seu arquivo...', err)
                return res.status(500).json({message: 'Erro ao apagar seu arquivo...'})
            }

        // Aqui apaga a imagem no MySQL
        await image.destroy()

        res.status(200).json({message: 'Arquivo deletado com sucesso!'})

        })

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Erro no backend ao tentar deletar o arquivo...'})
    }
}


module.exports = {ShowImg, DeleteImg}