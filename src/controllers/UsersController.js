const  userModel = require("../models/UsersModel.js")
const bcrypt = require("bcrypt")
const mailUtil = require("../utils/MailUtil");
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken")

require('dotenv').config();
const secret = process.env.JWT_SECRET;

const getUserData = async(req,res)=>{

    const users = await userModel.find().populate("roleId");

    res.json({
        message:"user Data fetched successfully.... ",
        data:users
    })
}


// const loginUser = async (req,res) =>{


//     const email = req.body.email;
//     const password = req.body.password;

//     const foundUserFromEmail = await userModel.findOne({email: email}).populate("roleId");
//     console.log(foundUserFromEmail);

//     if(foundUserFromEmail != null){
        
//         const isMatch = bcrypt.compareSync(password,foundUserFromEmail.password);

//         if(isMatch == true){
//             res.status(200).json({
//                 message:"login successfully",
//                 data:foundUserFromEmail
//             });

//         }else{
//             res.status(404).json({
//                 message:"invalid cred....",
//             });
//         }
//     }else{
//         res.status(404).json({
//             message:"Email not found..."
//         });
//     }
// };


const loginUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const foundUserFromEmail = await userModel.findOne({ email: email }).populate("roleId");
    console.log(foundUserFromEmail);
  
    if (foundUserFromEmail != null) {
  
      // 🔒 Check if user is blocked
      if (foundUserFromEmail.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account has been blocked by the admin.",
        });
      }
  
      const isMatch = bcrypt.compareSync(password, foundUserFromEmail.password);
  
      if (isMatch === true) {
        res.status(200).json({
          message: "Login successfully",
          data: foundUserFromEmail
        });
      } else {
        res.status(401).json({
          message: "Invalid credentials.",
        });
      }
  
    } else {
      res.status(404).json({
        message: "Email not found.",
      });
    }
  };
  




const signup = async(req,res)=>{
     
     try{
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashedPassword;
        
        const createdUser = await userModel.create(req.body)
        await mailUtil.sendingMail(createdUser.email,"welcome to Legal Consultant MarketPlace","this is welcome mail")
        res.status(201).json({
            message:"user created..",
            data:createdUser


        })

     }catch(err){

        


        res.status(500).json({
            message:"error",
            data:err
        })

     }

}

const addUser = async(req,res)=>{

    try{

        const createdUser = await userModel.create(req.body)
        res.status(201).json({
            message:"user created..",
            data:createdUser
        })



    }catch(err){

        res.status(500).json({
            message:"error",
            data:err
        })

    }
}

const deleteUser = async(req,res)=>{

    const deletedUser = await userModel.findByIdAndDelete(req.params.id)

    res.json({
        message:"user deleted successfully.... ",
        data:deletedUser
    })
}

const getUserById = async(req,res)=>{

    const foundUser = await userModel.findById(req.params.id);

    res.json({
        message:"user fetched successfully.... ",
        data:foundUser
    })
}

const forgotPassword = async(req,res) =>{

    const email = req.body.email;
    const foundUser  = await userModel.findOne({email : email});

    if(foundUser != null) {

       const token = jwt.sign(foundUser.toObject(),secret);
       console.log(token);
       const url = `http://localhost:5173/resetPassword/${token}`;
       const mailContent = `<html>
                               <a href="${url}">Reset Password</a>   
                            </html>` ;
       
       await mailUtil.forgotSendingMail(foundUser.email, "reset password" , mailContent);
       res.status(200).json({
        message:"reset password link sent to your mail"
       }); 

    }else {
        res.status(404).json({
            message:"Email not found..."
        });
    }
}

const resetPassword = async(req,res)=>{
    const token = req.body.token;
    const newPassword = req.body.password;

    const userFromToken = jwt.verify(token,secret);


    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword,salt)

    const updateUser = await userModel.findByIdAndUpdate(userFromToken._id, {
        password:hashedPassword,
    });
    res.json({
        message:"password updated successfully.."
    });

}

module.exports = {
    getUserData,addUser,deleteUser,getUserById,loginUser,signup,forgotPassword,resetPassword
}