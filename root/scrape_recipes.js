/*KNOWN BUGS:

something weird happens (ie, nothing) when trying to use the 'scrape' command again
It has possibly something to do with FIXED, proper scoping of variables has fixed it.

*/

/*TODO:
Hög prioritet:
-PAGINATION!!!! DAGS FÖR TEST AV PAGINATION

Låg prioritet:
-Stöd för att ändra json när servern körs
-Uppdatera vegan_links på något sätt, ta bort den från cache-minnet så man kan läsa in skiten igen.
*/

var Xray = require('x-ray');
var x = Xray();
var links = require('./vegan_links.json');
var level = require('levelup');
var db = level('./database');

/////////////////////////////////////////
////  use Xray to scrape website ////////
/////////////////////////////////////////

//EXTERNAL_FUNCTION, THIS FUNCTION IS CALLED FROM: server.js
//scrapes recipes from all websites found in vegan_links.json,
//puts them into database
var scrapeRecipes = function() {

  var index = (Object.keys(links).length - 1);

  getRecipesFromLinks([], index).then(function(results) {
      if (index > 0) {
        index -= 1
        return getRecipesFromLinks(results, index);
      }
    }).then(function(results) {
      storeScrapedRecipes(results, 0);
    });
}

//EXTERNAL_FUNCTION, THIS FUNCTION IS CALLED FROM: server.js
//scrapes recipes from latest unscraped websites found in vegan_links.json,
//puts them into database
var scrapeUnscrapedRecipes = function() {

  var lastSiteScraped;
  var indexInDatabase;

  getAmountofScrapedSites().then(function(value) {

    if((Object.keys(links).length - value) === 0)
        {// the rest of the task chain is unnecessary
            console.log('aborting scrape, already filled up!');
            throw new Error('abort promise chain');
            return null;
    }

    lastSiteScraped = value;

    if (value === undefined || value === null) {
      lastSiteScraped = 0;
    }

    return getAmountOfRecipes();
  }).then(function(amountOfRecipes) {
    indexInDatabase = amountOfRecipes;
    var index = Object.keys(links).length;

    getRecipesFromLinks([], index).then(function(results) {
        storeScrapedRecipes(results, indexInDatabase);
    })
  });

}

//promise function, resolves amount of websites scraped from database (based on index)
var getAmountofScrapedSites = function() {

  return new Promise(function(resolve, reject) {

    db.get("numberOfScrapedWebsites", function(err, amount) {
    resolve(amount);
  });
});
}

//EXTERNAL_FUNCTION, THIS FUNCTION IS CALLED FROM: server.js
//scrapes recipes from all websites found in vegan_links.json,
//and outputs to console.
var testScrapeRecipes = function() {
  getRecipesFromLinks([], index).then(function(results) {
      if (index > 0) {
        index -= 1
        return getRecipesFromLinks(results, index);
      }
    }).then(function(results) {

      console.log(results);
    });
}


//EXTERNAL_FUNCTION, THIS FUNCTION IS CALLED FROM: server.js
//scrapes recipes from latest website found in vegan_links.json,
//and outputs to console.
var testScrapeLatestSite = function() {
  getRecipesFromLinks([], Object.keys(links).length - 1).then(function(results) {
    console.log(results);
  })
}


var testScrapePaginatedSite = function() {

  var index = 0;
  x(links[index]["recipesLink"], links[index]["recipeId"], [{
      recipeName: links[index]["recipeNamesId"],
      recipeLink: links[index]["recipeLinksId"]
  }]).paginate(links[index]["paginate"])(function(err, obj) {

    if (err) { reject(err); }
    console.log(obj);
})
}


//EXTERNAL_FUNCTION, THIS FUNCTION IS CALLED FROM: server.js
//A promisified function, scrapes recipes from websites found in vegan_links.json
var getRecipesFromLinks = function(recipes, index) {

  return new Promise(function(resolve, reject) {

      x(links[index]["recipesLink"], links[index]["recipeId"], [{
          recipeName: links[index]["recipeNamesId"],
          recipeLink: links[index]["recipeLinksId"]
      }]).paginate(links[index]["paginate"])(function(err, obj) {

        if (err) { reject(err); }

        recipes = recipes.concat(obj);
        var tempIndex = index;
        tempIndex -= 1;
        if (tempIndex == 0) {
          resolve(recipes);
        }
        if (tempIndex > 0) {
          getRecipesFromLinks(recipes, tempIndex).then(function(results) {
            resolve(results);
        });
      }
    });
  });
}

module.exports.scrapeRecipes = scrapeRecipes;
module.exports.scrapeUnscrapedRecipes = scrapeUnscrapedRecipes;
module.exports.testScrapeRecipes = testScrapeRecipes;
module.exports.testScrapeLatestSite = testScrapeLatestSite;

/////////////////////////////////////////////////////
/// store scraped list of recipes into './database'//
/////////////////////////////////////////////////////

//store a list of scraped recipes with format:
//{
//    recipeName: links[index]["recipeNamesId"],
//    recipeLink: links[index]["recipeLinksId"]
//}
//store into ./database with level db.
var storeScrapedRecipes = function(listOfScrapedRecipes, startIndex) {

  var ops = [];
  var recipeAmountOps = [];
  var recipeOps = [];
  var recipeLinkOps = [];
  var tempRecipeOps = {};
  var tempRecipeLinkOps = {};
  var recipeSitesScrapedOps = [];

  var indexed = startIndex;

  console.log(listOfScrapedRecipes);

  for (index in listOfScrapedRecipes) {

    var linkIndex = "linkIndex" + index.toString();
    var recipeIndex = "recipeIndex" + index.toString();

    tempRecipeOps = {
      type: 'put',
      key: recipeIndex,
      value: listOfScrapedRecipes[index]['recipeName']
     }

    recipeOps = recipeOps.concat(tempRecipeOps);

    tempRecipeLinkOps = {
      type: 'put',
      key: linkIndex,
      value: listOfScrapedRecipes[index]['recipeLink']
    }
    recipeLinkOps = recipeLinkOps.concat(tempRecipeLinkOps);

    indexed += 1;
  }

  recipeAmountOps = {
    type: 'put',
    key: "numberOfRecipes",
    value: indexed
  };

  recipeSitesScrapedOps = {
    type: 'put',
    key: "numberOfScrapedWebsites",
    value: Object.keys(links).length
  };

  ops = recipeOps.concat(recipeLinkOps, recipeAmountOps, recipeSitesScrapedOps);
  console.log(ops);

  db.batch(ops, function (err) {
    if (err) { return console.log('Ooops!', err); }
    console.log('All recipes succesfully stored!');
    });
}

//////////////////////////////////////////////
//Extra functions to be exported to server.js/
//////////////////////////////////////////////



//EXTERNAL_FUNCTION, THIS FUNCTION IS CALLED FROM: server.js
//outputs the content of vegan_links.json to consolt
var logJSONFile = function() {

    console.log(links);
}

module.exports.logJSONFile = logJSONFile;
module.exports.getAmountOfRecipes = getAmountOfRecipes;
module.exports.getRecipeName = getRecipeName;
module.exports.getRecipeLink = getRecipeLink;
