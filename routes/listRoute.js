const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const List = require('../models/listing.js');
const CustomError = require('../utils/customError.js');
const asyncWrap = require('../utils/asyncWrap.js');
const {listingSchema} = require('../validateSchema/joiSchema.js');
const Review = require('../models/Review.js');

const validateList = (req,res,next) => {
    let {error,value} = listingSchema.validate(req.body);
    if(error) {
    let errMsg = error.details.map((el) => el.message ).join("");
    throw new CustomError(400,errMsg);
    }else{
    next();
    }
};

router.get('/new',(req,res) => {
    res.render("addnewplace.ejs");
});


router.post('/',validateList,asyncWrap(async (req,res,next) => {
    let list = req.body.list;
    console.log(list);
    const newPost = new List(list);
    await newPost.save();
	res.redirect('/listings');
    })
);


router.get('/:id/edit',asyncWrap(async (req,res) => {
    let {id} = req.params;
    const editData = await List.findById(id);
    res.render("editform.ejs",{editData,id});
}));

router.patch('/:id',asyncWrap(async (req,res) => {
    let {id} = req.params;
    let list = req.body.list;
    console.log(list);
    let indiData = await List.findByIdAndUpdate(id,{...list},{new:true,runValidators:true});
    console.log(indiData);
    res.redirect('/listings');
}));

router.get('/:id',asyncWrap(async(req,res,next) => {
    let {id} = req.params;
    let indiData = await List.findById(id).populate('reviews');
    res.render("indidata.ejs",{indiData});

}));

router.delete('/:id',(req,res,next) => {
    let {id} = req.params;
    List.findByIdAndDelete(id).then((result) => {
	console.log(result);
	res.redirect('/listings');
    }).catch((err) => {
	    next(err);
	});
});


//index route
router.get('/',asyncWrap(async(req,res,next) => {
	const listings = await List.find({});
	res.render("listings.ejs",{listings});

}));


module.exports = router;
