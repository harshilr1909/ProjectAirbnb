const mongoose = require('mongoose');

main().then((result) => {
    console.log("review connection successful");
}).catch((err) => {
	console.log(err);
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/abnb');
}

const reviewSchema = new mongoose.Schema({
    comments:{
	type:String,
    },
    ratings:{
	type:Number,
	min:1,
	max:5,
    },
    createdAt:{
	type:Date,
	default:Date.now(),
    },
    author:{
	type:mongoose.Schema.Types.ObjectId,
	ref:"User",
    }
});

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;
