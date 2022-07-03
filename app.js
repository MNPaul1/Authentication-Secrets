//jshint esversion:6
// require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB")

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// console.log(process.env.SECRET)
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home")
})

app.get("/login", function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})
app.post("/login", (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, results){
        if (err){
            res.send(err);
        } else{
            if (results){
                bcrypt.compare(password, results.password, function(err, results){
                    if(!err){
                        if(results){
                            res.render("secrets");
                        }
                        else{
                                res.send("Wrong username and password")
                        }
                    }
                })
                // if (results.password === password){
                //     res.render("secrets")
                // }
                // else{
                //     res.send("Wrong username and password")
                // }
            }
            else{
                res.send("Wrong username and password")
            }
        }
    })
})

app.post("/register", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if (!err){
                res.render("secrets");
            } else{
                res.send(err);
            }
        });
    })
    });



app.listen(3000, function(){
    console.log("Server running on port 3000.")
})