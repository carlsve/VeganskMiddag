/*This file has a function that turns raw scrape data to an ops object to be put into database.*/


var rawScrapeDataToDbOps = function(folderName) {
  return new Promise(function(resolve, reject) {

    var site = require("./lib/" + folderName + "/index.js");

    site.scrapeWebsite().then(function(listOfScrapedRecipes) {
        var ops = [];
        var recipeAmountOps = [];
        var recipeOps = [];
        var recipeLinkOps = [];
        var tempRecipeOps = {};
        var tempRecipeLinkOps = {};
        var indexedRecipes = 0;

        for (index in listOfScrapedRecipes) {

          var linkIndex = folderName + "link" + index.toString();
          var recipeIndex = folderName + index.toString();

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

          indexedRecipes += 1;
        }

        recipeAmountOps = {
          type: 'put',
          key: folderName,
          value: indexedRecipes
        };

        ops = recipeOps.concat(recipeLinkOps, recipeAmountOps);

        resolve(ops);
    });
  });
}

module.exports.rawScrapeDataToDbOps = rawScrapeDataToDbOps;
