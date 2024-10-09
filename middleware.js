const ExpressError = require('./utils/ExpressError');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        req.session.returnTo = req.originalUrl;
        console.log('isLoggedIn', req.session, req.originalUrl);

        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
};

const storeReturnTo = (req, res, next) => {
    console.log('storeReturnTo', req.session);

    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }

    next();
}

module.exports = { isLoggedIn, storeReturnTo };