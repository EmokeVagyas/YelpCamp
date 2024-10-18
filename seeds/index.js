const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({
        path: '../.env'
    });
}

console.log('process.env: ', process.env.DB_URL)

mongoose.connect(process.env.DB_URL)


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
        const city = cities[random1000];
        const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            author: '670591f189ca40e3a5641814',
            location: `${city.city}, ${city.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea, ex sapiente earum hic minima possimus asperiores sunt, sint eaque suscipit quo a non! Perferendis ex eos facere tempore atque suscipit.',
            images: [
                {
                    url: 'https://res.cloudinary.com/dcluhfcou/image/upload/v1728838045/YelpCamp/u73ubgr61t7boxjaced2.jpg',
                    filename: 'YelpCamp/u73ubgr61t7boxjaced2'
                },
                {
                    url: 'https://res.cloudinary.com/dcluhfcou/image/upload/v1728856216/YelpCamp/selwu3xfymeebbr299ym.jpg',
                    filename: 'YelpCamp/selwu3xfymeebbr299ym'
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [city.longitude, city.latitude]
            }
        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})