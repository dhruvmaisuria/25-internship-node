const routes=require("express").Router()
const contactUsController= require("../controllers/ContactUsController")
routes.get("/contactUs/:id",contactUsController.getContactById)
routes.post("/contactUs",contactUsController.addContact)
routes.delete("/contactUs/:id",contactUsController.deleteContact)

module.exports = routes



