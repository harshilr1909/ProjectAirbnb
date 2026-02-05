const express = require('express');
const { stat } = require('fs');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const { log, timeEnd } = require('console');
const List = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const CustomError = require('./utils/customError.js');
const asyncWrap = require('./utils/asyncWrap.js');
const Review = require('./models/Review.js');
const {listingSchema} = require('./validateSchema/joiSchema.js');
const {reviewSchema} = require('./validateSchema/joiSchema.js');

main().then((result) => {
    console.log("connection succesful");
}).catch((err) => {
	console.log(err)
    });



async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/abnb");
};

app.engine("ejs",ejsMate);

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const validateList = (req,res,next) => {
    let {error,value} = listingSchema.validate(req.body);
    if(error) {
    let errMsg = error.details.map((el) => el.message ).join("");
    throw new CustomError(400,errMsg);
    }else{
    next();
    }
};

const validateReview =  (req,res,next) => {
    let {error,value} = reviewSchema.validate(req.body);
    if(error) {
    let errMsg = error.details.mao((el) => el.message).join("");
    throw new CustomError(400,errMsg);
    }else{
    next();
    }
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.get('/',(req,res) => {
    res.render('home.ejs');
});

app.get('/test',(req,res) => {
    let list1 = new List({
	title:"Mera Ghar bc",
	description:"by the khaadi",
	price:6900,
	location:"NYC(Nalasopara You Cheapo)",
	country:"India",
    });

    list1.save().then((result) => {
	console.log("data saved");
    }).catch((err) => {
	    console.log("some problem in saving db");
	});
    res.send("Data stored");
});

app.get('/listings/new',(req,res) => {
    res.render("addnewplace.ejs");
});


app.post('/listings',validateList,asyncWrap(async (req,res,next) => {
    const newPost = new List({
	title:title,
	price:price,
	location:location,
	country:country,
	description:description,
    });
    await newPost.save();
	res.redirect('/listings');
    })
);


app.get('/listings/:id/edit',asyncWrap(async (req,res) => {
    let {id} = req.params;
    const editData = await List.findById(id);
    res.render("editform.ejs",editData);
}));

app.patch('/listings',asyncWrap(async (req,res) => {
    let {title,location,country,description,price} = req.body;

let indiData = await List.findOneAndUpdate({title:title},{$set:{
	location:location,country:country,description:description,price:price}},{new:true,runValidators:true});
    console.log(indiData);
    res.redirect('/listings');
}));

app.get('/listings/:id',asyncWrap(async(req,res,next) => {
    let {id} = req.params;
    let indiData = await List.findById(id).populate('reviews');
    res.render("indidata.ejs",{indiData});

}));

app.delete('/listings/:id',(req,res,next) => {
    let {id} = req.params;
    List.findByIdAndDelete(id).then((result) => {
	console.log(result);
	res.redirect('/listings');
    }).catch((err) => {
	    next(err);
	});
});


//index route
app.get('/listings',asyncWrap(async(req,res,next) => {
	const listings = await List.find({});
	res.render("listings.ejs",{listings});

}));

app.post('/listings/:id/reviews',validateReview,asyncWrap(async (req,res) => {
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


app.all('/{*splat}',(req,res,next) => {
    throw new CustomError(404,"Page Not Found");
});



app.use((err,req,res,next) => {
    let {status=500,message="Something went wrong!"} = err;
    res.render("error.ejs",{err});
});


app.listen(port,() => {
    console.log(`server listening through port ${port}`);
});

