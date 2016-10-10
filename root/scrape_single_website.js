var DatabasePackage = require('levelup');
var Database = DatabasePackage('./database');

var OpsFromMiddleWare = require('./scrapertool/raw_data_converter.js');

const websiteName = process.argv.slice(2);

OpsFromMiddleWare.rawScrapeDataToDbOps(websiteName[0]).then(function(ops) {

  Database.batch(ops, function (err) {
      if (err) { return console.log('Ooops!', err); }
      console.log('All recipes succesfully stored!');

      var siteList = [];
      var amountOfScrapedRecipes = 0;

      Database.createReadStream()
          .on('data', function(data) {
            if (data.key.includes('link')) {
              amountOfScrapedRecipes += 1;
            }
            if (data.key.includes("recipeamt")) {
              siteList.push(data.key.replace("recipeamt", ""));
            }
          })
          .on('close', function() {
            console.log("Process finished, found " + amountOfScrapedRecipes + " links.");
            console.log("Found these scraped websites: " + siteList);
            Database.put('numberofrecipes', amountOfScrapedRecipes, function(err) {
              Database.put('sitelist', siteList, function(err) {
                console.log("successfully stored amountOfScrapedRecipes: "
                    + amountOfScrapedRecipes
                    + ", and siteList: "
                    + siteList);
                Database.close();
              });
            });
          });

  });
});
