const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const validator = require(`validator`);
const jwt = require(`jsonwebtoken`);

let UserSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:`given string is not a valid email address!`
        }
    },
    password:{
        type:String,
        require:true
    }
});
UserSchema.pre(`save`,function(next){

   this.password=jwt.sign(this.password,`shashvat`);
   console.log(this);
   next();
});
UserSchema.post(`findOne`,function(result,next){
    console.log(`as`);
    result.password=jwt.verify(result.password,`shashvat`);
    console.log(`gg:`);
    console.log(result);
    next();
});
let UserModel = mongoose.model(`userdata`,UserSchema);
module.exports={UserModel};//