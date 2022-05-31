const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { engine } = require("express-handlebars");
const path = require("path");

const port = 3000;

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
// serving static files
app.use(express.static(path.join(__dirname, "public")));
console.log(`rootdir -> ${__dirname}`);
// connect mongodb
const db = require("./server/database/database");
db();
//setup view engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// routes
// app.get("/", (req, res) => res.render("home", { style: "home" }));
// app.get("/about", (req, res) => res.render("about", { style: "about" }));
//instead of
app.use("/", require("./server/router/router"));

app.listen(port, () =>
  console.log(`Server is Started on http://localhost:${port}`)
);
