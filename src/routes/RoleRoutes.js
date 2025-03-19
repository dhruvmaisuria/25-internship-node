const routes = require("express").Router()

const roleController  = require("../controllers/RoleController")
routes.get("/roles",roleController.getAllRoles)
routes.post("/role",roleController.addRole)
routes.delete("/role/:id",roleController.deleteRole)
routes.get("/role/:id",roleController.getRoleById)
routes.get("/role/:id",roleController.updateRole)
module.exports = routes
