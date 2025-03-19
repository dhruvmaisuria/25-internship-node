const cloudinary = require("cloudinary");


const uploadFileToCloudinary = async(file) => {

    cloudinary.config({
        cloud_name :"dxj3s4k67",
        api_key:"123254656452336",
        api_secret:"JnMtY_fdsCzsR09rs6shhHa2Kng"
    })


    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
    return cloudinaryResponse;



};


module.exports = {
    uploadFileToCloudinary
}