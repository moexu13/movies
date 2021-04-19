const knex = require("../db/connection");

const list = () => {
  return knex("theaters as t")
    .select("t.theater_id", "t.name", "t.address_line_1", "t.address_line_2", "t.city", 
      "t.state", "t.zip", "t.created_at", "t.updated_at");
}

const moviesInTheaters = theaterId => {
  return knex("movies as m")
    .select("m.*")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where("mt.theater_id", theaterId);
}

module.exports = {
  list,
  moviesInTheaters,
}