/*
 *
 * USER DATABASE SCHEMA
 *
 */

// DEPENDENCIES
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const environment = process.env.NODE_ENV;
const stage = require("../../config");

// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  useraccesslevel: {
    type: String,
    required: true,
    trim: true,
  },
  uniqueid: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  createdat: {
    type: Date,
    required: true,
    trim: true,
    default: Date.now,
  },
  updatedat: {
    type: Date,
    required: true,
    trim: true,
    default: Date.now,
  },
  credits: {
    type: Number,
    trim: true,
    required: true,
  },
  registeredby: {
    type: String,
    required: true,
    trim: true,
  },
});

// encrypt password before save
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified || !user.isNew) {
    next();
  } else {
    bcrypt.hash(
      user.password,
      stage.development.saltingRounds,
      function (err, hash) {
        if (err) {
          console.log("Error hashing password for user", user.name);
          next(err);
        } else {
          user.password = hash;
          next();
        }
      }
    );
  }
});

// EXPORT THE MODULE
module.exports = mongoose.model("User", userSchema); // instance of schema
