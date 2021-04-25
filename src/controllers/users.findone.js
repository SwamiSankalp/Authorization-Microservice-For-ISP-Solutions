/*
 *
 * FETCHING THE DATA OF ONE USER
 *
 */

// DEPENDENCIES
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const User = require("../models/users");

module.exports = {
  getOne: (req, res) => {
    // DATABASE CONNECTION
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
        // LOG THE RESPONSE
        console.log("DATABASE CONNECTION STATUS : CONNECTED !!!");
        let result = {};
        let status = 200;
        if (!err) {
          // GET THE PAYLOAD FROM THE HEADERS
          const payload = req.decoded;
          // CHECK FOR THE REQUIRED TOKEN WITH ACCES PROVIDED USER
          if (payload && payload.user.useraccesslevel === 1) {
            User.findById({ _id: req.params.userid }, (err, user) => {
              if (!err) {
                result.status = status;
                result.error = err;
                result.result = user;
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
            // RESPONDS WHEN THERE IS NO TOKEN OR IF ITS INVALIDS
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
