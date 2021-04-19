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

const createUpdatedReview = (req, res, updatedReview) => {
  const currentReview = res.locals.review;
  const methodName = "reviews.createUpdatedReview";
  req.log.debug({ __filename, methodName, updatedReview: updatedReview });

  const currentKeys = Object.keys(currentReview);
  const updatedKeys = Object.keys(updatedReview);
  updatedKeys.forEach(key => {
    if (currentKeys.includes(key)) {
      currentReview[key] = updatedReview[key];
    } 
  });

  req.log.debug({ __filename, methodName, currentReview: currentReview });
  return currentReview;
}

const update = async (req, res) => {
  const updatedReview = { ...req.body.data };
  const methodName = "reviews.update";
  req.log.debug({ __filename, methodName, body: req.body });
    
  const review = createUpdatedReview(req, res, updatedReview);
  await service.update(review);
  req.log.debug({ __filename, methodName, review });
  
  review.critic = await criticsService.read(review.critic_id);

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