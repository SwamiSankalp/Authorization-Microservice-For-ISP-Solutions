/*
 *
 * INDEX.JS FILE
 *
 */

// DECLARING DOTENV
require("dotenv").config();

// DEPENDENCIES
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const router = express.Router();
const cors = require("cors");
const helmet = require("helmet");

const environment = process.env.NODE_ENV;
const stage = require("./config")[environment];

// DECLARING THE APP ROUTES
const routes = require("./src/routes/index.js");

// MIDDLEWARES
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// LOGGING TO CONSOLE
if (environment !== "production") {
  app.use(logger("dev"));
}

// ROUTES
app.use("/api/v1", routes(router));
//app.use('/api/v1', (req, res, next) => {
//    res.send('Hello');
//    next();
//});

// SERVER INITIALIZATION
app.listen(`${stage.port}`, () => {
  // LOG THE RESPONSE
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;
