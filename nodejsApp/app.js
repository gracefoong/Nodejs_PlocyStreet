var express = require("express");
var path = require("path");
var mongoose = require("mongoose");  // database
var cookieParser = require("cookie-parser"); // store information in the cookies
var bodyParser = require("body-parser"); //body parser is to get the objects the supplied when fill in form
var passport = require("passport"); // authentication
var session = require("express-session");
var flash = require("connect-flash");
var params = require("./params/params");


var setUpPassport = require("./setuppassport");

// var routes = require("./routes");

var app = express();
mongoose.connect(params.DATABASECONNECTION, {useUnifiedTopology:true, useNewUrlParser:true, useCreateIndex:true});
setUpPassport();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//body parser is to get the objects the supplied when fill in form
app.use(bodyParser.urlencoded({extended:false})); 
// store information in the cookies
app.use(cookieParser());
/* make session for instance used by passport
1. use for route to fetch the data 
2. use by passport */
app.use(session({
    secret:"dbNod3j2i8uw!90f6959fd",
    resave:false,
    saveUninitialized:false
}));

/* passport support authentication method for username and password using FB, Twitter, Google and etc.. 
API require token-based credentials to protect acces */
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use("/", require("./routes/web"));
app.use("/api", require("./routes/api"));

app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
})


