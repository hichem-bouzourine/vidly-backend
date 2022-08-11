const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
    required: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
  const Schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return Schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validateMovie = validateMovie;
