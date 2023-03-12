const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { engine } = require("express-handlebars");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const csrf = require("csurf");
const passport = require("passport");
const session = require("express-session");
const logger = require("morgan");

// pass the session to the connect sqlite3 module
// allowing it to inherit from session.Store
var SQLiteStore = require("connect-sqlite3")(session);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
// serving static files
app.use(express.static(path.join(__dirname, "public")));
console.log(`rootdir -> ${__dirname}`);
// connect mongodb
const mdb = require("./server/database/database");
// const { session } = require("passport/lib");
mdb();
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

//passport
app.use(
  session({
    secret: "SECRET",
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
app.use(csrf());
app.use(passport.authenticate("session"));
app.use(function (req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// routes
var indexRouter = require("./server/routes/index");
var authRouter = require("./server/routes/auth");
app.use("/", indexRouter);
app.use("/", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(req.app.get("env"));
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var port = 3000;
port =
  process.env.status == "development"
    ? process.env.dev_port
    : process.env.prod_port;

console.log(port);

app.listen(port, () =>
  console.log(`Server is Started on http://localhost:${port}`)
);
