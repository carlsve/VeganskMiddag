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
*/
router.get("/", (req, res, next) => Recipe.findRandom((err, recipe) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Sent data: " + recipe);
        res.render('index', {
            link: recipe[0].url,
            recipe: recipe[0].name,
            title: recipe[0].name
        });
    }
}));

module.exports = router;
