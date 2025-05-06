const cloudinary = require("cloudinary");
require('dotenv').config();


const uploadFileToCloudinary = async(file) => {

    cloudinary.config({
        cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    })


    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
    return cloudinaryResponse;



};


module.exports = {
    uploadFileToCloudinary
}