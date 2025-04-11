const routes = require("express").Router();

const adminController = require('../controllers/AdminController');

routes.get("/adminDashBoard",adminController.getAdminStats);
routes.get("/chart-data",adminController.getChartData);

module.exports = routes;
