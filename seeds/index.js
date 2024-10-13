const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            author: '670591f189ca40e3a5641814',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea, ex sapiente earum hic minima possimus asperiores sunt, sint eaque suscipit quo a non! Perferendis ex eos facere tempore atque suscipit.',
            images: [
                {
                    url: 'https://res.cloudinary.com/dcluhfcou/image/upload/v1728830403/YelpCamp/q0nohbkmuqw2t00vi0b8.jpg',
                    filename: 'YelpCamp/q0nohbkmuqw2t00vi0b8'
                },
                {
                    url: 'https://res.cloudinary.com/dcluhfcou/image/upload/v1728830403/YelpCamp/bs3khguaqsltryx529o5.jpg',
                    filename: 'YelpCamp/bs3khguaqsltryx529o5'
                }
            ]
        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})