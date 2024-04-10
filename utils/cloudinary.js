require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null  // or you can return a error message that could not find the path

        //upload the path on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image' 
        })

        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary", response);

        return response;

    } catch (error) {
        // remove the locally saved temporary file as the upload operation got failed
        fs.unlinkSync(localFilePath);
        console.log(error);
        // return null;
    }
}

module.exports = uploadOnCloudinary;



// create a folder middlewares and inside this create a file multer.middleware.js and write below code

// import multer from "multer"; // express-fileuploader

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, "./public/temp") // assign a path where you want to save the file locally
//     },
//     filename : function (req, file, cb) {
//          cb(null, file.originalname)
//     }
// })

// export const upload = multer({ storage : storage});
