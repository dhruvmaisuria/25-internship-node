const LawyerModel = require("../models/LawyerModel.js");
const  userModel = require("../models/UsersModel.js")
const bcrypt = require("bcrypt")
const multer = require("multer");
const path = require ("path")
const cloudinaryUtil = require("../utils/cloudinaryUtil")
const mailUtil = require("../utils/MailUtil");

const jwt = require("jsonwebtoken")

require('dotenv').config();
const secret = process.env.JWT_SECRET;


const storage = multer.diskStorage({
    destination:"./uploads",
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});


const upload = multer({
    storage:storage,
}).single("image");

const getLawyerData = async (req, res) => {
    try {
        const lawyers = await LawyerModel.find().populate("roleId");

        if (!lawyers || lawyers.length === 0) {
            return res.status(404).json({
                message: "No lawyers found",
                data: null
            });
        }

        res.status(200).json({
            message: "Lawyer data fetched successfully",
            data: lawyers
        });
    } catch (error) {
        console.error("Error fetching lawyers:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// const lawyerLogin = async (req,res) =>{


//     const email = req.body.email;
//     const password = req.body.password;

//     const foundLawyerFromEmail = await LawyerModel.findOne({email: email}).populate("roleId");
//     console.log(foundLawyerFromEmail);

//     if(foundLawyerFromEmail != null){
        
//         const isMatch = bcrypt.compareSync(password,foundLawyerFromEmail.password);

//         if(isMatch == true){
//             res.status(200).json({
//                 message:"login successfully",
//                 data:foundLawyerFromEmail
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



const lawyerLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const foundLawyer = await LawyerModel.findOne({ email }).populate("roleId");
  
      if (!foundLawyer) {
        return res.status(404).json({
          message: "Email not found...",
        });
      }
  
      // ✅ Check if the lawyer is blocked
      if (foundLawyer.isBlocked) {
        return res.status(403).json({
          message: "Your account has been blocked by admin.",
        });
      }
  
      const isMatch = bcrypt.compareSync(password, foundLawyer.password);
  
      if (isMatch) {
        return res.status(200).json({
          message: "Login successfully",
          data: foundLawyer,
        });
      } else {
        return res.status(401).json({
          message: "Invalid credentials...",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        message: "Something went wrong, please try again later.",
      });
    }
  };
  




const signupLawyer = async(req,res)=>{
     
     try{
        
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashedPassword;
        
        const createdLawyer = await LawyerModel.create(req.body)
        res.status(201).json({
            message:"lawyer created..",
            data:createdLawyer


        })

     }catch(err){

        


        res.status(500).json({
            message:"error",
            data:err
        })

     }

}



const signupLawyerWithFile = async(req,res) => {

    upload(req,res,async(err)  => {

        if(err) {
            res.status(500).json({
                message:err.message,
            });
        }else{
            console.log(req.file)

           
            const cloudinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
            console.log(cloudinaryResponse);
            console.log(req.body);


            //store data in database

            req.body.imageURL = cloudinaryResponse.secure_url

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);
            req.body.password = hashedPassword;

            req.body.rating = 0;
            req.body.ratingCount = 0;

            const savedLawyer = await LawyerModel.create(req.body);
            await mailUtil.sendingMail(savedLawyer.email,"welcome to Legal Consultant MarketPlace","this is welcome mail")

            res.status(201).json({
                message:"lawyer added successfully",
                data:savedLawyer
            });
        }
    });
};


const deleteLawyer = async(req,res)=>{

    const deletedLawyer = await LawyerModel.findByIdAndDelete(req.params.id)

    res.json({
        message:"lawyer deleted successfully.... ",
        data:deletedLawyer
    })
}

// const getLawyerById = async(req,res)=>{

//     const foundLawyer = await LawyerModel.findById(req.params.id);

//     res.json({
//         message:"lawyer fetched successfully.... ",
//         data:foundLawyer
//     })
// }

const getLawyerById = async (req, res) => {
    try {
      const lawyer = await LawyerModel.findById(req.params.id);
      if (!lawyer) {
        return res.status(404).json({ message: "Lawyer not found" });
      }
  
      res.status(200).json({
        message: "Lawyer fetched successfully",
        data: lawyer
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching lawyer",
        error: error.message
      });
    }
  };



const getLawyersBySpecialization = async (req, res) => {
    try {
      const { specialization } = req.params;
      const foundLawyers = await LawyerModel.find({ specialization });
  
      if (foundLawyers.length === 0) {
        return res.status(404).json({ message: "No lawyers found" });
      }
  
      res.status(200).json({
        message: "Lawyers fetched successfully",
        data: foundLawyers,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching lawyers", error: err });
    }
  };

  const forgotPassword = async(req,res) =>{
  
      const email = req.body.email;
      const foundLawyer  = await LawyerModel.findOne({email : email});
  
      if(foundLawyer != null) {
  
         const token = jwt.sign(foundLawyer.toObject(),secret,{ expiresIn: "1h" });
         console.log(token);
         const url = `http://localhost:5173/lawyerResetPassword/${token}`;
         const mailContent = `
        <html>
          <body>
            <p>You requested a password reset. Click the link below:</p>
            <a href="${url}" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:#ffffff; text-decoration:none; border-radius:5px;">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
          </body>
        </html>`;
         
         await mailUtil.forgotSendingMail(foundLawyer.email, "reset password" , mailContent);
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
  
      const lawyerFromToken = jwt.verify(token,secret);
  
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword,salt)
  
      const updateLawyer = await LawyerModel.findByIdAndUpdate(lawyerFromToken._id, {
          password:hashedPassword,
      });
      res.json({
          message:"password updated successfully.."
      });  
  
  }

  const getTopRatedLawyers = async (req, res) => {
    try {
        const topLawyers = await LawyerModel.find()
            .sort({ rating: -1, ratingCount: -1 })
            .limit(3);

        if (!topLawyers || topLawyers.length === 0) {
            return res.status(404).json({
                message: "No top-rated lawyers found",
                data: []
            });
        }

        // Only sending relevant info
        const formattedData = topLawyers.map(lawyer => ({
            _id: lawyer._id,
            name: lawyer.name,
            specialization: lawyer.specialization,
            rating: lawyer.rating,
            imageURL: lawyer.imageURL
        }));

        res.json({
            message: "Top-rated lawyers fetched successfully",
            data: formattedData
        });
    } catch (error) {
        console.error("Error fetching top-rated lawyers:", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

module.exports = {
    getLawyerData,deleteLawyer,getLawyerById,lawyerLogin,signupLawyer,signupLawyerWithFile,getLawyersBySpecialization,forgotPassword,resetPassword,getTopRatedLawyers
}   