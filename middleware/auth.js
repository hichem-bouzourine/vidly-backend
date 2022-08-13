const jwt = require("jsonwebtoken");
const config = require("config");
// authorization by decoding the JWT
// we will use this method to secure our API routes
function auth(req, res, next) {
  const token = req.header("x-auth-token"); // get the token from the header of the request.
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = auth;
