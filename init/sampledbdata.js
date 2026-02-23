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
    initdata.data = initdata.data.map((obj) => ({...obj,owner:'6992fb420f8399117611b1e8'}));
    await List.insertMany(initdata.data);
};


initDB();
