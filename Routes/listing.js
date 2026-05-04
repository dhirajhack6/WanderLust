const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Router = express.Router();
const ExpressError = require("../utils/expressError");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

console.log(Listing.reviews);
const {
  isLoggedIn,
  isOwner,
  validateListing,
  validateReview,
} = require("../middleware.js");



// Index Route
Router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  }),
);

//New route
Router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
Router.get("/:id", async (req, res) => {
  let { id } = req.params;
  id = id.trim();
  
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
    
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
  
});

// Create Route
Router.post(
  "/",
  isLoggedIn,

  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newReviews.author = req.user._id; 
    
    await newReviews.save();
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }),
);

//Edit route
Router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  },
);

//Update Route
Router.put("/:id", isLoggedIn, validateListing, isOwner, async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
});

// Delete Route
Router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,

  async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  },
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
    console.log(listing.reviews);

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
