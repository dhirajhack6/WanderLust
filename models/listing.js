const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },

  image: {
    type: String,
    default:
      "https://i.pinimg.com/1200x/60/48/03/604803ad0776fb5e4693c6f869327fe9.jpg",
    set: (v) =>
      v === ""
        ? "https://i.pinimg.com/1200x/60/48/03/604803ad0776fb5e4693c6f869327fe9.jpg"
        : v,
  },
  
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ]
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
