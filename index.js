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

main().then((result) => {
    console.log("connection successful");
}).catch((err) => {
	console.log(err)
    });



async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/abnb");
};

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs",ejsMate);


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.get('/',(req,res) => {
    res.send("App is working");
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

app.post('/listings',async (req,res) => {
    let {title,price,location,country,description} = req.body;
    let newPost = await List.insertOne({
	title:title,
	price:price,
	location:location,
	country:country,
	description:description,
    });

    newPost.save().then((result) => {
	res.redirect('/listings');
	console.log(result);
    }).catch((err) => {
	    console.log(err);
	});
});

app.get('/listings/:id/edit',async (req,res) => {
    let {id} = req.params;
    const editData = await List.findById(id);
    editData.save().then((result) => {
	res.render("editform.ejs",{result});
    }).catch((err) => {
	    console.log(err);
	});
});

app.patch('/listings',async (req,res) => {
    let {title,location,country,description,price} = req.body;

    let indiData = await List.findOneAndUpdate({title:title},{$set:{
     location:location,country:country,description:description,price:price}},{new:true,runValidators:true});
    console.log(indiData);
    res.redirect('/listings');
});

app.get('/listings/:id',(req,res) => {
    let {id} = req.params;
    async function getIndiData() {
	try{
	    let indiData = await List.findById(id);
	    return indiData;
	}
	catch(err) {
	    console.log(err);
	};
    }
    getIndiData().then((result) => {
	res.render("indidata.ejs",{result});
    }).catch((err) => {
	    console.log(err);
	});
});

app.delete('/listings/:id',(req,res) => {
    let {id} = req.params;
    List.findByIdAndDelete(id).then((result) => {
	console.log(result);
	res.redirect('/listings');
    }).catch((err) => {
	    console.log(err);
	});
});


//index route
app.get('/listings',(req,res) => {
    async function getListings(){
	try{
	    const listings = await List.find({});
	    return listings;
	}catch(err){
	    console.log(err);
	}
    }
    getListings().then((result) => {
	res.render("listings.ejs",{result});
    }).catch((err) => {
	console.log(err);
	res.send("Some problem occured!");
    });
});



app.listen(port,() => {
    console.log(`server listening through port ${port}`);
});

