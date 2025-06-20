const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.postReview=async (req, res) => {
    let Listing = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${Listing._id}`);
}

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}