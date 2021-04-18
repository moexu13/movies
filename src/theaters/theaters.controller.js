const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const list = async (req, res) => {
  const methodName = "theaters.list";
  const theaters = await service.list();
  req.log.debug({ __filename, methodName, theaters });

  for(const theater of theaters) {
    theater.movies = await service.moviesInTheaters(theater.theater_id);
  }

  req.log.debug({ __filename, methodName, theaters });
  res.json({ data: theaters });
}

module.exports = {
  list: asyncErrorBoundary(list),
}