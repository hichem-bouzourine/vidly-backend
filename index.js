const winston = require("./startup/logging");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

require("./startup/routes")(app);
require("./startup/cors")(app);
require("./startup/database")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 3001;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}`)
);

module.exports = server;
