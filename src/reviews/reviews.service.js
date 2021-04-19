const knex = require("../db/connection");

const read = reviewId => {
  return knex("reviews").where("review_id", reviewId).select("*").first();
}

const update = (updatedReview) => {
  return knex("reviews")
    .select("*")
    .where("review_id", updatedReview.review_id)
    .update(updatedReview, "*")
    .then(updatedRecords => updatedRecords[0]);
}

const destroy = reviewId => {
  return knex("reviews").where("review_id", reviewId).del();
}

module.exports = {
  read,
  destroy,
  update,
}