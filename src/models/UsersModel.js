const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    number:{
        type:String
    },
    password:{
        type:String
    },
    roleId:{
        type:Schema.Types.ObjectId,
        ref:"roles"
    },
    isBlocked: {
        type: Boolean,
        default: false
      }
      
   
},{timestamps:true})

module.exports = mongoose.model("users",usersSchema)