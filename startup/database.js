const mongoose = require("mongoose");
const winston = require("./logging");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost/vidly")
    .then(() => winston.info("Connected to the database"));
};
