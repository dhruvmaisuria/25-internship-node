const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({

    userId:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required: true
    },

    lawyerId:{
        type:Schema.Types.ObjectId,
        ref:'lawyers',
        // required:true
    },
    problemCategory:{
        enum:["Civil", "Criminal", "Corporate", "Family", "Real Estate", "Intellectual Property", "Tax", "Employment"],
        type:String,
        required:true
    },

    appointmentDate:{
        type:Date,
        required:true
    },
    appointmentTime:{
        type:String,
        required:true   
    },
    consultationType:{
        enum :['Video', 'Voice', 'Chat'],
        type:String,
        required:true
    },
    paymentStatus:{
        enum:['Pending', 'Completed','Failed'],
        type:String,
        required:true,
        default:"Pending"
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Rejected"],
        default: "Pending",
      },

},{timestamps: true});

module.exports = mongoose.model('appointments',appointmentSchema)

