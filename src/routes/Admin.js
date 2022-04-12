//imports
const AdminRoutes = require("express").Router()
const AdminModel = require("../models/Admin.model");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const checkToken = require("../controllers/checkToken")
require('dotenv').config();

 checkToken

//paths of the admin route
    //Create an Admin
    AdminRoutes.post("/", async(req, res) => {
        const { name, email, password, confirmPassword } = req.body

        //Validations

        if (!name) {
            return res.status(422).json({message: "Você deve preencher todos os campos."})
        }
        if (!email) {
            return res.status(422).json({message: "Você deve inserir um e-mail"}) 
        }
        if (!password) {
        res.json({message: "Você deve inserir uma senha"})   
        }
        if (password !== confirmPassword) {
            res.status(422).json({msg: "As senhas não conferem"})
        }
        const userExists = await AdminModel.findOne({email: email})
        if (userExists) {
           res.status(422).json({message: "Este e-mail já está cadastrado"}) 
        }

        //Password handling
        const passwordHashed = await bcrypt.hash(password, salt = await bcrypt.genSalt(12))

        //Admin creation

        try {
            const admin = new AdminModel({
                name,
                email,
                password: passwordHashed
            })
            admin.save()
            res.status(201)
            .json({message: "Admin criado com sucesso!"})
        } catch (error) {
            res.status(500).json({message: "Ocorreu um erro no processo."})
            console.log("an error occurred: "+ error)
        }
    })
    
    //Login as Admin
    AdminRoutes.post("/login", async(req, res) => {
        const { email, password } = req.body

        //Validations

        if (!email) {
            return res.status(422).json({message: "Você deve inserir ou seu e-mail ou seu nome de usuário"}) 
        }
        if (!password) {
        res.json({message: "Você deve inserir uma senha"})   
        }
    
        const admin = await AdminModel.findOne({email: email})
        if (!admin) {
           res.status(422).json({message: "Este usuário não existe"}) 
        }

        const matchAdminPassword = await bcrypt.compare(password, admin.password)

        if (!matchAdminPassword) {
            console.log(matchAdminPassword)
            res.status(404).json({message: "A senha está incorreta"})
        }
    
        try {
            const secret = process.env.SECRET
            const token = jsonwebtoken.sign(
                {
                    id: admin._id
                },secret
            )
    
            res.status(200).json({
                message: "autenticado com sucesso", token
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: error
            })
        }
    })
        //C.R.U.D Admin Operations(Admin Login)
            //Admin main route
            AdminRoutes.get("/dashboard/:id", checkToken, async(req, res) => {
                const id =req.params.id
                //user existence validation
                const Admin = await AdminModel.findById(id, "-password")
                if (!Admin) {
                    res.status(404).json({message: "O usuário não existe"})
                }
                res.status(200).json(Admin)
            })
            //Get all admin

            //Get one admin

            //Update an Admin

            //Remove an Admin

module.exports = AdminRoutes