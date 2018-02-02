const mongoose = require(`mongoose`);
const bcrypt = require(`bcryptjs`);
const validator = require(`validator`);

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
    console.log(this);
    bcrypt.genSalt(10).then((salt)=>{
        return bcrypt.hash(this.password,salt);

    }).then((enc)=>{
        this.password=enc;
        next();
    }).catch((err)=>{console.log(err.message);next();});
});
let UserModel = mongoose.model(`userdata`,UserSchema);
module.exports={UserModel};//