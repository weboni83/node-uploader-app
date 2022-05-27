const express = require("express");
const app = express();
const { engine } = require("express-handlebars");
const path = require("path");

const port = 3000;

app.use(express.json());
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
