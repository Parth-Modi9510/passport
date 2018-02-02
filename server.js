const express = require(`express`);
const mongoose = require(`mongoose`);
const bodyParser = require(`body-parser`);
const models = require(`./models`);
const passport = require(`passport`);
const strat = require(`passport-local`).Strategy;
const bcrypt = require(`bcryptjs`);
const Esession = require(`express-session`);
const jwt = require(`jsonwebtoken`);

mongoose.connect(`mongodb://localhost:27017/passportDB`);
let app=express();

app.use(Esession({secret:`shashvat`}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
    if(req.url==`/login` || req.url==`/logout`){
        next();
    }else {
        if (req.session.passport) {
            if (Object.keys(req.session.passport).length != 0) {
                next();
            }
            else {
                res.send(`you need to login first`);
            }
        } else {
            res.send(`you need to login first`);
        }

    }
});



passport.use(`abc`,new strat((username,password,done)=>{
    console.log(`asd`);
    //done(null,{username});
    models.UserModel.findOne({email:username}).then((doc)=>{
        console.log(`inside of passport.use`);
        //console.log(doc);
        if(doc) {
            bcrypt.compare(password, doc.password).then((result) => {

                if (result) {
                    return done(null, doc);
                }
                else {
                    return done(null, false);
                }

            }).catch((err) => {
                console.log(err.message);
                return done(null)
            });
        }else{
            return done(null,false);
        }
    })
}));
passport.serializeUser((user,done)=>{
    console.log(`serialize`);
    //console.log(user);
    user1=jwt.sign(user._doc,`shashvat`);
    //console.log(user1);
    done(null,user1);
});
passport.deserializeUser((user,done)=>{
    console.log(`deserialize`);
    user=jwt.verify(user,`shashvat`);
    done(null,user);
});
app.get(`/db`,(req,res)=>{
    console.log(req);
    console.log(`db`);
    models.UserModel.find({}).then((doc)=>{
         res.send(doc);
    }).catch((err)=>{res.status(400);res.send(err.message)});
});
app.post(`/reg`,(req,res)=>{
    console.log(`gg`);
    console.log(req.body);
    let newdata=new models.UserModel(req.body);
    newdata.save(newdata).then((done)=>{
        res.send(`you are registered!`);
    }).catch((err)=>{
        res.status(400);
        res.send(err.message);
    });
});
app.post(`/login`,passport.authenticate(`abc`,{
    successRedirect:`/done`,
    failureRedirect:`/fail`
}));
app.get(`/done`,(req,res)=>{
    console.log(`------------------------------------------------------------------------------------`);
    //console.log(req);
    res.send(`success`);
console.log(req.user);});
app.get(`/fail`,(req,res)=>{
    res.send(`fail`);});
app.get(`/logout`,(req,res)=>{
    req.logout();
    res.send(`logged out`);
    console.log(`logged out`);
    console.log(`logged out`);
});
app.listen(5497,()=>{console.log(`listening on port 5497`)});