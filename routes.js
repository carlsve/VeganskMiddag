var express = require("express");
var mongoose = require("mongoose");
var Recipe = require(__dirname + "/model/recipe-model");
var router = express.Router();
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init('de5b7857b264f7d851bfbd18cadc9c1f', {
    protocol: 'https'
});


router.get('/gettoplist', function(req,res){
  Recipe.heighestRatedRecipes().then(function(recipes){
      res.status(200).json(recipes);
  });
});

/*
This is the route for the main page of the webiste.
findRandom is a package, check models/recipe-model.js
for the package call.
*/
router.get("/", (req, res, next) => Recipe.findRandom((err, recipe) => {
    if (err) {
        console.log(err);
        mixpanel.track('home_page_ERROR');
        res.status(500).json({status:"fail", error:err});
    } else {
        console.log("Sent data: " + recipe);
        mixpanel.track('home_page');
        res.render('index', {
            link: recipe[0].url,
            recipe: recipe[0].name,
            title: recipe[0].name
        });
    }
}));

// Route for rating a recipe (+1)
router.get("/ratepos",function(req,res){
  var id = req.query.id;
  Recipe.ratePos(id);
  res.status(200).json({success:true });
  mixpanel.track('rate_pos');

});
// Route for rating a recipe (-1)
router.get("/rateneg",function(req,res){
  var id = req.query.id;
  Recipe.rateNeg(id);
  mixpanel.track('rate_neg');
  res.status(200).json({success:true });
});

// Route for getting a json with a recipe
router.get("/api", (req, res, next) => Recipe.findRandom((err, recipe) => {
  if (err) {
    console.log(err);
    mixpanel.track('api_call_ERROR');
    res.status(500).json({status:"fail", error: err});
  } else {
    mixpanel.track('api_call');
    res.status(200).json({ recipe });
  }
}));

module.exports = router;
