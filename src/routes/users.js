/*
 *
 * ALL THE ROUTES FOR MODEL USER
 *
 */

// DECLARE ALL THE ROUTES
const addcontroller = require("../controllers/users.add");
const getcontroller = require("../controllers/users.getall");
const putcontroller = require("../controllers/users.update");
const logcontroller = require("../controllers/users.login");
const getonecontroller = require("../controllers/users.findone");
const { validateToken } = require("../../utils");

module.exports = (router) => {
  router.route("/users").post(addcontroller.add).get(getcontroller.getAll); // This route will be protected

  router
    .route("/users/:userid")
    .put(validateToken, putcontroller.update)
    .get(validateToken, getonecontroller.getOne);
  router.route("/login").post(logcontroller.login);
};
