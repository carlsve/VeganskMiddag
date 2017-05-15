var express = require("express");
var mongoose = require("mongoose");
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('de5b7857b264f7d851bfbd18cadc9c1f');

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
      res.status(500).json({error:err });
    } else {
        console.log("Sent data: " + recipe);
        res.render('index', {
            link: recipe[0].url,
            recipe: recipe[0].name,
            title: recipe[0].name
        });
    }
    mixpanel.track('startpage_website');
}));


router.get("/gettoprated", function(req,res){
  Recipe.heighestRatedRecipes().then(function(recipes){
    res.status(200).json({recpies:recipes });
  });
  mixpanel.track('get_top_rated');
});

router.get("/ratepos",function(req,res){
  var id = req.query.id;
  Recipe.ratePos(id);
  res.status(200).json({success:true });
  mixpanel.track('rate_pos');
});

router.get("/rateneg",function(req,res){
  var id = req.query.id;
  Recipe.rateNeg(id);
  res.status(200).json({success:true });
  mixpanel.track('rate_neg');
});


router.get("/api", (req, res, next) => Recipe.findRandom((err, recipe) => {
  if (err) {
    res.status(500).json({error:err });
  } else {
    res.status(200).json({ recipe });
  }
  mixpanel.track('api_call');
}));

module.exports = router;
