const userModel = require('../models/UsersModel');
const lawyerModel = require('../models/LawyerModel');
const appointmentModel = require('../models/AppointmentModel');
const adminModel =require('../models/AdminModel')
const bcrypt = require("bcrypt")
const mailUtil = require("../utils/MailUtil");
const reviewModel = require("../models/ReviewModel")
const queryModel = require("../models/QueriesModel")



const adminSignup = async(req,res)=>{
     
  try{
     
     const salt = bcrypt.genSaltSync(10);
     const hashedPassword = bcrypt.hashSync(req.body.password, salt);
     req.body.password = hashedPassword;
     
     const createdAdmin = await adminModel.create(req.body)
     await mailUtil.sendingMail(createdAdmin.email,"welcome to Legal Consultant MarketPlace","this is welcome mail")
     res.status(201).json({
         message:"Admin created..",
         data:createdAdmin


     })

  }catch(err){

     


     res.status(500).json({
         message:"error",
         data:err.message
     })

  }

}

const adminLogin = async (req,res) =>{


 const email = req.body.email;
 const password = req.body.password;

 const foundAdminFromEmail = await adminModel.findOne({email: email}).populate("roleId");
 console.log(foundAdminFromEmail);

 if(foundAdminFromEmail != null){
     
     const isMatch = bcrypt.compareSync(password,foundAdminFromEmail.password);

     if(isMatch == true){
         res.status(200).json({
             message:"login successfully",
             data:foundAdminFromEmail
         });

     }else{
         res.status(401).json({
             message:"invalid cred....",
         });
     }
 }else{
     res.status(404).json({
         message:"Email not found..."
     });
 }
};


