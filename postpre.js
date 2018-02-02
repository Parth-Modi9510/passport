const jwt=require(`jsonwebtoken`);
const mongoose = require(`mongoose`);
const model = require(`./testmodel`);

mongoose.connect(`mongodb://localhost/testdb`);

let savedata = (name,email,password)=>{
    let newdata = new model.UserModel({name,email,password});
    newdata.save().then((res)=>{}).catch((err)=>{});
};
let finddata=(name)=>{
    model.UserModel.findOne({name}).then((res)=>{}).catch((err)=>{console.log(err.message)});
};
 //savedata(`abc`,`abc.shashvat@gmail.com`,`abcdefg`);
finddata(`abc`);