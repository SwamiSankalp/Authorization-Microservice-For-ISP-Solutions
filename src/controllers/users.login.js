/*
 *
 *  LOGIN FEATURE
 *
 */

// DEPENDENCIES
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connUri = process.env.MONGO_LOCAL_CONN_URL;
const User = require("../models/users");

module.exports = {
  login: (req, res) => {
    const { username, password } = req.body;

    mongoose.connect(
      connUri,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        let result = {};
        let status = 200;
        if (!err) {
          User.findOne({ username }, (err, user) => {
            if (!err && user) {
              // We could compare passwords in our model instead of below as well
              bcrypt
                .compare(password, user.password)
                .then((match) => {
                  if (match) {
                    status = 200;
                    // Create a token
                    const payload = { user: user };
                    const options = {
                      expiresIn: "2d",
                      issuer: "secretjsonissuer",
                    };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret, options);

                    result.token = token;
                    result.status = status;
                    result.result = user;
                    console.log(payload.user.username);
                  } else {
                    status = 401;
                    result.status = status;
                    result.error = `Authentication error`;
                  }
                  res.status(status).send(result);
                })
                .catch((err) => {
                  status = 500;
                  result.status = status;
                  result.error = err;
                  console.log("1st", err);
                  res.status(status).send(result);

                  mongoose.connection.close();
                });
            } else {
              status = 404;
              result.status = status;
              result.error = err;
              console.log(err);
              res.status(status).send(result);
            }
          }).then(() => mongoose.connection.close());
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          console.log("2", err);
          res.status(status).send(result);

          mongoose.connection.close();
        }
      }
    );
  },
};
