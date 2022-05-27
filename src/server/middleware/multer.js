const multer = require("multer");
const path = require("path");

//set storage
var localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    var ext = file.originalname.substring(file.originalname.lastIndexOf("."));

    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const store = multer({ storage: localStorage });
module.exports = store;
