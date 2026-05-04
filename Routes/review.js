const express = require("express");
const Router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const { validateListing } = require("../middleware")
const { validateReview , isLoggedIn, isReviewAuthor } = require("../middleware.js");

// Post Review Route

Router.post(
  "/",
   isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    console.log(req.params.id);
    let { id } = req.params;

    let listing = await Listing.findById(id);

    let newReview = new Review(req.body.review);
    newReviews.author = req.user._id
    console.log(newReviews);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  }),
);

// Delete Review
Router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params; // id comes from app.js mount path

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");

    res.redirect(`/listings/${id}`);
    
  }),
);

module.exports = Router;
