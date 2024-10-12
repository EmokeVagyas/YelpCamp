const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const { required } = require('joi');
const Review = require('./models/review');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.session.returnTo = req.originalUrl;
        console.log('isLoggedIn', req.session, req.originalUrl);

        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
};

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campground/${id}`);
    }
    next();
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campground/${id}`);
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    console.log('storeReturnTo', req.session.returnTo);
    console.log('storeReturnTo RES: ', res.local?.returnTo);

    if (req.session.returnTo) {
        console.log('BEJOVOK IDE')
        res.locals.returnTo = req.session.returnTo;
    }

    console.log('2. storeReturnTo', req.session?.returnTo);
    console.log('2. storeReturnTo RES: ', res.local?.returnTo);

    next();
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


module.exports = { isLoggedIn, storeReturnTo, validateCampground, isAuthor, validateReview, isReviewAuthor };