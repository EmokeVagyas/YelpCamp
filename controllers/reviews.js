const Campground = require('../models/campground');
const Review = require('../models/review');

const createReview = async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        const review = new Review(req.body.review);
        review.author = req.user._id;
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Created new review!');
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        console.log(e);
    }
};

const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports = { createReview, deleteReview }