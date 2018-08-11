var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware/index");

router.get("/campgrounds",function(req, res){
	Campground.find({}, function(err,campgrounds){
		if (err) {console.log(err);}
		else{
			res.render("campgrounds/campgrounds",{campgrounds:campgrounds, currentUser: req.user}); //req.user: only the logined user
		}
	})
	
});

//CREATE - ADD NEW CAMPGROUNDS
router.post("/campgrounds",function(req, res){
	// res.send("you hit the post route!");
	var name=req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc=req.body.description;
	var author={
		id:req.user._id,
		username: req.user.username
	};
	var newCampground={name:name, price:price, image:image, description:desc, author:author};
	// console.log(newCampground.name);
	//Create a new campground and save it to mongodb
	Campground.create(newCampground,function(err,newcamp){
		if (err) {
			console.log(err);
		}else{
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	})

});

//NEW - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});


//SHOW - 
router.get("/campgrounds/:id", function(req, res){
	//find the campground with provided ID
	var id=req.params.id;
	Campground.findById(id).populate("comments").exec(function(err, foundcamp){
		if (err) {console.log(err);}
		else{
			console.log(foundcamp);
			res.render("campgrounds/show", {campground:foundcamp});
		}
	});
	//render show template with that campground
	
});

//Edit campground route
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundcamp){			
				 //foundcamp.author.id是一个mongoose对象，这里调用了mongoose的equals()
			res.render("campgrounds/edit",{campground:foundcamp});
		});
});


//update campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground

	Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err, updatedCampground){
		if(err){res.redirect("/campgrounds");}
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});

	//redirect to that edited campground
});

//destroy campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {res.redirect("/campgrounds");}
		else{res.redirect("/campgrounds");}
	});
	
})



module.exports=router;