/*
 *
 * ADDING USER TO THE DATABASE CONTROLLER
 *
 */

// DEPENDENCIES
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const User = require("../models/users");

module.exports = {
  add: (req, res) => {
    // DATABASE CONNECTION
    mongoose.connect(
      connUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 201;
        if (!err) {
          // REQUIRED FIELDS
          const username = req.body.username;
          const password = crypto.randomBytes(8).toString("hex");
          const useraccesslevel = "1";
          const uniqueid = crypto.randomBytes(8).toString("hex");
          const registeredby = "Sankalp";
          const credits = "000";
          //CREATING A NEW USER OBJECT
          const user = new User({
            username: username,
            password: password,
            useraccesslevel: useraccesslevel,
            uniqueid: uniqueid,
            registeredby: registeredby,
            credits: credits,
          }); // document = instance of a model
          // TODO: We can hash the password here as well before we insert
          // SAVE THE USER TO THE DATABASE
          user.save((err, user) => {
            if (!err) {
              result.status = status;
              result.result = user;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
            // CLOSE THE CONNECTION
            mongoose.connection.close();
          });
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);

          mongoose.connection.close();
        }
      }
    );
  },
};
