const { contentType } = require("express/lib/response");
const UploadModel = require("../model/schema");
const fs = require("fs");
const path = require("path");

exports.home = async (req, res) => {
  console.log(`req path -> ${req.path}`);
  const allImages = await UploadModel.find().sort({ createdAt: -1 }).limit(10);
  res.render("home", { style: "main", images: allImages, uploaderShow: true });
};

exports.search = async (req, res) => {
  console.log(`search query -> ${req.query.filename}`);
  const allImages = await UploadModel.find({
    filename: { $regex: req.query.filename },
  })
    .sort({ createdAt: -1 })
    .limit(10);
  res.render("home", { style: "main", images: allImages, uploaderShow: true });
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
  res.render("about", { style: "about" });
};
