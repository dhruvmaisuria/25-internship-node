const ContactUsModel = require("../models/ContactUsModel")
const mailUtil = require("../utils/MailUtil")

const addContact= async (req,res) => {
  

  const savedContact= await ContactUsModel.create(req.body)
  

  await mailUtil.sendingMail(savedContact.email,"Thankyou for Contact Us","For any query please contact on these mail")

  res.json({
    message:"message send successfully",
    data:savedContact
  })
}

const deleteContact= async (req,res) => {

   

const deletedContact= await ContactUsModel.findByIdAndDelete(req.params.id)

res.json({
  message:"message deleted..",
    data:deletedContact
})
  
}


const getContactById= async(req,res)=>{
  //req param.id

  const foundContact= await ContactUsModel.findById(req.params.id)

  res.json({
    message:"message fatched..",
    data:foundContact

  })
}

module.exports={
    addContact,deleteContact,getContactById
}