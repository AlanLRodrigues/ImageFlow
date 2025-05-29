const sequelize = require('../Config/Database')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user',{
    id_user: {type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    name_user: {type: DataTypes.STRING, allowNull:false},
    email: {type: DataTypes.STRING, allowNull:false},
    password: {type: DataTypes.TEXT, allowNull:false}
},{
    freezeTableName: true,  // Isso garante que o Sequelize não pluralize o nome da tabela
    tableName: 'user',
    timestamps: false       // Remove as colunas createdAt e updatedAt
})

module.exports = User