const listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// INDEX (with search functionality)
module.exports.index = async (req, res) => {
    const { search } = req.query;
    let allListings;

    if (search && search.trim() !== "") {
        const regex = new RegExp(search, "i"); // case-insensitive search
        allListings = await listing.find({
            $or: [
                { title: regex },
                { location: regex },
                { country: regex }
            ]
        });

        if (allListings.length === 0) {
            req.flash("error", "No listings found matching your search.");
            return res.redirect("/listings");
        }
    } else {
        allListings = await listing.find({});
    }

    res.render("./listings/index.ejs", { allListings, search });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

// SHOW LISTING
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    }).populate("owner");

    if (!Listing) {
        req.flash("error", "Listing you requested for doesn't exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { Listing, mapToken: process.env.MAP_TOKEN });
};

// CREATE LISTING
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id);
    if (!Listing) {
        req.flash("error", "Listing doesn't exist!");
        return res.redirect("/listings");
    }

    let originalUrl = Listing.image.url;
    let newUrl = originalUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { Listing, newUrl });
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = { url, filename };
        await Listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

// DELETE LISTING
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};
