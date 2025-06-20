const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const reviewController = require("../controllers/reviewController.js");
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");


// post route

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

//delete route

router.delete("/:reviewId", isAuthor, isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;