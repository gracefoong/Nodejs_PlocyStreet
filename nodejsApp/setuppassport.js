// to set up passport that which information have to be authenticate
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

// serializerUser is to determine that which data of user object should be store in this session 
module.exports = function (){
    //turn a user object into an id
    passport.serializeUser(function (user, done) {
        //serializing the user
        done(null, user._id);
    });

    //turn the id into user object
    passport.deserializeUser(function(id, done){
        User.findById(id, function(error, user){
            done(error, user);
        });
    });

    // set up the passsport with the login strategy
    passport.use("login", new LocalStrategy({
        usernameField:'email',
        passwordField: 'password'        
    }, function(email, password, done){
        User.findOne({email: email}, function(error, user){
            if(error){ return done(error); }
            if(!user){
                return done(null, false, {message:"This Email doesn't exists!"});
            }
            user.checkPassword(password, function(error, isMatch){
                if (error) {return done(error); }
                if (isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message:"Invalid password"});
                }
            });
        });
    }));
}



