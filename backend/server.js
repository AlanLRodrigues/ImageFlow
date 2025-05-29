const express = require('express')
const cookieParser = require('cookie-parser')
const env = require('dotenv').config()
const cors = require('cors')
const path = require('path')

const routes = require('./routes')
const sequelize = require('./Config/Database')

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))  

app.use(express.json())
app.use(cookieParser())
app.use(routes)

app.use('/Upload', express.static(path.join(__dirname, 'Upload')))

sequelize.sync()
    .then(() =>{
        console.log('Banco de Dados Sincronizado!')
    })
    .catch(() =>{
        console.log('Erro ao sincronizar o Banco de Dados...')
    })

app.listen(5001,() =>{
    console.log('Servidor rodando!')
})