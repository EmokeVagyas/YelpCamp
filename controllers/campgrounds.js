const Campground = require('../models/campground');
const cloudinary = require('cloudinary').v2;
const { Client } = require('@googlemaps/google-maps-services-js')

const client = new Client({});

const index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

const renderNewForm = (req, res) => {
    res.render('campgrounds/new')
};

const createCampground = async (req, res, next) => {
    const address = req.body.campground.location;
    const geoResponse = await client.geocode({
        params: {
            address: address,
            key: process.env.GOOGLE_MAPS_API_KEY
        }
    });

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;

    const locationData = geoResponse.data.results[0].geometry.location;
    campground.geometry = {
        type: 'Point',
        coordinates: [locationData.lng, locationData.lat]
    };

    await campground.save();
    console.log(campground);

    req.flash('success', 'Successfully made a new campground!');
    return res.redirect(`/campgrounds/${campground._id}`)
};

const showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
};

const renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find campground!');
        return res.redirect('/cmpgrounds')
    }
    res.render('campgrounds/edit', { campground })
};

const updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages && req.body.deleteImages.length > 0) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
            campground.images = campground.images.filter(img => img.filename !== filename);
        }
        await campground.save();
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};

const deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds')
};

module.exports = { index, renderNewForm, createCampground, showCampground, renderEditForm, updateCampground, deleteCampground }