const routes = require("express").Router()

const lawyerController = require("../controllers/LawyerController")

routes.get("/lawyers",lawyerController.getLawyerData)
routes.post("/lawyer",lawyerController.signupLawyer)
routes.post("/lawyerWithFile",lawyerController.signupLawyerWithFile)
routes.post("/lawyerLogin",lawyerController.lawyerLogin)   
routes.delete("/lawyer/:id",lawyerController.deleteLawyer)
routes.get("/lawyer/:id",lawyerController.getLawyerById)

module.exports = routes 