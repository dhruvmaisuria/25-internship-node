const routes = require("express").Router();

const appointmentController = require("../controllers/AppointmentController");

routes.get("/appointments",appointmentController.getAllAppointment);
routes.post("/appointment",appointmentController.addAppointment);
routes.delete("/deleteAppointment/:id",appointmentController.deleteAppointment);
routes.get("/appointmentByUserId/:userId",appointmentController.getAllAppointmentsByUserId);
routes.put("/updateAppointment/:id",appointmentController.updateAppointment);
routes.get("/getAppointmentById/:id",appointmentController.getAppointmentById);
routes.get("/appointmentByLawyerId/:lawyerId",appointmentController.getAllAppointmentsByLawyerId);
routes.put("/updateAppointmentStatus/:id",appointmentController.updateAppointmentStatus);


module.exports = routes