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
var app = express();
var recipes = require('./scrape_recipes.js');

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

  recipes.getAmountOfRecipes().then(function(amount) {

    randomnumber = Math.floor(Math.random() * amount);
    console.log("\nSent:\nrandom index position: " + randomnumber + " from a total index of: " + amount);

    return recipes.getRecipeName(randomnumber);
  }).then(function(recipe) {

    recipeName = recipe;
    console.log("name: " + recipeName);

    return recipes.getRecipeLink(randomnumber)
  }).then(function(link) {

    recipeLink = link;
    console.log("link: " + recipeLink);

    if (recipeName === undefined || recipeName === null) {

      recipeName = "Inga recept i databasen, eller ingen databas, testa att skriva 'scrape' i konsolen";
    }

    res.render('index', {

    title: "Vegansk middag",
    header: "Vad ska jag laga för mat idag?",
    link: recipeLink,
    recipe: recipeName
  });
});

});

var stdin = process.openStdin();

stdin.addListener("data", function(command) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    console.log("you entered: [" +
        command.toString().trim() + "]");

    switch (command.toString().trim()) {
      case "scrape": console.log("scraping websites...");
            recipes.scrapeRecipes();
            break;
      case "help": console.log("commands:");
            console.log("'scrape': scrape the links in vegan_link.json for recipes,\nand put into ./database (or set up database with recipes of none exists)");
            console.log("'scrapelatest': scrape all the latest unscraped websites from vegan_links.json,\nand put into ./database");
            console.log("'scrapetest': tests the links found in vegan_link.json and outputs the scraped value, for debugging");
            console.log("'scrapetestlatest': test latest link added in vegan_links.json and output to console, for debugging");
            console.log("'logveganlinks': output contents of vegan_links.json");
            break;
      case "scrapetest": console.log("tries to scrape from vegan_link.json, output:");
            recipes.testScrapeRecipes();
            break;
      case "scrapelatest": console.log("scraping all the latest unscraped websites from vegan_links.json, output:");
            recipes.scrapeUnscrapedRecipes();
            break;
      case "scrapetestlatest": console.log("tries to scrape the latest website from vegan_links.json, output:");
            recipes.testScrapeLatestSite();
            break;
      case "logveganlinks": console.log("outputting the contents of vegan_links.json...");
            recipes.logJSONFile();
            break;
      case "getAmountOfRecipes": console.log("amount of recipes stored in database:");
            recipes.getAmountOfRecipes().then(function(amount) {
              console.log(amount);
            });
            break;
    }
});

app.listen(8080);
console.log('Express app started on port %d', 8080);
console.log("type 'help' for list of commands\ntype 'scrape' to setup ./database");
