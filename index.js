const express = require('express');
const app = express({mergeParams:true});
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const List = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const CustomError = require('./utils/customError.js');
const asyncWrap = require('./utils/asyncWrap.js');
const Review = require('./models/Review.js');
const {reviewSchema} = require('./validateSchema/joiSchema.js');
const listRoute = require('./routes/listRoute.js');
const reviewRoute = require('./routes/reviewRoute.js');

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



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.get('/',(req,res) => {
    res.render('home.ejs');
});

app.use('/listings',listRoute);
app.use('/listings/:id/reviews',reviewRoute);



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

