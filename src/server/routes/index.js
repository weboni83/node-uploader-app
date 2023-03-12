const router = require("express").Router();
const controller = require("../controller/upload");
const store = require("../middleware/multer");
//routes
router.get("/", controller.home);
router.get("/search", controller.search);
router.post("/uploadmultiple", store.array("images", 12), controller.uploads);
router.get("/about", controller.about);
// route.get("/detail", controller.detail);
router.get("/detail/:file_id", controller.detailbyId);
// login
router.get("/login", (req, res, next) => {
  res.render("login", { style: "main", login: false });
});
router.get("/signup", (req, res, next) => {
  res.render("signup", { style: "main", login: false });
});
router.get("/profile", (req, res, next) => {
  res.render("profile", { style: "main", login: false });
});

module.exports = router;
