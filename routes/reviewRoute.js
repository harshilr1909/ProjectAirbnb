const express = require('express');
const router = express.Router({mergeParams:true});
const asyncWrap = require('../utils/asyncWrap.js');
const Review = require('../models/Review.js');
const List = require('../models/listing.js');
const {validateReview} = require('../middlewares/validateReview.js');
const {loggedIn} = require('../middlewares/loggedInMW.js');
const {isAuthor} = require('../middlewares/isAuthor.js');


router.post('/',loggedIn,validateReview,asyncWrap(async (req,res) => {
    let{id} = req.params;
    let indiData = await List.findById(id).populate('reviews');
    let newReview = await Review.insertOne(req.body.review); 
    newReview.author = req.user._id;
    console.log(newReview);
    console.log(newReview.author);
    indiData.reviews.push(newReview);
    await newReview.save();
    await indiData.save();
    console.log(indiData);
    req.flash("success","Thanks for the review");
    res.redirect(`/listings/${id}`);
}));


router.get('/editReview/:reviewId',loggedIn,isAuthor,asyncWrap(async(req,res) => {
    let {id} = req.params;
    let{reviewId} = req.params;
    let currReview = await Review.findById(reviewId);
    console.log(currReview);
    if(!currReview){
	req.flash("error","post does not exist");
	return res.redirect('/listings');
    }
    res.render('editReview.ejs',{id,currReview});
}));

router.patch('/editReview/:reviewId',loggedIn,isAuthor,validateReview,asyncWrap(async(req,res) => {
    let {id} = req.params;
    let {reviewId} = req.params;
    let review = req.body.review;
    let updatedReview = await Review.findById(id);
    updatedReview = await Review.findByIdAndUpdate(reviewId,{...review},{runValidators:true},{new:true});
    console.log(updatedReview);
    if(!updatedReview){
	req.flash("error","post does not exist");
	return res.redirect('/listings');
    }
    req.flash("success","Review updated succesfully");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
