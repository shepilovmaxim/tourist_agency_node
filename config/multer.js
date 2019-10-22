const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'tour_image') {
      cb(null, './public/images/tours');
    } else if (file.fieldname === 'hotel_image') {
      cb(null, './public/images/hotels');
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFiletypes = /jpeg|jpg|png/;
    const extname = allowedFiletypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFiletypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb("Error: images only");
    }
  }
});

module.exports = upload;