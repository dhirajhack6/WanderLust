const express = require('express');
const wrapAsync = require('../utils/wrapAsync');

const ExpressError = require('../utils/expressError');

const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const listingController = require('../controllers/listings.js');
const router = express.Router();
const multer = require('multer');
const listings = require('../controllers/listings');

const { storage } = require('../cloudConfig.js');

const upload = multer({ storage });

console.log(Listing.reviews);
const {
  isLoggedIn,
  isOwner,
  validateListing,
  validateReview,
} = require('../middleware.js');

router.route('/').get(wrapAsync(listingController.index)).post(
  isLoggedIn,

  upload.single('listing[image]'),
  wrapAsync(listingController.createListing),
);

//New route
router.get('/new', isLoggedIn, listingController.renderNewForm);

// Show Route

router
  .route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,

    wrapAsync(listingController.updateListing),
  )
  .delete(
    isLoggedIn,
    isOwner,

    wrapAsync(listingController.destroyListing),
  );

// // Create Route
// router;

//Edit route
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

// //Update Route
// Router.put(
//   "/:id",
//   isLoggedIn,
//   validateListing,
//   isOwner,
//   wrapAsync(listingController.updateListing),
// );

// // Delete Route
// Router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,

//   wrapAsync(listingController.destroyListing),
// );

// Reviews
// Post  review Route

router.post(
  '/:id/reviews',
  isLoggedIn,
  validateReview,

  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log('new review saved');
    res.redirect(`/listings/${listing._id}`);
  }),
);

router.get('/category/:category', wrapAsync(listings.categoryFilter));

// Delete Review Route
router.delete(
  '/:id/reviews/:reviewId',
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
