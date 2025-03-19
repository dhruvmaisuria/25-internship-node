const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const querySchema = new Schema({

    userId:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    queryText:{
        type:String,
        required:true
   },
    resCount:{
        type:Number,
        default:0
   }

})

module.exports =mongoose.model("queries",querySchema)