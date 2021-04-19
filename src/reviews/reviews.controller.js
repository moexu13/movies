const service = require("./reviews.service");
const criticsService = require("../critics/critics.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const reviewExists = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  return next({ status: 404, message: "Review cannot be found."});
}

const fillInTheBlanks = (req, res, updatedReview) => {
  const currentReview = res.locals.review;
  const currentKeys = Object.keys(currentReview);
  const updatedKeys = Object.keys(updatedReview);
  updatedKeys.forEach(key => {
    if (currentKeys.includes(key)) {
      currentReview[key] = updatedReview[key];
    } 
  });
  return currentReview;
}

const update = async (req, res) => {
  const updatedReview = { ...req.body.data };
  const methodName = "review.update";
  req.log.debug({ __filename, methodName, body: req.body });
    
  const review = fillInTheBlanks(req, res, updatedReview);
  await service.update(review);
  req.log.debug({ __filename, methodName, review });
  
  review.critic = await criticsService.read(review.critic_id);
  console.log("review", review);

  res.json({ data: review });
}

const destroy = async (req, res) => {
  await service.destroy(res.locals.review.review_id)
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
}