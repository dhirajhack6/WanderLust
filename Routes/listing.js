const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Router = express.Router();
const ExpressError = require("../utils/expressError");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const listingController = require("../controllers/listings.js");

console.log(Listing.reviews);
const {
  isLoggedIn,
  isOwner,
  validateListing,
  validateReview,
} = require("../middleware.js");

// Index Route
Router.get("/", wrapAsync(listingController.index));


//New route
Router.get("/new", isLoggedIn, listingController.renderNewForm);
  console.log("STEP 2: after isLoggedIn");

// Show Route
Router.get("/:id", wrapAsync(listingController.showListing));


// Create Route
Router.post(
  "/",
  isLoggedIn,

  // validateListing,
  wrapAsync(listingController.creatListing),
);

//Edit route
Router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

//Update Route
Router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  isOwner,
  wrapAsync(listingController.updateListing),
);

// Delete Route
Router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,

  wrapAsync(listingController.destroyListing),
);

// Reviews
// Post  review Route

Router.post(
  "/:id/reviews",
  isLoggedIn,
  validateReview,

  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
  }),
);

// Delete Review Route
Router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = Router;
