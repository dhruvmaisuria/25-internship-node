const routes = require("express").Router();

const adminController = require('../controllers/AdminController');

routes.get("/adminDashBoard",adminController.getAdminStats);
routes.get("/chart-data",adminController.getChartData);
routes.get("/lawyerAppointments",adminController.getLawyerAppointmentsStats)
routes.get('/userSignupStats', adminController.getUserSignupStats);
routes.get('/appointmentStatusStats', adminController.getAppointmentStatusStats);
routes.get('/appointmentsCalendar',adminController.getAppointmentsForCalendars);
routes.get("/calendarAppointments",adminController.getAppointmentsForCalendar);
routes.get("/admin/getAllUsers",adminController.getAllUsers)
routes.delete("/admin/deleteUser/:id",adminController.deleteUser)
routes.patch("/admin/toggleUserBlock/:id",adminController.toggleUserBlock)
routes.get("/admin/getAllLawyers",adminController.getAllLawyers)
routes.delete("/admin/deleteLawyer/:id",adminController.deleteLawyer)
routes.patch("/admin/getAllPayments",adminController.toggleLawyerBlock)
routes.get("/admin/getAllPayments",adminController.getAllPayments)
routes.post("/admin/adminSignup",adminController.adminSignup)
routes.post("/admin/adminLogin",adminController.adminLogin)
routes.get("/admin/getAllReviews",adminController.getAllReviews)
routes.delete("/admin/deleteReview/:id",adminController.deleteReview)
module.exports = routes;
