const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const movieExists = async (req, res, next) => {
  const { movieId } = req.params;

  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: "Movie cannot be found." });
}

const theatersShowingMovie = async (req, res) => {
  const response = await service.theatersShowingMovie(res.locals.movie.movie_id);
  res.json({ data: response });
}

const movieReviews = async (req, res) => {
  const methodName = "movies.movieReviews";
  const reviews = await service.movieReviews(res.locals.movie.movie_id);
  req.log.debug({ __filename, methodName, reviews });
  
  for (const review of reviews) {
    review.critic = await service.movieCritics(review.critic_id);
  }
  req.log.debug({ reviews });
  
  res.json({ data: reviews });
}

const read = async (req, res) => {
  const response = await service.read(res.locals.movie.movie_id);
  res.json({ data: response });
}

const list = async (req, res) => {
  const { is_showing } = req.query;
  const methodName = "movies list";
  req.log.debug({ __filename, methodName, query: req.query });

  let response;
  if (!is_showing) {
    response = await service.list();
  } else {
    response = await service.moviesInTheaters();
  }

  req.log.debug({ "response": response });
  res.json({ data: response });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  theatersShowingMovie: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theatersShowingMovie)],
  movieReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(movieReviews)],
}