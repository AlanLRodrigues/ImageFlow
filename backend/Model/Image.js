const sequelize = require('../Config/Database')
const User = require('./User')
const { DataTypes } = require('sequelize')

const Image = sequelize.define('image',{
    id_img: {type: DataTypes.INTEGER, autoIncrement:true, primaryKey:true},
    name_img: {type: DataTypes.STRING, allowNull:false},
},{
    freezeTableName: true,  // Isso garante que o Sequelize não pluralize o nome da tabela
    tableName: 'image',
    timestamps: false       // Remove as colunas createdAt e updatedAt
})

User.hasMany(Image, { foreignKey: 'user_id' });
Image.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Image