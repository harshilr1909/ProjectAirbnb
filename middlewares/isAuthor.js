const Review = require('../models/Review.js');

module.exports.isAuthor = async(req,res,next) => { 
    let {id} = req.params;
    let {reviewId} = req.params;
    let currReview = await Review.findById(reviewId).populate('author');
    if(!currReview.author._id.equals(res.locals.currUser._id)){
	req.flash("error","You don't have the permission");
	return res.redirect(`/listings/${id}`);
    }
    next();
}