const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalLawyers = await lawyerModel.countDocuments();
    const totalAppointments = await appointmentModel.countDocuments();
    const completedPayments = await appointmentModel.find({ paymentStatus: 'Completed' });
    const totalReviews = await reviewModel.countDocuments();
    const totalQueries = await queryModel.countDocuments();

    const totalEarnings = completedPayments.reduce((sum, appt) => {
      return sum + (appt.amount || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalLawyers,
        totalAppointments,
        totalReviews,
        totalEarnings,
        totalQueries
        
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



  const getLawyerAppointmentsStats = async (req, res) => {
    try {
      const data = await appointmentModel.aggregate([
        {
          $group: {
            _id: "$lawyerId",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "lawyers",
            localField: "_id",
            foreignField: "_id",
            as: "lawyer",
          },
        },
        {
          $unwind: "$lawyer",
        },
        {
          $project: {
            lawyerName: "$lawyer.name",
            count: 1,
          },
        },
      ]);
  
      res.status(200).json({ success: true, data: data });
    } catch (error) {
      console.error("Error getting lawyer appointment stats:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  


const getUserSignupStats = async (req, res) => {
  try {
    const monthlyStats = await userModel.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: monthlyStats
    });
  } catch (error) {
    console.error("User signup stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

  

  const getAppointmentStatusStats = async (req, res) => {
    try {
      const statusData = await appointmentModel.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]);
  
      const chartData = statusData.map(item => ({
        status: item._id,
        count: item.count
      }));
  
      res.status(200).json({ success: true, data: chartData });
    } catch (error) {
      console.error("Error fetching appointment status stats:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const getAppointmentsForCalendars = async (req, res) => {
    try {
      const appointments = await appointmentModel.find()
        .populate('userId', 'name')
        .populate('lawyerId', 'name');
  
      const calendarData = appointments.map(appt => ({
        title: `${appt.userId?.name} & ${appt.lawyerId?.name}`,
        start: appt.appointmentDate,
        end: appt.appointmentDate,
        status: appt.status.toLowerCase(),
      }));
  
      res.status(200).json({ success: true, data: calendarData });
    } catch (err) {
      console.error("Calendar fetch error:", err);
      res.status(500).json({ success: false, message: "Failed to load appointments" });
    }
  };
  
  const getAppointmentsForCalendar = async (req, res) => {
    try {
      const appointments = await appointmentModel.find()
        .populate('userId', 'firstName')
        .populate('lawyerId', 'name');
  
      const calendarData = appointments.map(appt => ({
        id: appt._id,
        title: `${appt.userId?.firstName} & ${appt.lawyerId?.name}`,
        start: appt.appointmentDate,
        end: appt.appointmentDate,
        status: appt.status
      }));
  
      res.status(200).json(calendarData); // returning array directly for easier frontend use
    } catch (err) {
      console.error("Calendar fetch error:", err);
      res.status(500).json({ message: "Failed to load appointments for calendar" });
    }
  };
  

  const getAllUsers = async (req, res) => {
    try {
      const users = await userModel.find({}, "-password"); // exclude password
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
  };

  const toggleUserBlock = async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
  
      user.isBlocked = !user.isBlocked;
      await user.save();
  
      res.status(200).json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
    } catch (error) {
      console.error("Failed to update user block status:", error);
      res.status(500).json({ success: false, message: "Failed to update user status" });
    }
  };

  
  const deleteUser = async (req, res) => {
    try {
      const result = await userModel.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ success: false, message: "User not found" });
  
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  // Get all lawyers
const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await lawyerModel.find().select("-password");
    res.status(200).json({ success: true, data: lawyers });
  } catch (err) {
    console.error("Error fetching lawyers:", err);
    res.status(500).json({ success: false, message: "Failed to fetch lawyers" });
  }
};

// Toggle block/unblock lawyer
const toggleLawyerBlock = async (req, res) => {
  try {
    const lawyer = await lawyerModel.findById(req.params.id);
    if (!lawyer) {
      return res.status(404).json({ success: false, message: "Lawyer not found" });
    }
    lawyer.isBlocked = !lawyer.isBlocked;
    await lawyer.save();
    res.status(200).json({ success: true, message: `Lawyer ${lawyer.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (err) {
    console.error("Error toggling lawyer status:", err);
    res.status(500).json({ success: false, message: "Failed to update lawyer status" });
  }
};

// Optional: Delete lawyer
const deleteLawyer = async (req, res) => {
  try {
    const result = await lawyerModel.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Lawyer not found" });
    }
    res.status(200).json({ success: true, message: "Lawyer deleted successfully" });
  } catch (err) {
    console.error("Error deleting lawyer:", err);
    res.status(500).json({ success: false, message: "Failed to delete lawyer" });
  }
};


// const deleteLawyer = async (req, res) => {
//   try {
//     const lawyerId = req.params.id;

//     // Delete all appointments related to this lawyer
//     await appointmentModel.deleteMany({ lawyerId });

//     // Delete all reviews for this lawyer
//     await reviewModel.deleteMany({ lawyerId });

//     // Delete all legal queries for this lawyer
//     await queryModel.deleteMany({ lawyerId });

//     // Now delete the lawyer
//     await lawyerModel.findByIdAndDelete(lawyerId);

//     res.status(200).json({ message: "Lawyer and all associated data deleted successfully." });
//   } catch (err) {
//     console.error("Error deleting lawyer and data:", err);
//     res.status(500).json({ message: "Server error while deleting lawyer data." });
//   }
// };




const getAllPayments = async (req, res) => {
  try {
    // Fetch all appointments (which include payment details)
    const appointments = await appointmentModel.find()
      .populate("userId")  // Populate user details to show user names
      .populate("lawyerId") // Populate lawyer details if needed
      .exec();

    res.status(200).json({
      message: "Fetched all payments successfully",
      data: appointments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

// Get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find()
      .populate('userId', 'firstName lastName')
      .populate('lawyerId', 'name specialization');

    res.status(200).json({
      message: "All reviews fetched successfully",
      data: reviews
    });
  } catch (err) {
    console.error("Get Reviews Error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await reviewModel.findByIdAndDelete(id);
    res.status(200).json({
      message: "Review deleted successfully"
    });
  } catch (err) {
    console.error("Delete Review Error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
};





module.exports = {
  getAdminStats,getChartData,getLawyerAppointmentsStats,getUserSignupStats,getAppointmentStatusStats,getAppointmentsForCalendars,getAppointmentsForCalendar, getAllUsers,toggleUserBlock,deleteUser,deleteLawyer,toggleLawyerBlock,getAllLawyers,getAllPayments,adminSignup,adminLogin,getAllReviews,deleteReview
};
