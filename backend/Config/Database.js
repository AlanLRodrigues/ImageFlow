const Sequelize = require('sequelize')

const sequelize = new Sequelize('gallery', 'root', 'alan',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize

// Importante: CREATE DATABASE gallery; comando para criar o nosso database.
// Importante: 'sesi' é a senha do MYSQL no notebook do SESI