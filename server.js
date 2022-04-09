//Dependences
const express = require('express');
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const MasterUser = require("./models/MasterUser")

require('dotenv').config();
const server = express()

server.use(express.json())
//Rota pública da API
server.get("/", (req, res) => {
    res.json({hello: "Bem-vindo à api de gerenciamento de administradores"})
})
//Rota privada
server.get("/master/:id", checkToken, async(req, res) => {
    const id =req.params.id
    //validação de existência de usuário
    const master = await MasterUser.findById(id, "-masterPassword")
    if (!master) {
        res.status(404).json({message: "O usuário não existe"})
    }
    res.status(200).json({master})
})

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({message: "acesso negado"})
    }
    try {
        const secret = process.env.SECRET

        jsonwebtoken.verify(token, secret)

        next()

    } catch (error) {
        res.status(400).json({message: "Token inválido"})
    }
}

//Rota de cadastro de usuário
server.post("/master", async(req, res) => {
    const {masterName, masterEmail, masterPassword, confirmPassword} = req.body

    //validações
    if (!masterName) {
        return res.status(422).json({message: "Você deve preencher todos os campos."})
    }
    if (!masterEmail) {
        return res.status(422).json({message: "Você deve inserir um e-mail"}) 
    }
    if (!masterPassword) {
    res.json({message: "Você deve inserir uma senha"})   
    }
    if (masterPassword !== confirmPassword) {
        res.status(422).json({msg: "As senhas não conferem"})
    }
    const userExists = await MasterUser.findOne({masterEmail: masterEmail})
    if (userExists) {
       res.status(422).json({message: "Este e-mail já está cadastrado"}) 
    }

    //tratamento da senha
    const salt = await bcrypt.genSalt(12);
    const masterPasswordHash = await bcrypt.hash(masterPassword, salt)

    const masterUser = new MasterUser({
        masterName,
        masterEmail,
        masterPassword: masterPasswordHash
    })
    try {
        await masterUser.save()
        res.status(201).json({message: "master user criado com sucesso"})
    } catch (error) {
        res.status(500).json({message: error})
    }
})

//Rota de login
server.post("/master/login", async(req, res) => {
    const { masterEmail, masterPassword } = req.body

    if (!masterEmail) {
        return res.status(422).json({message: "Você deve inserir um e-mail"}) 
    }
    if (!masterPassword) {
    res.json({message: "Você deve inserir uma senha"})   
    }

    const masterUser = await MasterUser.findOne({masterEmail: masterEmail})
    if (!masterUser) {
       res.status(422).json({message: "não existe este usuário"}) 
    }

    const matchMasterPassword = await bcrypt.compare(masterPassword, masterUser.masterPassword)

    if (!matchMasterPassword) {
        res.status(404).json({message: "A senha está incorreta"})
    }

    try {
        const secret = process.env.SECRET
        const token = jsonwebtoken.sign(
            {
                id: masterUser._id
            },secret
        )

        res.status(200).json({message: "autenticado com sucesso", token})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "erro"})
    }
})





const {DB_USER_PASSWORD, DB_USER_NAME} = process.env

//conexão ao servidor
mongoose.connect(`mongodb+srv://${DB_USER_NAME}:${DB_USER_PASSWORD}@authentication.r4noc.mongodb.net/adminMaster?retryWrites=true&w=majority`)
.then(
    server.listen(3000, () => {
        console.log("Servidor rodando...")
    })
)
.catch((err) => console.log("houve o seguinte erro: " + err))
