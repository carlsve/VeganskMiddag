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
