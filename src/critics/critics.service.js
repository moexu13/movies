const knex = require("../db/connection");

const read = criticId => {
  return knex("critics").select("*").where("critic_id", criticId).first();
}

module.exports = {
  read,
}