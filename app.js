// Importing necessary modules
var express = require("express"); // Express.js framework
require("dotenv").config(); // Loads environment variables from a .env file into process.env
var path = require("path"); // Provides utilities for working with file and directory paths
var cookieParser = require("cookie-parser"); // Parses cookie header and populate req.cookies
var logger = require("morgan"); // HTTP request logger middleware
const session = require("express-session"); // Session middleware
const MongoStore = require("connect-mongo"); // MongoDB session store for Express and Connect
const passport = require("passport"); // Authentication middleware

// Importing routers
var indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const projectsRouter = require("./routes/projects");
const userDataRouter = require("./routes/userData");
const searchProjectsRouter = require("./routes/searchProjects");

// Creating an Express application
var app = express();

// Setting up middleware
app.use(logger("dev")); // Using 'dev' format string for logging
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded bodies
app.use(cookieParser()); // Parses cookies
app.use(express.static(path.join(__dirname, "frontend/build"))); // Serves static files

// Setting up sessions
app.use(
  session({
    secret: process.env.SECRET_STRING, // Secret used to sign the session ID cookie
    resave: false, // Forces session to be saved back to the session store
    saveUninitialized: true, // Forces a session that is "uninitialized" to be saved to the store
    store: MongoStore.create({ // Configuring the session store
      mongoUrl: process.env.DB_STRING,
      dbName: "OpTask",
      collection: "sessions",
    }),
    cookie: {
      maxAge: 7 * 1000 * 60 * 60 * 25, // Cookie will expire after 7 days
    },
  })
);

// Passport configuration
require("./auth/passportConfig");
app.use(passport.initialize()); // Initializes Passport
app.use(passport.session()); // Uses Passport's session handling

// Middleware for logging session and user information
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

// Setting up routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/projects", projectsRouter);
app.use("/userData", userDataRouter);
app.use("/searchProjects", searchProjectsRouter);

// Catch-all route handler
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
});

// Exporting the app
module.exports = app;
