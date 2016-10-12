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
app.use(express.static(__dirname + '/images'));


// Dummy users
var randomIndex = 0;
var pendingWebsite = "";
var siteList = [];
var recipeName = "";
var recipeLink = "";

app.get('/', function(req, res) {

  getListOfScrapedWebsites().then(function(rawSiteListValue) {

    siteList = rawSiteListValue.split(",");
    pendingWebsite = siteList[Math.floor(Math.random() * siteList.length)]
    console.log("\nChosen website " + pendingWebsite + ", from list of " + siteList);

    return getAmountOfRecipesFromWebsite(pendingWebsite)
  }).then(function(amount) {

    randomIndex = Math.floor(Math.random() * amount);

    return getRecipeName(pendingWebsite, randomIndex)
  }).then(function(recipe) {

    recipeName = recipe;
    console.log("name: " + recipeName);

    return getRecipeLink(pendingWebsite, randomIndex)
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
var getRecipeName = function(website, index) {
  return new Promise(function(resolve, reject) {
    Database.get((website + index), function(err, recipe) {
      resolve(recipe);
    })
  });
}

//promise function, resolves a link from its index in ./database
//with level db
var getRecipeLink = function(website, index) {
  return new Promise(function(resolve, reject) {
    Database.get((website + "link" + index), function(err, link) {
      resolve(link);
    });
  });
}

/*
Get the list of the websites that are scraped
*/
var getListOfScrapedWebsites = function() {
  return new Promise(function(resolve, reject) {
    Database.get("sitelist", function(err, siteList) {
      resolve(siteList);
    });
  });
}

//promise function, resolves size of database (based on index)
var getAmountOfRecipesFromWebsite = function(website) {
  return new Promise(function(resolve, reject) {
    Database.get((website + "recipeamt"), function (err, amount) {
      resolve(amount);
    });
  });
}
