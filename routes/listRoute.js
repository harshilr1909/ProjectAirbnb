const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const List = require('../models/listing.js');
const CustomError = require('../utils/customError.js');
const asyncWrap = require('../utils/asyncWrap.js');
const {listingSchema} = require('../validateSchema/joiSchema.js');
const Review = require('../models/Review.js');
const {loggedIn} = require('../middlewares/loggedInMW.js');

const validateList = (req,res,next) => {
    let {error,value} = listingSchema.validate(req.body);
    if(error) {
    let errMsg = error.details.map((el) => el.message ).join("");
    throw new CustomError(400,errMsg);
    }else{
	next();
    }
};

router.get('/new',loggedIn,(req,res) => {
    console.log(req.user);
    res.render("addnewplace.ejs");
});


router.post('/',validateList,asyncWrap(async (req,res,next) => {
    let list = req.body.list;
    console.log(list);
    const newPost = new List(list);
    await newPost.save();
    req.flash("success","New post created successfully");
    res.redirect('/listings');
    })
);


router.get('/:id/edit',loggedIn,asyncWrap(async (req,res) => {
    let {id} = req.params;
    const editData = await List.findById(id);
    console.log(editData);
    if(!editData){
	req.flash("error","post cannot be updated");
	return res.redirect('/listings');
    }
    res.render("editform.ejs",{editData,id});
}));

router.patch('/:id',asyncWrap(async (req,res) => {
    let {id} = req.params;
    let list = req.body.list;
    console.log(id);
    console.log(list);
    let indiData = await List.findByIdAndUpdate(id,{...list},{new:true,runValidators:true});
    console.log(indiData);
    if(!indiData){
	req.flash("error","post cannot be updated");
	return res.redirect('/listings');
    }
    req.flash("success","Post updated successfully");
    res.redirect('/listings');
}));

router.get('/:id',asyncWrap(async(req,res,next) => {
    let {id} = req.params;
    let indiData = await List.findById(id).populate('reviews');
    if(!indiData){
	req.flash("error","post doesn't exist");
	return res.redirect('/listings');
    }
    res.render("indidata.ejs",{indiData});

}));

router.delete('/:id',asyncWrap(async(req,res,next) => {
    let {id} = req.params;
    let deletedData = await List.findByIdAndDelete(id).populate('reviews');
    console.log(deletedData);
    if(!deletedData){
	req.flash("error","post does not exist");
	return res.redirect('/listings');
    }
    req.flash("success","Listing deleted successfully");
    res.redirect('/listings');
}));


//index route
router.get('/',asyncWrap(async(req,res,next) => {
	const listings = await List.find({});
	res.render("listings.ejs",{listings});
}));


module.exports = router;
