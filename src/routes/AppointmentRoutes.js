const routes = require("express").Router();

const appointmentController = require("../controllers/AppointmentController");

routes.get("/appointments",appointmentController.getAllAppointment);
routes.post("/appointment",appointmentController.addAppointment);
routes.delete("/appointment/:id",appointmentController.deleteAppointment);
routes.get("/appointmentByUserId/:userId",appointmentController.getAllAppointmentsByUserId);
routes.put("/updateAppointment/:id",appointmentController.updateAppointment);
routes.get("/getAppointmentById/:id",appointmentController.getAppointmentById);

module.exports = routes