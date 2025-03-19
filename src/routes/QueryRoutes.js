const routes = require("express").Router()

const queryController  = require("../controllers/QueryController")
routes.get("/queries",queryController.getAllQueries)
routes.post("/query",queryController.addQuery)
routes.delete("/query/:id",queryController.deleteQuery)
routes.get("/query/:id",queryController.getQueryById)
module.exports = routes
