/*
TODO:
-add functionality for scraping multiple pages in one website
-add functionality for updating the require(vegan_links.json) and get new items
-make website responsive and style it
-maybe add functionality for adding websites with command line when server is running.

POTENTIAL PROBLEMS:

-unsure if scrapeUnscrapedRecipes works correctly, will probably start spazzing out when adding new web sites.
*/


var express = require('express');
var DatabasePackage = require('levelup');
var Database = DatabasePackage('./database');
var app = express();

// Register ejs as .html. If we did
// not call this, we would need to
// name our views foo.ejs instead
// of foo.html. The __express method
// is simply a function that engines
// use to hook into the Express view
// system by default, so if we want
// to change "foo.ejs" to "foo.html"
// we simply pass _any_ function, in this
// case `ejs.__express`.

app.engine('.html', require('ejs').__express);

// Optional since express defaults to CWD/views

app.set('index', __dirname + '/views');

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

app.use(express.static(__dirname + '/styles'));


// Dummy users
var randomnumber;
var recipeName = "";
var recipeLink = "";

app.get('/', function(req, res) {

  getAmountOfRecipes().then(function(amount) {

    randomnumber = Math.floor(Math.random() * amount);
    console.log("\nSent:\nrandom index position: " + randomnumber + " from a total index of: " + amount);

  }).then(function(recipe) {

    recipeName = recipe;
    console.log("name: " + recipeName);

    return getRecipeLink(randomnumber)
  }).then(function(link) {

    recipeLink = link;
    console.log("link: " + recipeLink);

    if (recipeName === undefined || recipeName === null) {

      recipeName = "Error! Inga recept i databasen, eller ingen databas.";
    }

    res.render('index', {

    title: "Vegansk middag",
    header: "Vad ska jag laga för mat idag?",
    link: recipeLink,
    recipe: recipeName
  });
});

});

app.listen(8080);
console.log('Express app started on port %d', 8080);
console.log("type 'help' for list of commands\n");

//promise function, resolves a recipe from its index in ./database
//with level db
var getRecipeName = function(index) {

  return new Promise(function(resolve, reject) {

    Database.get(), function(err, recipe) {
      resolve(recipe);
    })
  });
}

//promise function, resolves a link from its index in ./database
//with level db
var getRecipeLink = function(index) {

  return new Promise(function(resolve, reject) {

    Database.get(), function(err, link) {
      resolve(link);
    })
  });
}

//promise function, resolves size of database (based on index)
var getAmountOfRecipes = function() {

  return new Promise(function(resolve, reject) {

    Database.get("numberofrecipes", function (err, amount) {
    resolve(amount);
  });
});
}
