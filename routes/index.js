var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");
//Auth route
//show sign up parouter.get("/register", function(req, res){


router.get("/register", function(req, res){
	
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
	var newUser=new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			// console.log(err);
			req.flash("error", err.message);
			return res.render("register");}
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp, "+ user.username);
				res.redirect("/campgrounds");
		});
	});
});

//Login
//show login form app.post("/login", middleware, callback function)
router.get("/login", function(req, res){
	
	res.render("login");
	
});

router.post("/login", passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}), function(req, res){
	req.flash("success", "You've successfully logged in!");
});

//logout
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");//onr-time thing, if you refresh page, it goes away| first param is a key, its name does not matter!
	res.redirect("/campgrounds");
});


module.exports=router;
