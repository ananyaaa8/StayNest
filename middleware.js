const listing = require("./models/listing");
const review=require("./models/review.js");
const ExpressError = require("./utils/expresserror");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
}

// when passport.authenticate is called it clears the session object so we will save the redirecturl in locals as this function do not 
// have the access to the locals

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if (!Listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are't the owner of the listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();

}

module.exports.isAuthor=async(req,res,next)=>{
    let { id, reviewId} = req.params;
    let Review = await review.findById(reviewId);
    if (!Review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are't the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();

}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}