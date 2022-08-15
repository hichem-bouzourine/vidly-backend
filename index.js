const winston = require("./startup/logging");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/database")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}`));
