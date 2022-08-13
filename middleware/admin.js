function admin(req, res, next) {
  if (!req.user.isAdmin) return res.status(403).send("Access denied,");

  next();
}

module.exports = admin;

// 401 Unautorized
// 403 Forbidden
