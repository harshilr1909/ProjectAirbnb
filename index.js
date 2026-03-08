if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const CustomError = require('./utils/customError.js');
const listRoute = require('./routes/listRoute.js');
const reviewRoute = require('./routes/reviewRoute.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRoute = require('./routes/userRoute.js');
const { MongoStore } = require("connect-mongo");
const dbUrl = process.env.ATLAS_URL;



main().then((result) => {
    console.log("connection succesful");
}).catch((err) => {
	console.log(err)
    });



async function main() {
    await mongoose.connect(dbUrl);
};

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
	secret:process.env.SECRET,
    },
    touchAfter : 24 * 60 * 60,
});

const sessionOptions = {
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
	expires:Date.now() + 7 *24 * 60 * 60 *1000,
	maxAge:7 *24*60*60*1000,
	httpOnly:true,
    }
};

app.engine("ejs",ejsMate);

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


app.get('/demoUser',async(req,res) => {
    let tpUser = new User({
	email:"Baburao@gmail.com",
	username:"Baburao",
    });
    let result = await User.register(tpUser,"Kutrya");
    console.log(result);
    res.send("User stored");
});

app.use('/listings',listRoute);
app.use('/listings/:id/reviews',reviewRoute);
app.use('/',userRoute);



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

