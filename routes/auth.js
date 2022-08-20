const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.use(express.json());

router.post("/", async (req, res) => {
  // TODO: Login the user!
  const result = validate(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  let user = await User.findOne({ email: req.body.email.trim() }); // search for the existence of the user by his unique email.
  if (!user) return res.status(400).send("Invalid email or password"); // if he doesn't exist in the DB, we return a failure

  const validPassword = await bcrypt.compare(req.body.password, user.password); //
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();
  res.send(token); // when the user register we response with the JWT.
});

function validate(req) {
  const Schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email().trim(),
    password: Joi.string().min(5).max(255).required(),
  });
  return Schema.validate(req);
}

module.exports = router;
