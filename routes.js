var express = require("express");
var mongoose = require("mongoose");
var Recipe = require(__dirname + "/model/recipe-model");
var router = express.Router();

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

/*
This is the route for the main page of the webiste.
findRandom is a package, check models/recipe-model.js
for the package call.
*/
router.get("/", (req, res, next) => Recipe.findRandom((err, recipe) => {
    if (err) {
        console.log(err);
        res.status(500).json({status:"fail", error:err});
    } else {
        console.log("Sent data: " + recipe);
        res.render('index', {
            link: recipe[0].url,
            recipe: recipe[0].name,
            title: recipe[0].name
        });
    }
}));

router.get("/ratepos",function(req,res){
  var id = req.query.id;
  Recipe.ratePos(id);
  res.status(200).json({success:true });
});

router.get("/rateneg",function(req,res){
  var id = req.query.id;
  Recipe.rateNeg(id);
  res.status(200).json({success:true });
});


router.get("/api", (req, res, next) => Recipe.findRandom((err, recipe) => {
  if (err) {
    console.log(err);
    res.status(500).json({status:"fail", error: err});
  } else {
    res.status(200).json({ recipe });
  }
}));

module.exports = router;
