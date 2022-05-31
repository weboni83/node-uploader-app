const route = require("express").Router();
const controller = require("../controller/controller");
const store = require("../middleware/multer");
//routes
route.get("/", controller.home);
route.get("/search", controller.search);
route.post("/uploadmultiple", store.array("images", 12), controller.uploads);
route.get("/about", controller.about);
// route.get("/detail", controller.detail);
route.get("/detail/:file_id", controller.detailbyId);
// login
route.get("/login", controller.login);
route.post("/login", controller.signin);

module.exports = route;
