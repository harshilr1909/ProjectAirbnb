require('dotenv').config({path:"/home/harshil/ProjectAirbnb/.env"});
const initdata = require('./data.js');
const mongoose = require('mongoose');
const {MongoStore} = require('connect-mongo');
const List = require('../models/listing.js');
const dbUrl = process.env.ATLAS_URL;


main().then((result) => {
    console.log("connection successful from sampledata.js");
}).catch((err) => {
	console.log(err)
    });

async function main(){
    await mongoose.connect(process.env.ATLAS_URL);
};

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
	secret:process.env.SECRET,
    },
    touchAfter : 24 * 60 * 60,
});

let initDB = async() => {
    await List.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj,owner:'6992fb420f8399117611b1e8'}));
    await List.insertMany(initdata.data);
};


initDB().then(() => {
    process.exit(0);
});
