const mongoose = require('mongoose');
const Review = require('./Review.js');
const { required } = require('joi');

let listSchema = new mongoose.Schema({
    title:{
	type:String,
	required:true,
    },
    description:{
	type:String,
	required:true,
    },
    image:{
	filename:{
	    type:String,
	},
	url:{
	    type:String,
	},
    },
    price:{
	type:Number,
	required:true,
    },
    location:{
	type:String,
	required:true,
    },
    country:{
	type:String,
	required:true,
    },
    reviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review",
    }],
    owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    },
    category:{
	type:String,
	enum: ["beaches","mountains","outdoors","camping","snowy","adventure"],
    },
});

listSchema.post("findOneAndDelete",async(listing) => {
    await Review.deleteMany({_id :{$in: listing.reviews}});
});

const List = mongoose.model("List",listSchema);
module.exports = List;
