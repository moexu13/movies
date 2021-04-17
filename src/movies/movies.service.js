const knex = require("../db/connection");

const moviesInTheaters = () => {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where("mt.is_showing", true)
    .distinct("m.*");
}

const theatersShowingMovie = movieId => {
  return knex("theaters as t")
    .join("movies_theaters as mt", "movie_id", movieId)
    .where("mt.movie_id", movieId)
    .andWhere("mt.is_showing", true)
    .distinct("t.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id");
}

const movieReviews = movieId => {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .where("r.movie_id", movieId)
    .select("r.*");
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