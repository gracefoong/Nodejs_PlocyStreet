var bcrypt = require("bcryptjs"); // hash password/ better performence of javascript
var mongoose = require("mongoose");

const SALT_FACTOR = 10

var userSchema = mongoose.Schema({
    username:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:false},
    createdAt:{type:Date, default:Date.now}
});

// To save the password, modified, and hash the password
userSchema.pre("save", function(done){
    var user = this;

    if(!user.isModified("password")){
        return done();
    }

    bcrypt.genSalt(SALT_FACTOR, function(error,salt){
        if(error){return done(error);}
        bcrypt.hash(user.password, salt, function (error, hashedPassword){
            if(error){return done(error);}
            user.password = hashedPassword;
            done();
        });
    });
});

// decrypt compare is compare the password supplied in textual form with hash password save in db
userSchema.methods.checkPassword = function(guess,done){
    if(this.password != null){
        bcrypt.compare(guess,this.password, function(error,isMatch){
            done(error,isMatch);
        });
    }
}
var User =  mongoose.model("User", userSchema);

module.export = User;
