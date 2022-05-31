const { contentType, json } = require("express/lib/response");
const UploadModel = require("../model/schema");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const menu = [
  { text: "Home", link: "/", selected: true },
  { text: "News", link: "/", selected: false },
  { text: "About", link: "/about", selected: false },
  { text: "Contact", link: "/", selected: false },
  { text: "Login", link: "/login", selected: false },
];

exports.home = async (req, res) => {
  console.log(`req path -> ${req.path}`);
  const allImages = await UploadModel.find().sort({ createdAt: -1 }).limit(10);

  menuSelected("home");

  res.render("home", {
    style: "main",
    images: allImages,
    uploaderShow: false,
    menu: menu,
  });
};

exports.search = async (req, res) => {
  console.log(`search query -> ${req.query.filename}`);
  const allImages = await UploadModel.find({
    filename: { $regex: req.query.filename },
  })
    .sort({ createdAt: -1 })
    .limit(10);
  res.render("home", { style: "main", images: allImages, uploaderShow: false });
};

exports.detailbyId = async (req, res) => {
  console.log(`detailbyId -> ${req.params.file_id}`);

  const result = await UploadModel.find({ _id: req.params.file_id });

  console.log(`findedById -> ${result.filename}`);

  // res.render("detail", { images: result });

  res.render("detail", {
    style: "mobile",
    images: result,
  });
};

exports.uploads = (req, res, next) => {
  const files = req.files;

  if (!files) {
    const error = new Error("Please choose files");
    error.httpStatusCode = 400;
    return next(error);
  }

  // convert images into base64 encoding
  let imgArray = files.map((file) => {
    // console.log(`file path -> ${file.path}`);
    let img = fs.readFileSync(file.path);
    let encode_image = img.toString("base64");
    // console.log(`img base64-> ${encode_image}`);
    return encode_image;
  });

  let result = imgArray.map((src, index) => {
    let finalImg = {
      filename: files[index].originalname,
      contentType: files[index].mimetype,
      imageBase64: src,
      createdAt: new Date(),
    };

    let newUpload = new UploadModel(finalImg);

    return newUpload
      .save()
      .then(() => {
        return {
          msg: `${files[index].originalname} Uploaded Successfully...!`,
        };
      })
      .catch((error) => {
        if (error) {
          if (error.name === "MongoError" && error.code === 11000) {
            return Promise.reject({
              error: `Duplicate ${files[index].originalname}. File Already exists!`,
            });
          }
          return Promise.reject({
            error:
              error.messages || `Cannot Upload ${files[index].originalname}`,
          });
        }
      });
  });

  Promise.all(result)
    .then((msg) => {
      //   res.json(msg);
      res.redirect("/");
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.about = (req, res) => {
  menuSelected("about");

  res.render("about", { style: "main", menu: menu });
};

exports.login = async (req, res) => {
  console.log(`login path -> ${req.path}`);
  // menu.filter((f) => f.selected == true).forEach((p) => (p.selected = false));
  // menu.find((p) => p.text === "Login").selected = true;

  menuSelected("Login");

  res.render("login", { style: "main", login: false, menu: menu });
};

exports.signin = async (req, res) => {
  //body-parser 사용
  const { username, password } = req.body;
  console.log(`signin post -> ${username}, ${password}`);

  var session_url = `https://nas.sosoz.me/webapi/auth.cgi?api=SYNO.API.Auth&version=3&method=login&session=FileStation&format=cookie&account=${username}&passwd=${password}`;
  console.log(session_url);

  const result = await axios.get(session_url);

  console.log(result);
  console.log(typeof result.data);
  // // string으로 변환
  // console.log(typeof JSON.stringify(data));
  // // 다시 object로 변환
  // console.log(typeof JSON.parse(stringify(data)));
  // // String으로 변환하여 출력
  // console.log(stringify(data));
  // data.sid
  let objResult = JSON.parse(JSON.stringify(result.data));
  console.log(objResult);
  let sid = objResult.data.sid;
  console.log(sid);

  res.cookie("sid", sid, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    path: "/",
  });
  res.send("sid updated.");
  // res.send("Hello World!");
  // res.render("home", {
  //   style: "main",
  //   images: allImages,
  //   uploaderShow: true,
  //   isLogin: true,
  // });
};

// menu toggle function
//TODO:move to helper.js
function menuSelected(name) {
  menu.filter((f) => f.selected === true).forEach((p) => (p.selected = false));
  // menu.find((p) => p.text === name).selected = true;
  //NOTE:instead of the code above
  menu.find(
    (p) => p.text.localeCompare(name, undefined, { sensitivity: "base" }) == 0
  ).selected = true;

  console.log(`after => ${name}`);
}
