const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const AdminSchema = new Schema({

   name:{
    type:String,
   },
   email:{
    type:String,
        unique:true
   },
   password:{
    type:String
   },
   roleId:{
    type:Schema.Types.ObjectId,
        ref:"roles"
    },
   
   

},{timestamps:true})

module.exports =mongoose.model("admins",AdminSchema)