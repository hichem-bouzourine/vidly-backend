const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const { Genre, validateGenre } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/", async (req, res, next) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("Genre with the given ID could not be found.");

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const result = validateGenre(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  await genre.save();
  res.send(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  // validate it
  const result = validateGenre(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);
  // find the genre
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre)
    return res.status(404).send("Genre with the given ID could not be found.");
  // send it
  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("Genre with the given ID could not be found.");

  res.send(genre);
});

module.exports = router;
