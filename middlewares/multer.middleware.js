const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // assign a path where you want to save the file locally
        cb(null, "./public/temp") 
    },
    filename : function (req, file, cb) {
         cb(null, file.originalname)
    }
})
 const upload = multer({storage})
// const upload = multer({
//     storage: multer.diskStorage({}),
//     limits: { fileSize: 50000}
// })

module.exports = upload;
