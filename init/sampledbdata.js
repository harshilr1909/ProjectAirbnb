const initdata = require('./data.js');
const mongoose = require('mongoose');
const List = require('../models/listing.js');


main().then((result) => {
    console.log("connection successful from sampledata.js");
}).catch((err) => {
	console.log(err)
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/abnb");
};

let initDB = async() => {
    await List.deleteMany({});
    await List.insertMany(initdata.data);
};


initDB();
