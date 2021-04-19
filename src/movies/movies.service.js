const knex = require("../db/connection");

const moviesInTheaters = () => {
  return knex("movies as m")
    .distinct("m.*")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where("mt.is_showing", true);
}

const theatersShowingMovie = movieId => {
  return knex("theaters as t")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .distinct("t.theater_id")
    .join("movies_theaters as mt", "movie_id", movieId)
    .where("mt.movie_id", movieId)
    .andWhere("mt.is_showing", true);
}

const movieReviews = movieId => {
  return knex("reviews").select("*").where("movie_id", movieId);
}

const read = movieId => {
  return knex("movies")
    .select("*")
    .where("movie_id", movieId)
    .first();
}

const list = () => {
  return knex("movies").select("*");
}

module.exports = {
  moviesInTheaters,
  theatersShowingMovie,
  movieReviews,
  list,
  read,
}