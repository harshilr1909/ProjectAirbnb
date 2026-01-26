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

main().then((result) => {
    console.log("connection successful");
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

app.post('/listings',asyncWrap(async (req,res,next) => {
    let {title,price,location,country,description} = req.body;
    if(!title || !price || !location || !country || !description){
	throw new CustomError(400,"Send Valid Input");
    }	
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
    let indiData = await List.findById(id);
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



app.use((err,req,res,next) => {
    let {status=500,message="Something went wrong!"} = err;
    res.status(status).send(message);
});


app.listen(port,() => {
    console.log(`server listening through port ${port}`);
});

