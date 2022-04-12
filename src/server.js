//Dependences
const express = require('express');
const mongoose = require('mongoose');
const AdminRoutes = require('./routes/Admin');
const server = express()
const {DB_USER_PASSWORD, DB_USER_NAME} = process.env

server.use(express.json())
//Main server route
server.get("/", (req, res) => {
    res.json({hello: "Bem-vindo à api de gerenciamento de administradores"})
})
server.use("/admin", AdminRoutes)


//Conecting with the db server
mongoose.connect(`mongodb+srv://${DB_USER_NAME}:${DB_USER_PASSWORD}@authentication.r4noc.mongodb.net/adminMaster?retryWrites=true&w=majority`)
.then(
    server.listen(3000, () => {
        console.log("It's running")
    })
)
.catch((error) => console.log("an error occurred: " + error))