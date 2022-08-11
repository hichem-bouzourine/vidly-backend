const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  if (!movies) return res.status(404).send("Movies not found");

  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send("Movie with the given ID could not be found");

  res.send(movie);
});

router.post("/", async (req, res) => {
  const result = validateMovie(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const result = validateMovie(req.body);
  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("Movie with the given ID could not be found.");
  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const result = await Movie.findByIdAndRemove(req.params.id);
  if (!result) return res.status(400).send("Movies not found");

  res.send(result);
});

module.exports = router;
