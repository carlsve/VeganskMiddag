/**
  * A setup that is put in
  */

var levelup = require('levelup')
var Database = levelup('./database')

var siteList = [];
var amountOfScrapedRecipes = 0;

Database.createReadStream()
    .on('data', function(data) {
      if (data.key.includes('link')) {
        amountOfScrapedRecipes += 1;
      }
      if (data.key.includes("recipeamt")) {
        siteList.push(data.key);
      }
    })
    .on('close', function() {
      console.log("Process finished, found " + amountOfScrapedRecipes + " links.");
      Database.put('numberofrecipes', amountOfScrapedRecipes, function(err) {
        Database.put('sitelist', siteList, function(err) {
          console.log("successfully stored amountOfScrapedRecipes and siteList!");
          Database.close();
        });
      });
    });
