const AppointmentModel = require("../models/AppointmentModel");
const appointmentModel = require("../models/AppointmentModel");

// const addAppointment = async(req,res) =>{

//   try{

//     const savedAppointment = await appointmentModel.create(req.body);
//     res.status(201).json({
//         message:"Appointment Booked",
//         data:savedAppointment
//     });  
    
//   }
//   catch (err){
//     res.status(500).json({
//        message:"error",
//        data:err 
//     });

//   }

// } 

const addAppointment = async (req, res) => {
  try {
    const newAppointment = new appointmentModel({ ...req.body, status: "Pending" });
    const savedAppointment = await newAppointment.save();

    res.status(201).json({
      message: "Appointment Booked and Pending Confirmation",
      data: savedAppointment,
    });
  } catch (err) {
    res.status(500).json({ message: "Error booking appointment", error: err.message });
  }
};

   const getAllAppointment = async(req,res)=>{
      
   try{
 
    const appointments = await appointmentModel.find().populate("lawyerId userId");
    res.status(200).json({
        message:"fetched all appointments successfully",
        data:appointments
    });
     
    }

    catch(err){
        res.status(500).json({
            message:"error",
            data:err
        });

    }

   }

   const deleteAppointment = async(req,res)=>{
   
       const deletedAppointment = await appointmentModel.findByIdAndDelete(req.params.id)
   
       res.json({
           message:"Appointment deleted successfully.... ",
           data:deletedAppointment
       })
   }
   
   const getAllAppointmentsByUserId = async (req, res) => {
  
    try {
      const myAppointments = await appointmentModel
        .find({userId:req.params.userId})
        .populate("userId");
      if (myAppointments.length === 0) {
        res.status(404).json({ message: "No Appointments found" });
      } else {
        res.status(200).json({
          message: "Appointments found successfully",
          data: myAppointments,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  const getAllAppointmentsByLawyerId = async (req, res) => {
  
    try {
      const myAppointments = await appointmentModel
        .find({lawyerId:req.params.lawyerId})
        .populate("lawyerId");
      if (myAppointments.length === 0) {
        res.status(404).json({ message: "No Appointments found" });
      } else {
        res.status(200).json({
          message: "Appointments found successfully",
          data: myAppointments,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

   const updateAppointment = async(req,res) => {
     try{

      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        message: "Appointment updated successfully",
        data: updatedAppointment,
      });

     }catch(err) {
      res.status(500).json({
      message: "error while update Appointment",
      err: err,
      });
    }
  }
   
  const getAppointmentById= async(req,res)=>{
    try {
      const appointment = await appointmentModel.findById(req.params.id);
      if (!appointment) {
        res.status(404).json({ message: "No Appointment found" });
      } else {
        res.status(200).json({
          message: "Appointment found successfully",
          data: appointment,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


  const updateAppointmentStatus = async (req, res) => {
    try {
      const { id } = req.params; // Appointment ID
      const { status } = req.body; // "Confirmed" or "Rejected"
  
      if (!["Confirmed", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status update" });
      }
  
      const updatedAppointment = await appointmentModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
  
      res.status(200).json({
        message: `Appointment ${status} successfully`,
        data: updatedAppointment,
      });
    } catch (err) {
      res.status(500).json({ message: "Error updating appointment status", error: err.message });
    }
  };
  
module.exports = {
    addAppointment,getAllAppointment,deleteAppointment,getAllAppointmentsByUserId,updateAppointment,getAppointmentById,getAllAppointmentsByLawyerId,updateAppointmentStatus
}