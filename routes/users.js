const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();

router.use(express.json());

router.post("/", async (req, res) => {
  const result = validateUser(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ["id", "name", "email"]));
});

module.exports = router;
