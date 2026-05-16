const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params; // id comes from app.js mount path

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted');

  return res.redirect(`/listings/${id}`);
};
