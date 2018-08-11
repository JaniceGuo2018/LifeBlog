
var express=require("express"),
	app=express(),
	request=require("request"),
	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	// seedDB=require("./seed"),
	passport=require("passport"),
	LocalStrategy=require("passport-local"),
	User=require("./models/user"),
	Campground = require("./models/campground"),
	Comment   = require("./models/comment"),
	flash=require("connect-flash");

var methodOverride=require("method-override");

var campgroundRoutes=require("./routes/campgrounds"),
	commentRoutes=require("./routes/comments"),
	indexRoutes=require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp_num2");	
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");  //  ！！！要新建views\welcome.ejs 目录
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
// seedDB();

app.use(flash());

//passport configuration
app.use(require("express-session")({ //set up the session
	secret:"janice connects the session!",
	resave:false,
	saveUninitialized:false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});  //所有routes都以此为middleware!


//Routes
app.get("/", function(req, res){
	res.render("landing");
});



app.use(campgroundRoutes); //进一步简化：app.use("/campgrounds", campgroundRoutes) 在campground.js修改所有router.get/post("/")
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



// app.listen(8888, function(){
// 	console.log("Server is running on port 8888..");
// });

app.listen(process.env.PORT, process.env.IP);


// var parsedData=JSON.parse(body); //把json string转换为json对象
// General search: http://www.omdbapi.com/?s=guardians+of+the+galaxy&apikey=thewdb   //s--search by movie name
// Search with Movie ID: http://www.omdbapi.com/?i=tt3896198&apikey=thewdb  //i--id ---search by id
// &apikey=thewdb