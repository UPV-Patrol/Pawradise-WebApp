//DESCRIPTION: for handling file uploads
//NOTE: since in forms when files are sent it's encoded in multipart/form-data and normal parsing makes whole body blank

const multer = require('multer');
const path = require('path');
const fs = require('fs');

//config storage loc
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/sponsorship'); 
        // create if folder doesnt exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

//handles the image type
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file format. Please only upload image inputs'), false); 
    }
};

//assign the storage and the file type and file size configs
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;