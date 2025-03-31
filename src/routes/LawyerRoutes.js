const routes = require("express").Router()

const lawyerController = require("../controllers/LawyerController")

routes.get("/lawyers",lawyerController.getLawyerData)
routes.post("/lawyer",lawyerController.signupLawyer)
routes.post("/lawyerWithFile",lawyerController.signupLawyerWithFile)
routes.post("/lawyerLogin",lawyerController.lawyerLogin)   
routes.delete("/lawyer/:id",lawyerController.deleteLawyer)
routes.get("/lawyer/:id",lawyerController.getLawyerById)
routes.get("/lawyers/:specialization",lawyerController.getLawyersBySpecialization)
routes.post("/lawyer/forgotPassword",lawyerController.forgotPassword)
routes.post("/lawyer/resetPassword",lawyerController.resetPassword)


module.exports = routes 