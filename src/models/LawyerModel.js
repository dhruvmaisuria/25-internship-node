const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const lawyersSchema = new Schema({
    
    name:{
        type:String
    },
    number:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    specialization:{
        enum:["Civil", "Criminal", "Corporate", "Family", "Real Estate", "Intellectual Property", "Tax", "Employment"],
        type:String,
        required:true
    },
    experience:{
        type:Number,
    },
    rating:{
        type:Number,
        default:0,
    },
    ratingCount:{
        type: Number,
        default: 0 
    }, 
    roleId:{
        type:Schema.Types.ObjectId,
        ref:"roles"
    },
    imageURL:{
        type:String,
        required:true
    },
    reviews: [
        {
          comment: String,
          createdAt: { type: Date, default: Date.now }
        }
      ]
   
})

module.exports = mongoose.model("lawyers",lawyersSchema)