const mongoose = require('mongoose');

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
    review:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review"
    }],
});

const List = mongoose.model("List",listSchema);
module.exports = List;
