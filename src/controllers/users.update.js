/*
 *
 *  UPDATE THE USER DATA
 *
 */

// DEPENDENCIES
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const User = require("../models/users");

module.exports = {
  update: (req, res, name) => {
    mongoose.connect(
      connUri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      (err) => {
        let result = {};
        let status = 200;
        if (!err) {
          // REQUIRED FIELDS
          const username = req.body.username;
          const email = req.body.email;
          const credits = req.body.credits;

          User.findOneAndUpdate(
            { _id: req.params.userid },
            { username: username, email: email, credits: credits },
            (err, user) => {
              if (!err && user) {
                status = 200;
                result.status = status;
                result.result = user;
                res.status(status).send(result);
              } else {
                status = 404;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
              }
            }
          ).then(() => mongoose.connection.close());
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
