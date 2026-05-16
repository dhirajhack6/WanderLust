const express = require('express');
const Router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError');

const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require('../middleware.js');

const reviewsController = require('../controllers/reviews.js');

// Post Review Route

Router.post(
  '/',
  isLoggedIn,
  validateReview,
  wrapAsync(reviewsController.createReview),
);

// Delete Review
Router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewsController.destroyReview),
);

module.exports = Router;
