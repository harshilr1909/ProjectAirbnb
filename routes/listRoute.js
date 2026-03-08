const express = require('express');
const router = express.Router();
const List = require('../models/listing.js');
const asyncWrap = require('../utils/asyncWrap.js');
const {loggedIn} = require('../middlewares/loggedInMW.js');
const {validateList} = require('../middlewares/validateList.js');
const {isOwner} = require('../middlewares/isOwner.js');
const multer  = require('multer')
const {storage} = require('../cloudconfig.js');
const upload = multer({storage});

router.get('/new',loggedIn,(req,res) => {
    console.log(req.user);
    res.render("addnewplace.ejs");
});

router.get('/beaches',asyncWrap(async(req,res) => {
    const listings = await List.find({});
    res.render("beachListings.ejs",{listings});
}));

router.get('/camping',asyncWrap(async(req,res) => {
    const listings = await List.find({});
    res.render("campingListings.ejs",{listings});
}));

router.get('/outdoors',asyncWrap(async(req,res) => {
    const listings = await List.find({});
    res.render("outdoorsListings.ejs",{listings});
}));

router.get('/snowy',asyncWrap(async(req,res) => {
    const listings = await List.find({});
    res.render("snowyListings.ejs",{listings});
}));

router.get('/cities',asyncWrap(async(req,res) => {
    const listings = await List.find({});
    res.render("citiesListings.ejs",{listings});
}));
router.get('/mountains',asyncWrap(async(req,res) => {
    const listings = await List.find({});
    res.render("mountainListings.ejs",{listings});
}));

router.get('/adventure',asyncWrap(async(req,res) => {
    const listings = await List.find({});
    res.render("adventureListings.ejs",{listings});
}));


router.post('/',upload.single('list[image]'),loggedIn,validateList,asyncWrap(async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let list = req.body.list;
    console.log(list);
    const newPost =  new List(list);
    newPost.owner = req.user._id;
    newPost.image = {url,filename};
    console.log(newPost);
    await newPost.save();
    req.flash("success","New post created successfully");
    res.redirect('/listings');
    })
);



router.get('/:id/edit',isOwner,loggedIn,asyncWrap(async (req,res) => {
    let {id} = req.params;
    const editData = await List.findById(id);
    console.log(editData);
    if(!editData){
	req.flash("error","post cannot be updated");
	return res.redirect('/listings');
    }
    res.render("editform.ejs",{editData,id});
}));

router.patch('/:id',upload.single('list[image]'),validateList,isOwner,loggedIn,
    asyncWrap(async (req,res) => {
	let {id} = req.params;
	let list = req.body.list;
	console.log(id);
	let indiData = await List.findById(id);
	indiData = await List.findByIdAndUpdate(id,{...list},{new:true,runValidators:true});
	if(!indiData){
	    req.flash("error","post cannot be updated");
	    return res.redirect('/listings');
	}
	if(typeof req.file !== "undefined") {
	    let url = req.file.path;
	    let filename = req.file.filename;
	    indiData.image = {url,filename};
	    await indiData.save();
	}
	console.log(indiData);
	req.flash("success","Post updated successfully");
	res.redirect('/listings');
    }));

router.get('/:id',asyncWrap(async(req,res,next) => {
    let {id} = req.params;
    let indiData = await List.findById(id).populate(
	{path :'reviews',populate:{path :'author'},}).populate('owner');
    if(!indiData){
	req.flash("error","post doesn't exist");
	return res.redirect('/listings');
    }
    res.render("indidata.ejs",{indiData});

}));


router.delete('/:id',isOwner,loggedIn,asyncWrap(async(req,res,next) => {
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

router.get('/',asyncWrap(async(req,res) => {
let listings = await List.find({});
res.render('listings.ejs',{listings});
}));


module.exports = router;
