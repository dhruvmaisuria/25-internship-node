const userModel = require('../models/UsersModel');
const lawyerModel = require('../models/LawyerModel');
const appointmentModel = require('../models/AppointmentModel');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalLawyers = await lawyerModel.countDocuments();
    const totalAppointments = await appointmentModel.countDocuments();
    const completedPayments = await appointmentModel.find({ paymentStatus: 'Completed' });

    const totalEarnings = completedPayments.reduce((sum, appt) => {
      return sum + (appt.amount || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalLawyers,
        totalAppointments,
        totalEarnings,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};


// Controller for chart data
const getChartData = async (req, res) => {
    try {
      // You might need to adjust according to your DB schema
      const payments = await appointmentModel.aggregate([
        {
          $match: { paymentStatus: "Completed" },
        },
        {
          $group: {
            _id: { $month: "$appointmentDate" },
            totalPayments: { $sum: "$amount" },
            totalAppointments: { $sum: 1 },
          },
        },
        {
          $sort: { "_id": 1 }
        }
      ]);
  
      // Format for frontend chart
      const monthNames = [
        "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
  
      const chartData = payments.map(item => ({
        name: monthNames[item._id],
        payments: item.totalPayments,
        appointments: item.totalAppointments,
      }));
  
      res.status(200).json({ success: true, data: chartData });
    } catch (error) {
      console.error("Error generating chart data:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  
module.exports = {
  getAdminStats,getChartData
};
