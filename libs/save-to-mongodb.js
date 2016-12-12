var mongoose = require("mongoose");


var Recipe = require(__dirname + "/../model/recipe-model");
var scraper = require(__dirname + "/sites/scraper");

mongoose.connect("mongodb://localhost:27017/test");

/*
This method has problems. close with ctrl-z
TODO: find a batch save package, because mongoose is bad.
*/

scraper().then(function(recipeData) {
    recipeData.map(recipe => schemifyData(recipe))
        .map(recipe => {
            recipe.save(function() {
                return;
            });
        });
});

function schemifyData(recipe) {
    return new Recipe({
        name: recipe.recipeName,
        url: recipe.recipeLink,
        site: recipe.site
    });
}
