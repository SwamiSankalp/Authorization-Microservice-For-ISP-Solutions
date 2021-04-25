/*
 *
 * DECLARING ALL ROUTES
 *
 */

const users = require("./users");

module.exports = (router) => {
  users(router);
  return router;
};
