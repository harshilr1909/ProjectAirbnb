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
	    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxgCTG9JTKzZpd18J9JiCjNFXe98zWhyJMJw&s",
	    set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxgCTG9JTKzZpd18J9JiCjNFXe98zWhyJMJw&s" : v,
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
});

listSchema.post("findOneAndDelete",async(listing) => {
    await Review.deleteMany({_id :{$in: listing.reviews}});
});

const List = mongoose.model("List",listSchema);
module.exports = List;
