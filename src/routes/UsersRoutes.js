const routes = require("express").Router()

const userController = require("../controllers/UsersController")

routes.get("/users",userController.getUserData)
// routes.post("/user",userController.addUser)
routes.post("/user",userController.signup)
routes.post("/user/login",userController.loginUser)
routes.delete("/user/:id",userController.deleteUser)
routes.get("/user/:id",userController.getUserById)

module.exports = routes 