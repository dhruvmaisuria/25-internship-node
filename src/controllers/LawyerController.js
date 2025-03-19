const LawyerModel = require("../models/LawyerModel.js");
const  userModel = require("../models/UsersModel.js")
const bcrypt = require("bcrypt")
const multer = require("multer");
const path = require ("path")
const cloudinaryUtil = require("../utils/cloudinaryUtil")



const storage = multer.diskStorage({
    destination:"./uploads",
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});


const upload = multer({
    storage:storage,
}).single("image");

const getLawyerData = async(req,res)=>{

    const lawyers = await LawyerModel.find().populate("roleId");

    res.json({
        message:"lawyer Data fetched successfully.... ",
        data:lawyers
    })
}


const lawyerLogin = async (req,res) =>{


    const email = req.body.email;
    const password = req.body.password;

    const foundLawyerFromEmail = await LawyerModel.findOne({email: email}).populate("roleId");
    console.log(foundLawyerFromEmail);

    if(foundLawyerFromEmail != null){
        
        const isMatch = bcrypt.compareSync(password,foundLawyerFromEmail.password);

        if(isMatch == true){
            res.status(200).json({
                message:"login successfully",
                data:foundLawyerFromEmail
            });

        }else{
            res.status(404).json({
                message:"invalid cred....",
            });
        }
    }else{
        res.status(404).json({
            message:"Email not found..."
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

            const savedLawyer = await LawyerModel.create(req.body);

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

const getLawyerById = async(req,res)=>{

    const foundLawyer = await LawyerModel.findById(req.params.id);

    res.json({
        message:"lawyer fetched successfully.... ",
        data:foundLawyer
    })
}

module.exports = {
    getLawyerData,deleteLawyer,getLawyerById,lawyerLogin,signupLawyer,signupLawyerWithFile
}   