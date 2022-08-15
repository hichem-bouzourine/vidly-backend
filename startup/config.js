const winston = require("./logging");
const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
  } else {
    winston.info(config.get("jwtPrivateKey"));
  }
};
