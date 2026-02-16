const express = require('express');
const router = express.Router({mergeParams:true});
const asyncWrap = require('../utils/asyncWrap.js');
const Review = require('../models/Review.js');
const {reviewSchema} = require('../validateSchema/joiSchema.js');
const CustomError = require('../utils/customError.js');
const List = require('../models/listing.js');

const validateReview =  (req,res,next) => {
    let {error,value} = reviewSchema.validate(req.body);
    if(error) {
    let errMsg = error.details.mao((el) => el.message).join("");
    throw new CustomError(400,errMsg);
    }else{
    next();
    }
};

router.post('/',validateReview,asyncWrap(async (req,res) => {
    let{id} = req.params;
    let indiData = await List.findById(id);
    let list = await indiData.populate();
    let newReview = await Review.insertOne(req.body.review); 
    console.log(newReview);
    indiData.reviews.push(newReview);
    await newReview.save();
    await list.save();
    console.log(indiData);
    res.redirect(`/listings/${id}`);
}));

router.get('/editReview/:reviewId',asyncWrap(async(req,res) => {
    let {id} = req.params;
    let{reviewId} = req.params;
    let currReview = await Review.findById(reviewId);
    console.log(currReview);
    res.render('editReview.ejs',{id,currReview});
}));

router.patch('/editReview/:reviewId',validateReview,asyncWrap(async(req,res) => {
    let {id} = req.params;
    let {reviewId} = req.params;
    let review = req.body.review;
    let updatedReview = await Review.findByIdAndUpdate(reviewId,{...review},{runValidators:true},{new:true});
    console.log(updatedReview);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
