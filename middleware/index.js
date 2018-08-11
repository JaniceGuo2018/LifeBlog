var middlewareObj={};
var Campground=require("../models/campground");
var Comment=require("../models/comment");

middlewareObj.checkCommentOwnership=function(req, res, next){
			
	if(req.isAuthenticated()){//is the user loggedin?

		Comment.findById(req.params.comment_id, function(err, foundComment){
			if (err) {res.redirect("/campgrounds");}
			else{
						 //does user own the comment?
				if (foundComment.author.id.equals(req.user._id)) { //foundcamp.author.id是一个mongoose对象，这里调用了mongoose的equals()
					next();
					}else{ res.redirect("back");}
				}
		});
		
		 
	}else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
};


middlewareObj.checkCampgroundOwnership=function(req, res, next){
		if(req.isAuthenticated()){//is the user loggedin?

			Campground.findById(req.params.id, function(err, foundcamp){
				if (err) {res.redirect("/campgrounds");}
				else{
					 //does user own the campground?
					 if (foundcamp.author.id.equals(req.user._id)) { //foundcamp.author.id是一个mongoose对象，这里调用了mongoose的equals()
					 	next();
					 }else{ 
					 	req.flash("error", "You don't have the permission to do that!"); 
					 	res.redirect("back");}
				}
			});
	
	 
	}else{
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn=function(req, res, next){ //protect the database
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Please Login First!"); //it works for the next request, then redirect
	res.redirect("/login");
};

module.exports=middlewareObj;