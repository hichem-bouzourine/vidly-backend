const auth = require("../middleware/auth");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/me", auth, async (req, res) => {
  // router to get the user's information (exclude the password !).
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  // register a user
  const result = validateUser(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User Already registered."); // Search for the existence of user in the DB.

  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt); // Hash the password and assign the encrypted password
  //                                                         to the user obj before saving it to the DB.

  await user.save();

  const token = user.generateAuthToken(); // create a web token.
  // send the token in header in order to save the user's informations after registering.
  res.header("x-auth-token", token).send(_.pick(user, ["id", "name", "email"]));
});

module.exports = router;
