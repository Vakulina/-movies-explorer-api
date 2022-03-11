const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 4,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 300,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: 'Передан некорректый URL',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: 'Передан некорректый URL',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: 'Передан некорректый URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 30,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 120,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 120,
  },
});

movieSchema.methods.toJSON = function noShowPassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
module.exports = mongoose.model('movie', movieSchema);
