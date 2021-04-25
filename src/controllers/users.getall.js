/*
 *
 *  FETCHING THE LIST OF USERS
 *
 */

// DEPENDENCIES
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const User = require("../models/users");

module.exports = {
  getAll: (req, res) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(
      connUri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      (err) => {
        console.log("DATABASE CONNECTION STATUS : CONNECTED !!!");
        let result = {};
        let status = 200;
        if (!err) {
          // GET THE PAYLOAD FROM THE HEADERS
          const payload = req.decoded;
          // CHECK FOR THE REQUIRED TOKEN WITH ACCES PROVIDED USER
          if (payload && payload.user.useraccesslevel === 1) {
            User.find({}, (err, users) => {
              if (!err) {
                result.status = status;
                result.error = err;
                result.result = users;
              } else {
                status = 500;
                result.status = status;
                result.error = err;
              }
              res.status(status).send(result);
            }).then(() =>
              // CLOSE THE DATABASE CONNECTION
              mongoose.connection.close(() => {
                console.log("DATABASE CONNECTION STATUS : DISCONNECTED !!!");
              })
            );
            // RESPONDS WHEN THERE IS NO TOKEN OR IF ITS INVALID
          } else {
            status = 401;
            result.status = status;
            result.error = `Authentication error`;
            res.status(status).send(result);
            // CLOSE THE DATABASE CONNECTION
            mongoose.connection.close(() => {
              console.log("DATABASE CONNECTION STATUS : DISCONNECTED !!!");
            });
          }
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
          // CLOSE THE DATABASE CONNECTION
          mongoose.connection.close(() => {
            console.log("DATABASE CONNECTION STATUS : DISCONNECTED !!!");
          });
        }
      }
    );
  },
};
