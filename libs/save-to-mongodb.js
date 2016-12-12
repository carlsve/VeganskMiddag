var mongoose = require("mongoose");


var Recipe = require(__dirname + "/../model/recipe-model");
var scraper = require(__dirname + "/sites/scraper");

/*
* Mongoose by default sets the auto_reconnect option to true.
* We recommend setting socket options at both the server and replica set level.
* We recommend a 30 second connection timeout because it allows for
* plenty of time in most operating environments.
*/
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
               replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

var mongodbUri = 'mongodb://admin:admin@ds053186.mlab.com:53186/veganrecipes';

mongoose.connect(mongodbUri, options);
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